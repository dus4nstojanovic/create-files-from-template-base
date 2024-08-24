import { SearchAndReplaceItem } from "../../config";
import { Options } from "../../options";
import { createAllDirectoriesAndFilesFromTemplate } from "../files.main";
import * as FilesUtils from "../files.utils";

describe("createAllDirectoriesAndFilesFromTemplate", () => {
  const SEARCH_AND_REPLACE: SearchAndReplaceItem[] = [
    { search: "FileName", replace: "{fileName}", ignoreCase: true },
    { search: "FunctionComponent", replace: "FC" },
    {
      search: "dusan.*outlook\\.com",
      replace: "dus4nstojanovic@gmail.com",
    },
  ];

  const args: Options = {
    template: "component",
    fileName: "test-file",
    dirPath: "./test-dir",
    templatePath: "./template-dir",
    shouldReplaceFileContent: false,
    shouldReplaceFileName: false,
    fileNameTextToBeReplaced: "",
    textToBeReplaced: "",
    replaceTextWith: "",
    searchAndReplaceSeparator: ",",
    searchAndReplace: SEARCH_AND_REPLACE,
    configDir: "path",
    hooksPath: "",
  };
  beforeAll(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();

    jest
      .spyOn(FilesUtils, "createPath")
      .mockImplementation(jest.fn((path) => path));
    jest
      .spyOn(FilesUtils, "isDirectory")
      .mockImplementation(jest.fn((path) => !path.includes(".js")));
    jest.spyOn(FilesUtils, "createDirectory").mockImplementation(jest.fn());
    jest
      .spyOn(FilesUtils, "getInnerDirectoriesAndFilesPaths")
      .mockImplementation(
        jest.fn((templatePath) => Promise.resolve(["file1.js", "file2.js"]))
      );
    jest
      .spyOn(FilesUtils, "createFileOrDirectoryFromTemplate")
      .mockImplementation(jest.fn());
  });

  it("should createAllDirectoriesAndFilesFromTemplate execute without errors", async () => {
    await createAllDirectoriesAndFilesFromTemplate({ ...args });

    expect(FilesUtils.createPath).toHaveBeenNthCalledWith(1, args.templatePath);
    expect(FilesUtils.isDirectory).toHaveBeenCalledWith(args.templatePath);
    expect(FilesUtils.createPath).toHaveBeenNthCalledWith(2, args.dirPath);
    expect(FilesUtils.createDirectory).toHaveBeenCalledWith(args.dirPath);
    expect(
      FilesUtils.createFileOrDirectoryFromTemplate
    ).toHaveBeenNthCalledWith(1, {
      configDir: "path",
      dirPath: "./test-dir",
      fileName: "test-file",
      fileNameTextToBeReplaced: "",
      hooksPath: "",
      replaceTextWith: "",
      searchAndReplace: SEARCH_AND_REPLACE,
      searchAndReplaceSeparator: ",",
      shouldReplaceFileContent: false,
      shouldReplaceFileName: false,
      template: "component",
      templatePath: "file1.js",
      textToBeReplaced: "",
    });
    expect(
      FilesUtils.createFileOrDirectoryFromTemplate
    ).toHaveBeenNthCalledWith(2, {
      configDir: "path",
      dirPath: "./test-dir",
      fileName: "test-file",
      fileNameTextToBeReplaced: "",
      hooksPath: "",
      replaceTextWith: "",
      searchAndReplace: SEARCH_AND_REPLACE,
      searchAndReplaceSeparator: ",",
      shouldReplaceFileContent: false,
      shouldReplaceFileName: false,
      template: "component",
      templatePath: "file2.js",
      textToBeReplaced: "",
    });
  });
});
