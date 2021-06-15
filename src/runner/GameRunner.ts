import { EventEmitter } from "events";
import {Game} from "../game/Game";
import {Player} from "../game/Player";
import {Log, Logger} from "../utils/Logger";
import {AIRunner} from "./AIRunner";
import assert from "assert";

@Log
export class GameRunner extends EventEmitter {
  private logger: Logger;

  public game: Game;
  public aiRunner: Array<AIRunner>;

  public static readonly SPIRIT_DESTROYED = "spirit-destroyed";
  public static readonly SPIRIT_CREATED = "spirit-created";
  public static readonly BASE_DESTROYED = "base-destroyed";
  public static readonly ERROR_THROWN = "error-thrown";

  constructor(game: Game, aiRunner: Array<AIRunner>) {
    super();
    this.game = game;
    this.aiRunner = aiRunner;
  }

  public async init() {
    this.game.init();
    this.game.players.forEach((player) => {
      player.on(Player.SPIRIT_CREATED, spirit => this.emit(GameRunner.SPIRIT_CREATED, spirit));
      player.on(Player.SPIRIT_DESTROYED, spirit => this.emit(GameRunner.SPIRIT_DESTROYED, spirit));
    });
    for (const aiRunner of this.aiRunner) {
      await aiRunner.init();
    }
  }

  public async run(): Promise<void> {
    await this.tick();
    await this.postTick();
  }

  private async tick(): Promise<void> {
    this.game.grid.tick();
    for (let i = 0; i < this.game.players.length; i++) {
      await this.tickForPlayer(i);
    }
    this.game.gameEventLoop.tick();
  }

  private async postTick(): Promise<void> {
    for (let i = 0; i < this.game.players.length; i++) {
      this.postTickForPlayer(i);
    }
    this.game.gameEventLoop.postTick();
    this.game.grid.postTick();
  }

  private async tickForPlayer(index: number): Promise<void> {
    try {
      await this.aiRunner[index].run(this.game.getGlobalsForPlayer(index));
    } catch (err) {
      this.emit(GameRunner.ERROR_THROWN, index, err.stack);
    }
  }

  private postTickForPlayer(index: number) {
    const player = this.game.players[index];

    player.spirits.forEach((spirit) => {
      if (spirit.hp > 0) {
        return;
      }

      if (spirit.deadFor === 0) {
        this.game.spiritDestroyed(spirit)
      }
      spirit.deadFor--;
    });

    if (player.base.hp === 0) {
      this.emit(GameRunner.BASE_DESTROYED, player);
    }

    player.base.createSpiritIfEnoughEnergy();
    player.base.addBackSplitSpirits();
  }
}
