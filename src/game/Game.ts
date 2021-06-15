import {Player} from "./Player";
import {EnergyImpl} from "../impl/EnergyImpl";
import {SpiritImpl} from "../impl/SpiritImpl";
import {GameEventLoop} from "../events/GameEventLoop";
import {Grid} from "./Grid";
import {SpiritType} from "./SpiritType";

export class Game {
  public players = new Array<Player>();
  public stars = new Array<EnergyImpl>();

  public spirits: {
    [k in string]: SpiritImpl
  } = {};

  public gameEventLoop: GameEventLoop;

  public grid: Grid;

  constructor(playerSpiritTypes: Array<SpiritType>) {
    this.gameEventLoop = new GameEventLoop(this);
    this.grid = new Grid(this);
    playerSpiritTypes.forEach((playerSpiritType, idx) =>
      this.players.push(new Player(`Player${idx}`, this, playerSpiritType)));
  }

  public init() {
    this.players.forEach((player, index) => {
      player.spirits.forEach(spirit => this.spiritAdded(spirit));
      player.on(Player.SPIRIT_CREATED, spirit => this.spiritAdded(spirit));
    });
  }

  public spiritAdded(spirit: SpiritImpl) {
    this.spirits[spirit.id] = spirit;
  }

  public spiritDestroyed(spirit: SpiritImpl) {
    delete this.spirits[spirit.id];
    spirit.owner.spiritDestroyed(spirit);
  }

  public getGlobalsForPlayer(index: number): Record<string, any> {
    const enemyIndex = (index + (index % 2 === 0 ? 1 : -1)) % this.players.length;
    const player = this.players[index];
    const enemyPlayer = this.players[enemyIndex];
    const globalAlias: Record<string, any> = {};

    globalAlias.spirits = this.spirits;
    globalAlias.my_spirits = player.spirits;
    globalAlias.base = player.base;
    globalAlias.enemy_base = enemyPlayer.base;
    globalAlias[this.stars[index].id] = this.stars[index];
    globalAlias[this.stars[enemyIndex].id] = this.stars[enemyIndex];
    globalAlias.memory = player.memory;

    return globalAlias;
  }
}
