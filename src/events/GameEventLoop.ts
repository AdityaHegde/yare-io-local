import {Game} from "../Game";
import {GameEvent, GameEventType} from "./GameEvent";

const GameEventOrder: {
  [eventType in GameEventType]: number
} = {
  [GameEventType.SPIRIT_ENERGIZE]: 0,
  [GameEventType.SPIRIT_MOVE]: 1,
  [GameEventType.SPIRIT_MERGE]: 2,
  [GameEventType.SPIRIT_DIVIDE]: 3,
  [GameEventType.SPIRIT_JUMP]: 4,
}

export class GameEventLoop {
  public readonly game: Game;

  public gameEvents = new Array<Array<GameEvent>>(...Object.keys(GameEventOrder).map(() => []));
  public gameEventIds = new Set<string>();

  constructor(game: Game) {
    this.game = game;
  }

  public addEvent(gameEvent: GameEvent) {
    const gameEventsIdx = GameEventOrder[gameEvent.type];
    if (this.gameEventIds.has(gameEvent.id)) {
      this.gameEvents[gameEventsIdx].splice(
        this.gameEvents[gameEventsIdx].findIndex(existingGameEvent => existingGameEvent.id === gameEvent.id),
        1, gameEvent,
      );
    } else {
      this.gameEvents[gameEventsIdx].push(gameEvent);
      this.gameEventIds.add(gameEvent.id);
    }
  }

  public tick() {
    this.gameEvents.forEach(gameEventsByType => gameEventsByType.forEach(gameEvent => gameEvent.run()));
  }

  public postTick() {
    this.gameEvents = new Array<Array<GameEvent>>(...Object.keys(GameEventOrder).map(() => []));
    this.gameEventIds = new Set();
  }
}
