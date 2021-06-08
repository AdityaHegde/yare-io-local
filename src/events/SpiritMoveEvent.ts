import {GameEventType, GameEvent} from "./GameEvent";
import {SpiritImpl} from "../impl/SpiritImpl";
import {MOVE_DISTANCE} from "../constants";
import {moveToPoint} from "../utils/GridUtils";
import {Position} from "../globals/gameTypes";

export class SpiritMoveEvent extends GameEvent {
  public source: SpiritImpl;
  public targetPosition: Position;

  constructor(source: SpiritImpl, targetPosition: Position) {
    super(`${GameEventType.SPIRIT_MOVE}--${source.id}`);
    this.source = source;
    this.targetPosition = targetPosition;
  }

  public run() {
    this.source.position = moveToPoint(this.source.position, this.targetPosition, MOVE_DISTANCE);
  }
}
