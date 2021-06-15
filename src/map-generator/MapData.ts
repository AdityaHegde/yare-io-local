import {Position} from "../globals/gameTypes";

export class MapData {
  public readonly GridSize: Position;

  public readonly StartingBasePos: Position;
  public readonly BasePosMultiplier: Position;

  public readonly StartingStarPos: Position;
  public readonly StarPosMultiplier: Position;

  constructor({
    GridSize,
    StartingBasePos, BasePosMultiplier,
    StartingStarPos, StarPosMultiplier,
  }: {
    GridSize: Position,
    StartingBasePos: Position, BasePosMultiplier: Position,
    StartingStarPos: Position, StarPosMultiplier: Position,
  }) {
    this.GridSize = GridSize;

    this.StartingBasePos = StartingBasePos;
    this.BasePosMultiplier = BasePosMultiplier;

    this.StartingStarPos = StartingStarPos;
    this.StarPosMultiplier = StarPosMultiplier;
  }

  public static getBasicMapData() {
    return new MapData({
      GridSize: [2500, 2000],
      StartingBasePos: [1000, 700], BasePosMultiplier: [1000, 1000],
      StartingStarPos: [400, 1000], StarPosMultiplier: [2200, 400],
    });
  }
}
