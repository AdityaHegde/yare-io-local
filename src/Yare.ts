import {GameRunner} from "./runner/GameRunner";
import {Game} from "./Game";
import {Renderer} from "./renderer/Renderer";

export class Yare {
  private readonly gameRunner: GameRunner;
  private readonly renderer: Renderer;

  private runIntervalInMs: number;

  private runIntervalId: any;
  private ended = false;

  constructor(
    game: Game, gameRunner: GameRunner, renderer: Renderer,
    {
      runIntervalInMs,
    }: {
      runIntervalInMs: number;
    },
  ) {
    this.gameRunner = gameRunner;
    this.renderer = renderer;

    this.runIntervalInMs = runIntervalInMs;
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
