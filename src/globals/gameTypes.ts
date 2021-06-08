export interface Sight {
  friends: string[];
  enemies: string[];
  structures: string[];
}

export type Position = [number, number];

export interface Common {
  id: string;
  position: Position;
  size: number;
  energy_capacity: number;
  energy: number;
  hp: number;
  sight: Sight;
}

export interface Structure extends Pick<Common, "id" | "position"> {
  structure_type: string;
}

export interface Base extends Common, Structure {}

export interface Energy extends Structure {}

export type EnergyEntity = Spirit | Base;
export type Intractable = EnergyEntity | Energy;

export interface Spirit extends Common {
  mark: string;
  move: (position: Position) => void;
  energize: (target: Intractable) => void;
  merge: (target: Spirit) => void;
  divide: () => void;
  shout: (message: string) => void;
  set_mark: (label: string) => void;
}
