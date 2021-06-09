import {AIRunner} from "./AIRunner";

export class LocalAIRunner extends AIRunner {
  private readonly runner: () => void;

  constructor(runner: () => void) {
    super("");
    this.runner = runner;
  }

  public async init(): Promise<void> {}

  public async run(playerGlobal: Record<string, any>): Promise<void> {
    Object.keys(playerGlobal).forEach((playerGlobalKey) => {
      global[playerGlobalKey] = playerGlobal[playerGlobalKey];
    });
    this.runner();
  }
}
