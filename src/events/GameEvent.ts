export enum GameEventType {
  SPIRIT_ENERGIZE,
  SPIRIT_MOVE,
  SPIRIT_MERGE,
  SPIRIT_DIVIDE,
  SPIRIT_JUMP,
}

export class GameEvent {
  public id: string;
  public type: GameEventType;

  constructor(type: GameEventType, idSuffix: string) {
    this.type = type;
    this.id = `${type}-${idSuffix}`;
  }

  public run() {}
}
