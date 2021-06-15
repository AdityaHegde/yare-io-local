import {SpiritType} from "../game/SpiritType";

const MAX_COUNT = 999999;

export const SpiritData = {
  [SpiritType.Circle]: {
    size: 1,
    energyCapacity: 10,
  },
  [SpiritType.Square]: {
    size: 10,
    energyCapacity: 100,
  },
  [SpiritType.Triangle]: {
    size: 10,
    energyCapacity: 100,
  },
};

export const BaseData = {
  [SpiritType.Circle]: {
    energyCapacity: 400,
    startingSpiritCount: 11,
    maxSpirits: 500,
    cost: [
      [0, 100, 50],
      [101, 200, 100],
      [201, 300, 200],
      [301, MAX_COUNT, 400],
    ],
  },
  [SpiritType.Square]: {
    energyCapacity: 800,
    startingSpiritCount: 2,
    maxSpirits: 500,
    cost: [
      [0, 10, 400],
      [11, MAX_COUNT, 800],
    ],
  },
  [SpiritType.Triangle]: {
    energyCapacity: 500,
    startingSpiritCount: 1,
    maxSpirits: 500,
    cost: [
      [0, MAX_COUNT, 200],
    ],
  },
};
