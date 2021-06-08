import {Energy, Position} from "../globals/gameTypes";

export class EnergyImpl implements Energy {
  public id: string;
  public position: Position;
  public structure_type = "star";

  constructor(id: string, position: Position) {
    this.id = id;
    this.position = position;
  }
}
