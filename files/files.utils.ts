import fs from "fs";
import path from "path";
import { promisify } from "util";
import Logger from "../logger";
import { Options } from "../options";
import {
  replaceSearchItems,
  replaceEnvVariables,
  replaceDateTime,
  createSearchAndReplaceItemsFromArgs,
  convertCases,
} from "./files.search-and-replace";
import { onFileCreatedHook } from "./files.hooks";
import { replaceIfStatements } from "./files.conditions";

/**
 * Gets paths of directory's items
 * @param dirPath The directory path (parent)
 * @returns Paths of directories and files
 */
export const getInnerDirectoriesAndFilesPaths = async (dirPath: string) => {
  try {
    const files = await promisify(fs.readdir)(dirPath);
    return files.map((file) => `${dirPath}${path.sep}${file}`);
  } catch (e) {
    throw new Error(`Couldn't get files paths from folder: '${dirPath}'`);
  }
};

/**
 * Creates a file and writes its content
 * @param pathArg The path of the file
 * @param content The content to write
 */
export const createFileAndWriteContent = async (
  pathArg: string,
  content: string
) => {
  try {
    await promisify(fs.writeFile)(pathArg, content);
  } catch (e) {
    throw new Error(`Couldn't create file: '${pathArg}'`);
  }
};

/**
 * Reads the file content
 * @param pathArg The path of the file
 * @returns The file content
 */
export const readFileContent = async (pathArg: string): Promise<string> => {
  try {
    return (await promisify(fs.readFile)(pathArg)).toString();
  } catch (e) {
    throw new Error(`Couldn't read file content from path: '${pathArg}'`);
  }
};

/**
 * Creates a directory on the specified path
 * @param path The path to the directory
 */
export const createDirectory = async (
  path: string
): Promise<string | undefined> => {
  try {
    return await promisify(fs.mkdir)(path, { recursive: true });
  } catch (e) {
    throw new Error(`Couldn't create directory for path: '${path}'`);
  }
};

/**
 * Checks the item to determine if is it a directory or not
 * @param path The path to the item
 * @returns Is it a directory or not
 */
export const isDirectory = (path: string): boolean => {
  try {
    return fs.lstatSync(path).isDirectory();
  } catch (e) {
    throw new Error(
      `Couldn't determine if the provided path is a directory: '${path}'`
    );
  }
};

/**
 * Creates a file, or directory with children using the provided options
 * @param args Options for the file/directory creation
 * @returns
 */
export const createFileOrDirectoryFromTemplate = async (
  args: Options
): Promise<void> => {
  if (isDirectory(args.templatePath)) {
    await createDirectoryFromTemplate(args);
    return;
  }

  await createFileFromTemplate(args);
};

const createDirectoryFromTemplate = async (args: Options): Promise<void> => {
  const { filePath } = createFilePathAndNameFromTemplate({
    templatePath: args.templatePath,
    shouldReplaceFileName: args.shouldReplaceFileName,
    fileNameTextToBeReplaced: args.fileNameTextToBeReplaced,
    dirPath: args.dirPath,
    fileName: args.fileName,
  });

  const { templatePath, fileName } = args;

  await createDirectory(filePath);

  Logger.info(`Inner directory created: ${filePath}`);

  const templateFilesPaths = await getInnerDirectoriesAndFilesPaths(
    templatePath
  );

  await Promise.all(
    templateFilesPaths.map((templateFilePath) =>
      createFileOrDirectoryFromTemplate({
        ...args,
        templatePath: templateFilePath,
        dirPath: filePath,
        fileName,
      })
    )
  );
};

const createFileFromTemplate = async (options: Options): Promise<void> => {
  const { filePath } = createFilePathAndNameFromTemplate(options);

  const fileContent = await getFileContentAndSearchAndReplace(options);

  await createFileAndWriteContent(filePath, fileContent);

  onFileCreatedHook({ ...options, filePath });

  Logger.info(`${filePath} created!`);
};

const getFileContentAndSearchAndReplace = async ({
  templatePath,
  textToBeReplaced,
  replaceTextWith,
  searchAndReplaceSeparator,
  shouldReplaceFileContent,
  searchAndReplace,
  ifStatements,
}: Pick<
  Options,
  | "templatePath"
  | "textToBeReplaced"
  | "replaceTextWith"
  | "searchAndReplaceSeparator"
  | "shouldReplaceFileContent"
  | "searchAndReplace"
  | "ifStatements"
>): Promise<string> => {
  let fileContent = await readFileContent(templatePath);

  if (!shouldReplaceFileContent) return fileContent;

  const searchAndReplaceItems = createSearchAndReplaceItemsFromArgs({
    textToBeReplaced,
    replaceTextWith,
    searchAndReplaceSeparator,
    searchAndReplace,
  });

  fileContent = replaceIfStatements(ifStatements, fileContent);

  fileContent = await replaceSearchItems({
    searchAndReplaceItems,
    fileContent,
  });

  fileContent = replaceEnvVariables(fileContent);

  fileContent = replaceDateTime(fileContent);

  fileContent = convertCases(fileContent);

  return fileContent;
};

const createFilePathAndNameFromTemplate = ({
  templatePath,
  shouldReplaceFileName,
  fileNameTextToBeReplaced,
  fileName,
  dirPath,
}: Pick<
  Options,
  | "templatePath"
  | "shouldReplaceFileName"
  | "fileNameTextToBeReplaced"
  | "dirPath"
  | "fileName"
>): { filePath: string; fileNameUpdated: string } => {
  const templateFileName = path.basename(templatePath);

  const fileNameUpdated = shouldReplaceFileName
    ? templateFileName.replace(
        new RegExp(fileNameTextToBeReplaced, "g"),
        fileName
      )
    : templateFileName;

  return { filePath: path.join(dirPath, fileNameUpdated), fileNameUpdated };
};
