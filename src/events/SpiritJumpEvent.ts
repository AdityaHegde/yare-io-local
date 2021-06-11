import {GameEvent, GameEventType} from "./GameEvent";
import {SpiritImpl} from "../impl/SpiritImpl";
import {Position} from "../globals/gameTypes";
import {moveToPoint} from "../utils/GridUtils";
import {JUMP_DISTANCE, MOVE_DISTANCE} from "../constants";

export class SpiritJumpEvent extends GameEvent {
  public source: SpiritImpl;
  public targetPosition: Position;

  constructor(source: SpiritImpl, targetPosition: Position) {
    super(GameEventType.SPIRIT_JUMP, source.id);
    this.source = source;
    this.targetPosition = targetPosition;
  }

  public run() {
    this.source.position = moveToPoint(this.source.position, this.targetPosition, JUMP_DISTANCE);
    this.source.energy -= Math.ceil(this.source.energy_capacity / 2);
  }
}
