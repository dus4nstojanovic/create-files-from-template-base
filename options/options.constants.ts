import { SearchAndReplaceItem, IfStatementItem } from "../config";

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
  ifStatements?: IfStatementItem[];
  hooksPath: string;
  configDir: string;
}
