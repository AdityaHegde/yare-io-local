import {Energy, Position} from "../globals/gameTypes";
import {STAR_CONSTANT_REGEN, STAR_MAX_ENERGY, STAR_PERCENT_REGEN} from "../constants";

export class EnergyImpl implements Energy {
  public id: string;
  public position: Position;
  public structure_type = "star";
  public energy: number;
  public startTick: number;

  constructor(
    id: string, position: Position,
    initialEnergy: number, startTick: number,
  ) {
    this.id = id;
    this.position = position;
    this.energy = initialEnergy;
    this.startTick = startTick;
  }

  public postTick(tickNum: number) {
    if (tickNum >= this.startTick) {
      this.energy = Math.min(
        Math.round(this.energy * (1 + STAR_PERCENT_REGEN)) + STAR_CONSTANT_REGEN,
        STAR_MAX_ENERGY,
      );
    }
  }
}
