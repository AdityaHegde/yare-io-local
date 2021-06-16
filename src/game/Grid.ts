import {Game} from "./Game";
import {getDistance, isWithinRange} from "../utils/GridUtils";
import {ACTION_DISTANCE, ORIGINAL_ACTION_DISTANCE_SQUARED, ORIGINAL_SIGHT_DISTANCE_SQUARED} from "../constants";
import {EnergyEntity, Entity, Intractable} from "../globals/gameTypes";
import {SpiritImpl} from "../impl/SpiritImpl";
import {Player} from "./Player";

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
        this.updateSpiritSight(spiritImpl, spiritCheckImpl);
      }

      this.game.players.forEach(player => this.updateSpiritSight(player.base, spiritImpl));

      this.game.outposts.forEach(outpost => this.updateSpiritSight(outpost, spiritImpl));
    });
  }

  private updateSpiritSight(sourceEntity: EnergyEntity, spirit: SpiritImpl) {
    const distance = getDistance(sourceEntity, spirit);
    const sourceRange = (sourceEntity as any).range;

    if (distance <= sourceRange * sourceRange) {
      this.addToSight(sourceEntity, spirit, true);
      if (sourceEntity instanceof SpiritImpl) {
        this.addToSight(spirit, sourceEntity, true);
      }
    }
    if (distance <= (sourceRange + ACTION_DISTANCE) * (sourceRange + ACTION_DISTANCE)) {
      this.addToSight(sourceEntity, spirit);
      if (sourceEntity instanceof SpiritImpl) {
        this.addToSight(spirit, sourceEntity);
      }
    }
  }

  private addToSight(sourceEntity: EnergyEntity, spirit: SpiritImpl, inRange = false) {
    const suffix = inRange ? "_beamable" : "";
    const sourceOwner: Player = (sourceEntity as any).owner;

    if (sourceOwner === spirit.owner) {
      sourceEntity.sight["friends" + suffix].push(spirit.id);
    } else {
      sourceEntity.sight["enemies" + suffix].push(spirit.id);
    }
  }
}
