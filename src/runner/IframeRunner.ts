import {AIRunner} from "./AIRunner";

export class IframeRunner extends AIRunner {
  public iframe: HTMLIFrameElement;
  // protected scriptContent: string;

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

    // return new Promise((resolve, reject) => {
    //   (this.iframe.contentWindow as any).done = resolve;
    //   this.iframe.contentWindow.onerror = reject;
    //   new (this.iframe.contentWindow as any).Function(this.scriptContent)();
    // });

    return new Promise((resolve, reject) => {
      const script = this.iframe.contentDocument.createElement("script");
      script.src = this.scriptPath;
      script.onerror = reject;
      script.onload = () => {
        setTimeout(() => {
          this.iframe.contentDocument.body.removeChild(script);
          resolve();
        }, 10);
      };
      this.iframe.contentDocument.body.appendChild(script);
    });
  }
}
