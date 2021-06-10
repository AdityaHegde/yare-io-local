import {GameRunner} from "./runner/GameRunner";
import {Game} from "./Game";
import {Renderer} from "./renderer/Renderer";

export type YareConfig = {
  runIntervalInMs: number;
  pauseOnError?: boolean;
}

export class Yare {
  private readonly gameRunner: GameRunner;
  private readonly renderer: Renderer;

  private readonly runIntervalInMs: number;
  private readonly pauseOnError: boolean;

  private runIntervalId: any;
  private ended = false;

  public errorFrom = -1;
  public errorStack: string;

  constructor(
    game: Game, gameRunner: GameRunner, renderer: Renderer,
    {runIntervalInMs, pauseOnError}: YareConfig,
  ) {
    this.gameRunner = gameRunner;
    this.renderer = renderer;

    this.runIntervalInMs = runIntervalInMs;
    this.pauseOnError = pauseOnError || false;
  }

  public async init() {
    await this.gameRunner.init();
    await this.renderer.init();

    this.gameRunner.on(GameRunner.SPIRIT_CREATED, spirit => this.renderer.spiritCreated(spirit));
    this.gameRunner.on(GameRunner.SPIRIT_DESTROYED, spirit => this.renderer.spiritDestroyed(spirit));
    this.gameRunner.on(GameRunner.BASE_DESTROYED, () => {
      this.ended = true;
      this.pause();
    });
    if (this.pauseOnError) {
      this.gameRunner.on(GameRunner.ERROR_THROWN, (errorFrom, errorStack) => {
        this.errorFrom = errorFrom;
        this.errorStack = errorStack;
        this.pause();
      });
    }
  }

  public resume() {
    if (this.runIntervalId || this.ended) {
      return;
    }
    this.runIntervalId = setInterval(async () => {
      await this.tick();
    }, this.runIntervalInMs);
  }

  public async tick() {
    try {
      await this.gameRunner.run();
      await this.renderer.render();
    } catch (err) {
      console.log(err);
    }
  }

  public pause() {
    if (!this.runIntervalId) {
      return
    }
    clearInterval(this.runIntervalId);
    this.runIntervalId = 0;
  }
}
