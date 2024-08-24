import { SearchAndReplaceItem } from "../config";

export interface Options {
  template: string;
  fileName: string;
  dirPath: string;
  templatePath: string;
  shouldReplaceFileContent: boolean;
  shouldReplaceFileName: boolean;
  fileNameTextToBeReplaced: string;
  textToBeReplaced: string;
  replaceTextWith: string;
  searchAndReplaceSeparator: string;
  searchAndReplace: SearchAndReplaceItem[];
  hooksPath: string;
  configDir: string;
}
