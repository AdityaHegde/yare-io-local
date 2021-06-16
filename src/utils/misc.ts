import {Sight} from "../globals/gameTypes";

export function getBlankSight(): Sight {
  return {
    enemies: [],
    enemies_beamable: [],
    friends: [],
    friends_beamable: [],
    structures: [],
  };
}
