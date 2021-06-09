export enum GameEventType {
  SPIRIT_MOVE,
  SPIRIT_JUMP,
  SPIRIT_ENERGIZE,
  SPIRIT_MERGE,
  SPIRIT_DIVIDE,
}

export class GameEvent {
  public id: string;

  constructor(id: string) {
    this.id = id;
  }

  public run() {}
}
