export abstract class AIRunner {
  protected readonly scriptPath: string;

  constructor(scriptPath: string) {
    this.scriptPath = scriptPath;
  }

  public abstract init(): Promise<void>;
  public abstract run(playerGlobal: Record<string, any>): Promise<void>;
}
