import {Player} from "../Player";
import {SpiritMoveEvent} from "../events/SpiritMoveEvent";
import {SpiritEnergizeEvent} from "../events/SpiritEnergizeEvent";
import {getBlankSight} from "../utils/misc";
import {Log, Logger} from "../utils/Logger";
import {Intractable, Position, Spirit} from "../globals/gameTypes";
import {SpiritData} from "./Data";
import {SpiritJumpEvent} from "../events/SpiritJumpEvent";
import {SpiritType} from "../SpiritType";
import {isWithinRange} from "../utils/GridUtils";
import {MERGE_DISTANCE_SQUARED} from "../constants";

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
    this.owner.game.gameEventLoop.addEvent(new SpiritMoveEvent(this, position));
  }

  public energize(target: Intractable): void {
    this.owner.game.gameEventLoop.addEvent(new SpiritEnergizeEvent(this, target));
  }

  public merge(target: Spirit): void {
    if (this.owner.spiritType === SpiritType.Circle && isWithinRange(this, target, MERGE_DISTANCE_SQUARED)) {

    }
  }

  public divide(): void {
    if (this.owner.spiritType === SpiritType.Circle && this.mergedCount > 0) {

    }
  }

  public jump(position: Position): void {
    if (this.owner.spiritType === SpiritType.Square &&
      this.energy >= Math.ceil(this.energy_capacity / 2)) {
      this.owner.game.gameEventLoop.addEvent(new SpiritJumpEvent(this, position));
    }
  }

  public shout(message: string): void {
  }

  public set_mark(label: string): void {
  }

  public resetSight() {
    this.sight = getBlankSight();
  }

  public addSpiritToSight(spiritImpl: SpiritImpl) {
    this.updateSightWithSpirit(spiritImpl);
    spiritImpl.updateSightWithSpirit(this);
  }

  public updateSightWithSpirit(spiritImpl: SpiritImpl) {
    if (this.owner === spiritImpl.owner) {
      this.sight.friends.push(spiritImpl.id);
    } else {
      this.sight.enemies.push(spiritImpl.id);
    }
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
