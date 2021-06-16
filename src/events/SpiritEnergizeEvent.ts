import {GameEvent, GameEventType} from "./GameEvent";
import {SpiritImpl} from "../impl/SpiritImpl";
import {ORIGINAL_ACTION_DISTANCE_SQUARED} from "../constants";
import {isWithinRange} from "../utils/GridUtils";
import {Energy, EnergyEntity, Intractable} from "../globals/gameTypes";
import {OutpostImpl} from "../impl/OutpostImpl";

export class SpiritEnergizeEvent extends GameEvent {
  public source: SpiritImpl;
  public target: Intractable;

  constructor(source: SpiritImpl, target: Intractable) {
    super(GameEventType.SPIRIT_ENERGIZE, source.id);
    this.source = source;
    this.target = target;
  }

  public run() {
    if (this.target === this.source) {
      for (const star of this.source.owner.game.stars) {
        if (isWithinRange(this.source, star, ORIGINAL_ACTION_DISTANCE_SQUARED) && star.energy >= this.source.size) {
          this.source.energy = Math.min(this.source.energy + this.source.size, this.source.energy_capacity);
          star.energy -= this.source.size;
          return;
        }
      }
      return;
    }

    if (!isWithinRange(this.source, this.target, ORIGINAL_ACTION_DISTANCE_SQUARED) || this.source.energy === 0) {
      return;
    }

    const targetOwner = (this.target as any).owner;
    const energyEntity: EnergyEntity = this.target as any;
    if (!energyEntity.energy_capacity) {
      return;
    }

    const transferEnergy = Math.min(this.source.size, this.source.energy);

    if (targetOwner === this.source.owner) {
      energyEntity.energy = Math.min(energyEntity.energy + transferEnergy, energyEntity.energy_capacity);
    } else {
      if (energyEntity.energy > 0) {
        energyEntity.energy = Math.max(energyEntity.energy - 2 * transferEnergy, 0);
        if (energyEntity.energy === 0 && energyEntity instanceof OutpostImpl) {
          energyEntity.loseControl();
        }
      } else if (energyEntity instanceof OutpostImpl) {
        energyEntity.takeControl(this.source.owner, transferEnergy);
      } else {
        energyEntity.hp = Math.max(0, energyEntity.hp - transferEnergy);
      }
    }

    this.source.energy -= transferEnergy;
  }
}
