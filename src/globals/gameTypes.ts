export interface Sight {
  friends: Array<string>;
  friends_beamable: Array<string>;
  enemies: Array<string>;
  enemies_beamable: Array<string>;
  structures: Array<string>;
}

export type Position = [number, number];

export interface Entity {
  id: string;
  position: Position;
  size: number;
  energy_capacity: number;
  energy: number;
  hp: number;
  sight: Sight;
}

export interface Structure {
  id: string;
  position: Position;
  structure_type: string;
}

export interface Base extends Entity, Structure {}

export interface Outpost extends Entity, Structure {
  range: number;
  control: string;
}

export interface Energy extends Structure {
  energy: number;
}

export type EnergyEntity = Spirit | Base | Outpost;
export type Intractable = EnergyEntity | Energy;

export interface Spirit extends Entity {
  mark: string;
  last_energized: string;
  move: (position: Position) => void;
  energize: (target: Intractable) => void;
  merge: (target: Spirit) => void;
  divide: () => void;
  jump: (position: Position) => void;
  shout: (message: string) => void;
  set_mark: (label: string) => void;
}
