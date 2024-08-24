export class Logger {
  private static green = (message: any) => message;
  private static yellow = (message: any) => message;
  private static blue = (message: any) => message;
  private static red = (message: any) => message;

  static overrideLoggerSeverity: ({
    green,
    yellow,
    blue,
    red,
  }: {
    green: (message: any) => any;
    yellow: (message: any) => any;
    blue: (message: any) => any;
    red: (message: any) => any;
  }) => void = ({ green, yellow, blue, red }) => {
    Logger.green = green;
    Logger.yellow = yellow;
    Logger.blue = blue;
    Logger.red = red;
  };

  static log = (message: any) => Logger.write(message);

  static success = (message: any) => Logger.write(Logger.green(message));

  static warning = (message: any) => Logger.write(Logger.yellow(message));

  static info = (message: any) => Logger.write(Logger.blue(message));

  static error = (message: any) => Logger.write(Logger.red(message));

  static write = (message: any): void => {
    const shouldWrite = process.env.APP_ENV !== "test";

    if (shouldWrite) {
      console.log(message);
    }
  };
}

export default Logger;
