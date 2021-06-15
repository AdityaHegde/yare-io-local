import {Game} from "./Game";
import {isWithinRange} from "../utils/GridUtils";
import {ORIGINAL_SIGHT_DISTANCE_SQUARED} from "../constants";

export class Grid {
  public readonly game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  public tick() {}

  public postTick() {
    this.game.players.forEach(player => player.base.resetSight());

    const spiritImpls = Object.values(this.game.spirits);

    spiritImpls.forEach(spiritImpl => spiritImpl.resetSight());
    spiritImpls.forEach((spiritImpl, i) => {
      for (let j = i + 1; j < spiritImpls.length; j++) {
        const spiritCheckImpl = spiritImpls[j];
        if (isWithinRange(spiritImpl, spiritCheckImpl, ORIGINAL_SIGHT_DISTANCE_SQUARED)) {
          spiritImpl.addSpiritToSight(spiritCheckImpl);
        }
      }

      this.game.players.forEach((player) => {
        if (isWithinRange(spiritImpl, player.base, ORIGINAL_SIGHT_DISTANCE_SQUARED)) {
          player.base.addSpiritToSight(spiritImpl);
        }
      });
    });

    // spiritImpls.filter(spiritImpl => spiritImpl.sight.enemies.length > 0)
    //   .forEach(spiritImpl => console.log(spiritImpl.id, JSON.stringify(spiritImpl.sight)));
  }
}
