import {AIRunner} from "./AIRunner";

export class IframeRunner extends AIRunner {
  public iframe: HTMLIFrameElement;

  public async init(): Promise<void> {
    this.iframe = document.createElement("iframe");
    this.iframe.src = "about:blank";
  }

  public async run(playerGlobal: Record<string, any>): Promise<void> {
    Object.keys(playerGlobal).forEach((globalKey) => {
      this.iframe.contentWindow[globalKey] = playerGlobal[globalKey];
    });

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = this.scriptPath;
      script.onload = () => {
        setTimeout(resolve, 100);
      };
      script.onerror = reject;
    });
  }
}
