const chalk = require("chalk");

const log = (...message: any[]) => write(...message);

const success = (...message: any[]) => write(chalk.green(...message));

const warning = (...message: any[]) => write(chalk.yellow(...message));

const info = (...message: any[]) => write(chalk.blue(...message));

const error = (...message: any[]) => write(chalk.red(...message));

const write = (...message: any[]): void => {
  const shouldWrite = process.env.APP_ENV !== "test";

  if (shouldWrite) {
    console.log(...message);
  }
};

export default { success, warning, info, error, log };
