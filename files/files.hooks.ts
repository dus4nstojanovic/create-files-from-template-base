import Logger from "../logger";
import path from "path";
import { Options } from "../options";

/**
Executes the onFileCreated hook if available from the specified hooks file
@param {object} options - Options object containing configDir, hooksPath, filePath and templatePath
@param {string} options.hooksPath - The path to the hooks file
@param {string} options.filePath - The path to the created file
@param {string} options.templatePath - The path to the template file used to create the file
@throws {Error} If the hooks file is not found
*/
export const onFileCreatedHook = ({
  hooksPath,
  filePath,
  templatePath,
}: Pick<Options, "hooksPath" | "templatePath"> & {
  filePath: string;
}) => {
  if (!hooksPath) return;

  const relativeHooksPath = path.relative(__dirname, hooksPath);

  let hooks;
  try {
    hooks = require(relativeHooksPath);
  } catch (e) {
    throw new Error(`Hooks file not found. Path: ${hooksPath}`);
  }

  try {
    if (hooks.onFileCreated) {
      hooks.onFileCreated({ filePath, templatePath });
    } else {
    }
  } catch (e) {
    Logger.error("Error executing onFileCreated hook");
    Logger.error(e);
  }
};
