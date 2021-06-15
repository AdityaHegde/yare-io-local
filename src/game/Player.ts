import {BaseImpl} from "../impl/BaseImpl";
import {Game} from "./Game";
import {SpiritImpl} from "../impl/SpiritImpl";
import {SpiritType} from "./SpiritType";
import {BaseData} from "../impl/Data";
import EventEmitter from "events";

export class Player extends EventEmitter {
  public name: string;
  public base: BaseImpl;
  public spirits = new Array<SpiritImpl>();
  public memory: Record<any, any> = {};
  public game: Game;

  public spiritType: SpiritType;

  public static readonly SPIRIT_DESTROYED = "spirit-destroyed";
  public static readonly SPIRIT_CREATED = "spirit-created";

  constructor(name: string, game: Game, spiritType: SpiritType) {
    super();
    this.name = name;
    this.game = game;
    this.spiritType = spiritType;
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
    this.base.removeSpirit(spirit);
    this.emit(Player.SPIRIT_DESTROYED, spirit);
  }
}
