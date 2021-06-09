import {GameEvent, GameEventType} from "./GameEvent";
import {SpiritImpl} from "../impl/SpiritImpl";
import {moveToPoint} from "../utils/GridUtils";
import {MAX_MERGE_COUNT, MOVE_DISTANCE} from "../constants";

export class SpiritMergeEvent extends GameEvent {
  private readonly source: SpiritImpl;

  constructor(source: SpiritImpl) {
    super(`${GameEventType.SPIRIT_DIVIDE}--${source.id}`);
    this.source = source;
  }

  public run() {
    if (this.source.mergedCount === 0) {
      return;
    }
    this.source.owner.base.spiritHasSplit(this.source);
    this.source.resetStats();
  }
}
