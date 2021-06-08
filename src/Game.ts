import {Player} from "./Player";
import {EnergyImpl} from "./impl/EnergyImpl";
import {SpiritImpl} from "./impl/SpiritImpl";
import {GameEventLoop} from "./events/GameEventLoop";
import {Grid} from "./Grid";

export class Game {
  public players: Array<Player>;
  public star_zxq: EnergyImpl;
  public star_a1c: EnergyImpl;

  public spirits: {
    [k in string]: SpiritImpl
  } = {};

  public gameEventLoop: GameEventLoop;

  public grid: Grid;

  constructor() {
    this.gameEventLoop = new GameEventLoop(this);
    this.grid = new Grid(this);
    this.players = [
      new Player("one", this),
      new Player("two", this),
    ];
  }

  public init() {
    this.star_zxq = new EnergyImpl("star_zxq", [1000, 1000]);
    this.star_a1c = new EnergyImpl("star_a1c", [3400, 1400]);

    this.players.forEach((player, index) => {
      player.bootstrapData(index);
      player.spirits.forEach((spirit) => {
        this.spirits[spirit.id] = spirit;
      });
      player.on(Player.SPIRIT_CREATED, spirit => this.spirits[spirit.id] = spirit);
    });
  }

  public spiritDestroyed(spirit: SpiritImpl) {
    delete this.spirits[spirit.id];

    ((spirit as any).owner as Player).spiritDestroyed(spirit);
  }

  public getGlobalsForPlayer(index: number): Record<string, any> {
    const player = this.players[index];
    const enemyPlayer = this.players[(index + 1) % this.players.length];
    const globalAlias: Record<string, any> = {};

    globalAlias.spirits = this.spirits;
    globalAlias.my_spirits = player.spirits;
    globalAlias.base = player.base;
    globalAlias.enemy_base = enemyPlayer.base;
    globalAlias.star_zxq = this.star_zxq;
    globalAlias.star_a1c = this.star_a1c;
    globalAlias.memory = player.memory;

    return globalAlias;
  }
}
