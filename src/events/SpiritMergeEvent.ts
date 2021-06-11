import {GameEvent, GameEventType} from "./GameEvent";
import {SpiritImpl} from "../impl/SpiritImpl";
import {MAX_MERGE_COUNT, MOVE_DISTANCE} from "../constants";

export class SpiritMergeEvent extends GameEvent {
  private readonly source: SpiritImpl;
  private readonly target: SpiritImpl;

  constructor(source: SpiritImpl, target: SpiritImpl) {
    super(GameEventType.SPIRIT_MERGE, source.id);
    this.source = source;
    this.target = target;
  }

  public run() {
    if (this.target.mergedCount + this.source.mergedCount > MAX_MERGE_COUNT) {
      return;
    }
    this.target.mergeStats(this.source);
    this.source.hp = 0;
  }
}
