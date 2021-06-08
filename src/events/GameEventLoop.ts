import {Game} from "../Game";
import {GameEvent} from "./GameEvent";

export class GameEventLoop {
  public readonly game: Game;

  public gameEvents = new Array<GameEvent>();
  public gameEventIds = new Set<string>();

  constructor(game: Game) {
    this.game = game;
  }

  public addEvent(gameEvent: GameEvent) {
    if (this.gameEventIds.has(gameEvent.id)) {
      this.gameEvents.splice(
        this.gameEvents.findIndex(existingGameEvent => existingGameEvent.id === gameEvent.id),
        1, gameEvent,
      );
    } else {
      this.gameEvents.push(gameEvent);
      this.gameEventIds.add(gameEvent.id);
    }
  }

  public tick() {
    this.gameEvents.forEach(gameEvent => gameEvent.run());
  }

  public postTick() {
    this.gameEvents = [];
    this.gameEventIds = new Set();
  }
}
