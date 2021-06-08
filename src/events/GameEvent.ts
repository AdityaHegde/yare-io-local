export enum GameEventType {
  SPIRIT_MOVE,
  SPIRIT_ENERGIZE,
}

export class GameEvent {
  public id: string;

  constructor(id: string) {
    this.id = id;
  }

  public run() {}
}
