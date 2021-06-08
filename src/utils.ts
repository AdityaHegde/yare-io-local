import {Sight} from "./globals/gameTypes";

export function getBlankSight(): Sight {
  return {
    enemies: [],
    friends: [],
    structures: [],
  };
}
