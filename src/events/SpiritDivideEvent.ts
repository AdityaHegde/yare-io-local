import {GameEvent, GameEventType} from "./GameEvent";
import {SpiritImpl} from "../impl/SpiritImpl";

export class SpiritDivideEvent extends GameEvent {
  private readonly source: SpiritImpl;

  constructor(source: SpiritImpl) {
    super(GameEventType.SPIRIT_DIVIDE, source.id);
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
