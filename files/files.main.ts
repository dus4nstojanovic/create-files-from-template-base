import { isDirectory } from "./files.utils";
import { Options } from "../options";
import {
  createDirectory,
  createFileOrDirectoryFromTemplate,
  createPath,
  getInnerDirectoriesAndFilesPaths,
} from ".";
import { normalizeOptions } from "../options/options.utils";

/**
 * Creates all directories and files using the provided options
 * @param currentFolderPath The current context path to the folder
 * @param options The options for the files and folders creation
 * @param {string} cfftFolderPath The current path to the folder where the cfft.config.json resides
 */
export const createAllDirectoriesAndFilesFromTemplate = async (
  currentFolderPath: string,
  options: Options,
  cfftFolderPath: string
): Promise<void> => {
  options = normalizeOptions(options, cfftFolderPath) as Options;

  const templatePath = createPath(options.templatePath, currentFolderPath);

  const dirPath = createPath(options.dirPath, currentFolderPath);
  const fileName = options.fileName;

  await createDirectory(dirPath);

  let templateFilesPaths: string[];

  if (isDirectory(templatePath)) {
    templateFilesPaths = await getInnerDirectoriesAndFilesPaths(templatePath);
  } else {
    templateFilesPaths = [templatePath];
  }

  await Promise.all(
    templateFilesPaths.map((templateFilePath) =>
      createFileOrDirectoryFromTemplate({
        ...options,
        templatePath: templateFilePath,
        dirPath,
        fileName,
      })
    )
  );
};
