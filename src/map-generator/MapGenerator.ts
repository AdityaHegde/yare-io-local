import {Game} from "../game/Game";
import {Player} from "../game/Player";
import {BaseImpl} from "../impl/BaseImpl";
import {BaseData} from "../impl/Data";
import {EnergyImpl} from "../impl/EnergyImpl";
import {Position} from "../globals/gameTypes";
import {MapData} from "./MapData";
import {BASE_STAR_INIT_ENERGY, MIDDLE_STAR_START_TICK} from "../constants";
import {OutpostImpl} from "../impl/OutpostImpl";

export class MapGenerator {
  protected readonly mapData: MapData;

  constructor(mapData: MapData) {
    this.mapData = mapData;
  }

  public generate(game: Game) {
    game.players.forEach((player, playerIdx) =>
      this.generatePlayer(game, player, playerIdx));
  }

  protected generatePlayer(game: Game, player: Player, playerIdx: number) {
    const gridSize = Math.ceil(Math.sqrt(game.players.length / 2));
    const gridX = this.mapData.GridSize[0] * (Math.floor(playerIdx / 2) % gridSize);
    const gridY = this.mapData.GridSize[1] * Math.floor(playerIdx / gridSize / 2);
    const playerIdxNormalized = playerIdx % 2;

    const getPosition = (startingPos: Position, posMultiplier: Position): Position =>
      [
        startingPos[0] + posMultiplier[0] * playerIdxNormalized + gridX,
        startingPos[1] + posMultiplier[1] * playerIdxNormalized + gridY,
      ];

    player.base = new BaseImpl(
      `base_${player.name}`,
      getPosition(this.mapData.StartingBasePos, this.mapData.BasePosMultiplier),
      player,
    );

    const half = Math.floor(BaseData[player.spiritType].startingSpiritCount / 2);
    for (let i = 0; i < BaseData[player.spiritType].startingSpiritCount; i++) {
      player.base.createSpirit(
        [
          player.base.position[0] + (i - half) * 50,
          player.base.position[1] + (playerIdxNormalized === 0 ? -100 : 100),
        ],
      );
    }

    game.stars.push(new EnergyImpl(
      playerIdxNormalized === 0 ? "star_zxq": "star_a1c",
      getPosition(this.mapData.StartingStarPos, this.mapData.StarPosMultiplier),
      BASE_STAR_INIT_ENERGY, 0,
    ));

    if (playerIdxNormalized === 1) {
      this.generatePlayerPair(game, gridX, gridY);
    }
  }

  protected generatePlayerPair(game: Game, gridX: number, gridY: number) {
    game.stars.push(new EnergyImpl(
      "star_p89", [this.mapData.MiddleStarPos[0] + gridX, this.mapData.MiddleStarPos[1] + gridY],
      0, MIDDLE_STAR_START_TICK,
    ));

    game.outposts.push(new OutpostImpl(
      "outpost_mdo", [this.mapData.MiddleOutpostPos[0] + gridX, this.mapData.MiddleOutpostPos[1] + gridY],
    ));
  }
}
