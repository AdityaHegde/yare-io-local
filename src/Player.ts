import {BaseImpl} from "./impl/BaseImpl";
import {Game} from "./Game";
import {SpiritImpl} from "./impl/SpiritImpl";
import EventEmitter from "events";

export class Player extends EventEmitter {
  public name: string;
  public base: BaseImpl;
  public spirits = new Array<SpiritImpl>();
  public memory: Record<any, any> = {};
  public game: Game;

  public static SPIRIT_DESTROYED = "spirit-destroyed";
  public static SPIRIT_CREATED = "spirit-created";

  constructor(name: string, game: Game) {
    super();
    this.name = name;
    this.game = game;
  }

  public bootstrapData(index: number) {
    this.base = new BaseImpl(`base_${this.name}`, 200,
      [1600 + 1200 * index, 700 + 1000 * index], this);

    for (let i = 0; i < 7; i++) {
      this.addNewSpirit(this.base.createSpirit(
        [1500 + i * 50 + 1200 * index, 500 + 1000 * index],
      ));
    }
  }

  public addNewSpirit(spirit: SpiritImpl) {
    this.spirits.push(spirit);
    this.emit(Player.SPIRIT_CREATED, spirit);
  }

  public spiritDestroyed(spirit: SpiritImpl) {
    const idx = this.spirits.indexOf(spirit);
    if (idx >= 0) {
      this.spirits.splice(idx, 1);
    }
    this.emit(Player.SPIRIT_DESTROYED, spirit);
  }
}
