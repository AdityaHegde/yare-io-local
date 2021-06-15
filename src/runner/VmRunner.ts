import {AIRunner} from "./AIRunner";
import {readFile} from "fs/promises";
import {Script} from "vm";

export class VmRunner extends AIRunner {
  protected script: Script;

  public async init(): Promise<void> {
    this.script = new Script((await readFile(this.scriptPath)).toString());
  }

  public async run(playerGlobal: Record<string, any>): Promise<void> {
    this.script.runInNewContext({...playerGlobal}, {
      displayErrors: true,
    });
  }
}
