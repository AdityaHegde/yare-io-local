import {Position} from "../globals/gameTypes";

export class MapData {
  public readonly GridSize: Position;

  public readonly StartingBasePos: Position;
  public readonly BasePosMultiplier: Position;

  public readonly StartingStarPos: Position;
  public readonly StarPosMultiplier: Position;
  public readonly MiddleStarPos: Position;

  public readonly MiddleOutpostPos: Position;

  constructor({
    GridSize,
    StartingBasePos, BasePosMultiplier,
    StartingStarPos, StarPosMultiplier, MiddleStarPos,
    MiddleOutpostPos,
  }: {
    GridSize: Position,
    StartingBasePos: Position, BasePosMultiplier: Position,
    StartingStarPos: Position, StarPosMultiplier: Position, MiddleStarPos: Position,
    MiddleOutpostPos: Position,
  }) {
    this.GridSize = GridSize;

    this.StartingBasePos = StartingBasePos;
    this.BasePosMultiplier = BasePosMultiplier;
    this.MiddleStarPos = MiddleStarPos;

    this.StartingStarPos = StartingStarPos;
    this.StarPosMultiplier = StarPosMultiplier;

    this.MiddleOutpostPos = MiddleOutpostPos;
  }

  public static getBasicMapData() {
    return new MapData({
      GridSize: [3000, 2000],
      StartingBasePos: [1600, 700], BasePosMultiplier: [1000, 1000],
      StartingStarPos: [1000, 1000], StarPosMultiplier: [2200, 400], MiddleStarPos: [2000, 1300],
      MiddleOutpostPos: [2200, 1100],
    });
  }
}
