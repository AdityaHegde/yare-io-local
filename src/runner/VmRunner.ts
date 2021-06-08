import {AIRunner} from "./AIRunner";
import {readFile} from "fs/promises";
import {createContext, runInContext} from "vm";

export class VmRunner extends AIRunner {
  public async init(): Promise<void> {
    this.scriptContent = (await readFile(this.scriptPath)).toString();
  }

  public async run(playerGlobal: Record<string, any>): Promise<void> {
    const context = {...playerGlobal};
    createContext(context);
    runInContext(this.scriptContent, context, {
      displayErrors: true,
    });
  }
}
