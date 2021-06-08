export class Logger {
  private readonly label: string;

  constructor(label: string) {
    this.label = label;
  }

  log(...messages: Array<any>) {
    console.log(`[${this.label}] ${messages.join(" ")}`);
  }

  error(error: Error) {
    console.log(error);
  }

  logJSON(json: any) {
    console.log(JSON.stringify(json));
  }
}

export function Log<T extends { new(...args: Array<any>): {} }>(constructor: T) {
  const classMatch = constructor.toString().match(/class (\w*)/);
  const functionMatch = constructor.toString().match(/\[Function: (.*)]/);
  const label: string = (classMatch && classMatch[1]) || (functionMatch && functionMatch[1]);
  return class extends constructor {
    public logger: Logger = new Logger(label);
  };
}
