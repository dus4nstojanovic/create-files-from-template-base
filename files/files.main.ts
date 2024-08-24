import { isDirectory } from "./files.utils";
import { Options } from "../options";
import {
  createDirectory,
  createFileOrDirectoryFromTemplate,
  createPath,
  getInnerDirectoriesAndFilesPaths,
} from ".";

/**
 * Creates all directories and files using the provided options
 * @param options The options for the files and folders creation
 */
export const createAllDirectoriesAndFilesFromTemplate = async (
  options: Options
): Promise<void> => {
  const templatePath = createPath(options.templatePath);

  const dirPath = createPath(options.dirPath);
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
