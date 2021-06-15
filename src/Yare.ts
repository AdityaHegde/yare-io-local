import {GameRunner} from "./runner/GameRunner";
import {Game} from "./game/Game";
import {Renderer} from "./renderer/Renderer";
import {MapGenerator} from "./map-generator/MapGenerator";
import {Player} from "./game/Player";

export type YareConfig = {
  runIntervalInMs: number;
  pauseOnError?: boolean;
}

export class Yare {
  private readonly game: Game;
  private readonly gameRunner: GameRunner;
  private readonly renderer: Renderer;
  private readonly mapGenerator: MapGenerator;

  private readonly runIntervalInMs: number;
  private readonly pauseOnError: boolean;

  private runIntervalId: any;
  private ended = false;

  public errorFrom = -1;
  public errorStack: string;

  constructor(
    game: Game, gameRunner: GameRunner, renderer: Renderer,
    mapGenerator: MapGenerator,
    {runIntervalInMs, pauseOnError}: YareConfig,
  ) {
    this.game = game;
    this.gameRunner = gameRunner;
    this.renderer = renderer;
    this.mapGenerator = mapGenerator;

    this.runIntervalInMs = runIntervalInMs;
    this.pauseOnError = pauseOnError || false;
  }

  public async init() {
    this.mapGenerator.generate(this.game);
    await this.gameRunner.init();
    await this.renderer.init();

    this.gameRunner.on(GameRunner.SPIRIT_CREATED, spirit => this.renderer.spiritCreated(spirit));
    this.gameRunner.on(GameRunner.SPIRIT_DESTROYED, spirit => this.renderer.spiritDestroyed(spirit));
    this.gameRunner.on(GameRunner.BASE_DESTROYED, () => {
      this.ended = true;
      this.pause();
    });
    if (this.pauseOnError) {
      this.gameRunner.on(GameRunner.ERROR_THROWN, (errorFrom, errorStack) => {
        this.errorFrom = errorFrom;
        this.errorStack = errorStack;
        this.pause();
      });
    }
  }

  public resume() {
    if (this.runIntervalId || this.ended) {
      return;
    }
    this.runIntervalId = setInterval(async () => {
      await this.tick();
    }, this.runIntervalInMs);
  }

  public async tick() {
    try {
      await this.gameRunner.run();
      await this.renderer.render();
    } catch (err) {
      console.log(err);
    }
  }

  public pause() {
    if (!this.runIntervalId) {
      return
    }
    clearInterval(this.runIntervalId);
    this.runIntervalId = 0;
  }

  public async runUntil(
    endCheck: (player: Player) => boolean = player => player.base.hp <= 0 || player.base.hasReachedMaxSpirits(),
    maxTicks = 2000,
  ) {
    await this.init();

    for (
      let i = 0;
      i < maxTicks && this.game.players.every(player => !endCheck(player)) && this.errorFrom === -1;
      i++
    ) {
      await this.tick();
    }
  }
}
