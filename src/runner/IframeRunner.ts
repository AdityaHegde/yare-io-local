import {AIRunner} from "./AIRunner";

export class IframeRunner extends AIRunner {
  public iframe: HTMLIFrameElement;

  public async init(): Promise<void> {
    this.iframe = document.createElement("iframe");
    this.iframe.src = "about:blank";
    this.iframe.style.display = "none";
    document.body.appendChild(this.iframe);

    // this.scriptContent = await (await fetch(this.scriptPath)).text() + "\nwindow.done();";
  }

  public async run(playerGlobal: Record<string, any>): Promise<void> {
    Object.keys(playerGlobal).forEach((globalKey) => {
      this.iframe.contentWindow[globalKey] = playerGlobal[globalKey];
    });

    return new Promise((resolve, reject) => {
      const script = this.iframe.contentDocument.createElement("script");
      script.type = "application/javascript";
      script.src = this.scriptPath;
      script.onload = () => {
        setTimeout(() => {
          this.iframe.contentDocument.body.removeChild(script);
          resolve();
        });
      };
      script.onerror = reject;
      this.iframe.contentDocument.body.appendChild(script);
    });
  }
}
