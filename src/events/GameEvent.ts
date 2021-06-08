export enum GameEventType {
  SPIRIT_MOVE,
  SPIRIT_ENERGIZE,
}

export class GameEvent {
  public type: GameEventType;

  public run() {}
}
