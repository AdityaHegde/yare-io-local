import {Player} from "../game/Player";
import {SpiritMoveEvent} from "../events/SpiritMoveEvent";
import {SpiritEnergizeEvent} from "../events/SpiritEnergizeEvent";
import {getBlankSight} from "../utils/misc";
import {Log, Logger} from "../utils/Logger";
import {Intractable, Position, Spirit} from "../globals/gameTypes";
import {SpiritData} from "./Data";
import {SpiritJumpEvent} from "../events/SpiritJumpEvent";
import {SpiritType} from "../game/SpiritType";
import {isWithinRange} from "../utils/GridUtils";
import {ACTION_DISTANCE, MERGE_DISTANCE_SQUARED} from "../constants";
import {SpiritMergeEvent} from "../events/SpiritMergeEvent";
import {SpiritDivideEvent} from "../events/SpiritDivideEvent";

@Log
export class SpiritImpl implements Spirit {
  public id: string;
  public hp = 1;
  // used to mark the spirit dead in next tick
  public deadFor = 1;
  public energy: number;
  public energy_capacity: number;
  public size: number;
  public position: Position;
  public sight = getBlankSight();
  public mark: string;
  public last_energized: string;

  public range = ACTION_DISTANCE;

  public mergedCount = 0;
  public mergedSpiritIds = new Set<string>();

  public owner: Player;

  private logger: Logger;

  constructor(
    id: string, position: Position,
    owner: Player, energyOverride = SpiritData[owner.spiritType].energyCapacity,
  ) {
    this.id = id;
    this.energy_capacity = SpiritData[owner.spiritType].energyCapacity;
    this.energy = energyOverride;
    this.size = SpiritData[owner.spiritType].size;
    this.position = position;
    this.owner = owner;
  }

  public move(position: Position): void {
    this.owner.game.gameEventLoop.addEvent(new SpiritMoveEvent(this, [...position]));
  }

  public energize(target: Intractable): void {
    this.owner.game.gameEventLoop.addEvent(new SpiritEnergizeEvent(this, target));
  }

  public merge(target: SpiritImpl): void {
    if (this.owner.spiritType === SpiritType.Circle && isWithinRange(this, target, MERGE_DISTANCE_SQUARED)) {
      this.owner.game.gameEventLoop.addEvent(new SpiritMergeEvent(this, target));
    }
  }

  public divide(): void {
    if (this.owner.spiritType === SpiritType.Circle && this.mergedCount > 0) {
      this.owner.game.gameEventLoop.addEvent(new SpiritDivideEvent(this));
    }
  }

  public jump(position: Position): void {
    if (this.owner.spiritType === SpiritType.Square &&
        this.energy >= Math.ceil(this.energy_capacity / 2)) {
      this.owner.game.gameEventLoop.addEvent(new SpiritJumpEvent(this, [...position]));
    }
  }

  public shout(message: string): void {
  }

  public set_mark(label: string): void {
  }

  public mergeStats(spiritImpl: SpiritImpl) {
    this.size += spiritImpl.size;
    this.energy_capacity += spiritImpl.energy_capacity;
    this.mergedCount += spiritImpl.mergedCount + 1;
    this.mergedSpiritIds.add(spiritImpl.id);
    spiritImpl.mergedSpiritIds.forEach(mergedSpiritId => this.mergedSpiritIds.add(mergedSpiritId));
  }

  public resetStats() {
    // add the excess energy to the source
    const energyDist = Math.floor(this.energy / this.mergedCount);
    this.energy = energyDist + (this.energy - energyDist * this.mergedCount);
    this.energy_capacity = SpiritData[this.owner.spiritType].energyCapacity;
    this.size = SpiritData[this.owner.spiritType].size;

    this.mergedSpiritIds = new Set();
    this.mergedCount = 0;
  }
}
