import {GameEvent, GameEventType} from "./GameEvent";
import {SpiritImpl} from "../impl/SpiritImpl";
import {ORIGINAL_ACTION_DISTANCE_SQUARED} from "../constants";
import {isWithinRange} from "../utils/GridUtils";
import {Energy, EnergyEntity, Intractable} from "../globals/gameTypes";

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
      let star: Energy;
      if (isWithinRange(this.source, this.source.owner.game.star_a1c, ORIGINAL_ACTION_DISTANCE_SQUARED)) {
        star = this.source.owner.game.star_a1c;
      } else if (isWithinRange(this.source, this.source.owner.game.star_zxq, ORIGINAL_ACTION_DISTANCE_SQUARED)) {
        star = this.source.owner.game.star_zxq;
      }
      if (!star) {
        return;
      }
      this.source.energy = Math.min(this.source.energy + this.source.size, this.source.energy_capacity);
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
      } else {
        energyEntity.hp = Math.max(0, energyEntity.hp - transferEnergy);
      }
    }

    this.source.energy -= transferEnergy;
  }
}
