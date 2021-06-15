import {Game} from "../game/Game";
import {Logger} from "../utils/Logger";
import {SpiritImpl} from "../impl/SpiritImpl";

export abstract class Renderer {
  protected logger: Logger
  protected game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  public abstract init(): Promise<void>;

  public abstract render(): Promise<void>;

  public abstract spiritCreated(spirit: SpiritImpl);

  public abstract spiritDestroyed(spirit: SpiritImpl);
}
