import {Game} from "../Game";
import {GameEvent} from "./GameEvent";

export class GameEventLoop {
  public readonly game: Game;

  public gameEvents = new Array<GameEvent>();

  constructor(game: Game) {
    this.game = game;
  }

  public addEvent(gameEvent: GameEvent) {
    this.gameEvents.push(gameEvent);
  }

  public tick() {
    this.gameEvents.forEach(gameEvent => gameEvent.run());
  }

  public postTick() {
    this.gameEvents = [];
  }
}
