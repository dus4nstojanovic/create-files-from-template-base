import fs from "fs";
import path, { resolve } from "path";
import { promisify } from "util";
import { Config, CONFIG_FILE_NAME } from ".";

/**
 * Searches for the configuration file. If the file isn't found, searches in the parent directory
 * @param currentFolderPath The current context path to the folder
 * @param pathArg The path of the configuration file
 * @param previousPath The previous (parent) path
 * @returns The parsed configuration file (used in the recursion)
 */
export const findConfig = async (
  currentFolderPath: string,
  pathArg = ".",
  previousPath?: string
): Promise<Config> => {
  const searchPath = path.join(currentFolderPath, pathArg, CONFIG_FILE_NAME);
  const folderPath = resolve(path.join(currentFolderPath, pathArg));
  const currentPath = resolve(searchPath);

  if (currentPath === previousPath) return null as any;

  try {
    const file = await promisify(fs.readFile)(searchPath);

    const config = JSON.parse(file.toString()) as Config;
    config.folder = folderPath;
    config.path = currentPath;

    validateConfig(config);

    return config;
  } catch (error) {
    return await findConfig(
      currentFolderPath,
      path.join(pathArg, ".."),
      currentPath
    );
  }
};

export const validateConfig = (config: Config) => {
  let errorMessage = `Invalid ${CONFIG_FILE_NAME}: `;

  for (const template of config.templates) {
    if (!template.name) {
      throw new Error(`${errorMessage} Template name is required`);
    }

    template?.options?.searchAndReplace?.forEach((searchAndReplace) => {
      if (!searchAndReplace.search) {
        throw new Error(
          `${errorMessage} searchAndReplace 'search' is required`
        );
      }

      if (!searchAndReplace.replace) {
        throw new Error(
          `${errorMessage} searchAndReplace 'replace' is required`
        );
      }
    });
  }
};
