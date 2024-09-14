import path from "path";
import { ConfigTemplateOptions } from "../../config";
import { Options } from "../options.constants";
import { normalizeOptions } from "../options.utils";

// Mock data for testing
const mockOptions: Partial<Options | ConfigTemplateOptions> = {
  dirPath: "/some/path/to/dir",
  templatePath: "/another/path/to/template",
  hooksPath: "/yet/another/path/to/hooks",
  configDir: "/config/dir",
  shouldReplaceFileContent: true,
  shouldReplaceFileName: false,
  fileNameTextToBeReplaced: "oldName",
  textToBeReplaced: "oldText",
  replaceTextWith: "newText",
  searchAndReplaceSeparator: "::",
  searchAndReplace: [{ search: "old", replace: "new" }],
};

describe("normalizeOptions", () => {
  const mockCfftFolderPath = "/base/folder";

  beforeAll(() => {
    jest.spyOn(path, "normalize").mockImplementation((value) => value);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should normalize paths and retain relative paths when within cfftFolderPath", () => {
    const result = normalizeOptions({ ...mockOptions }, mockCfftFolderPath);

    expect(result).toEqual({
      ...mockOptions,
      dirPath: path.join(mockCfftFolderPath, mockOptions.dirPath || ""),
      templatePath: path.join(
        mockCfftFolderPath,
        mockOptions.templatePath || ""
      ),
      hooksPath: path.join(mockCfftFolderPath, mockOptions.hooksPath || ""),
      configDir: path.join(mockCfftFolderPath, mockOptions.configDir || ""),
    });
  });

  it("should leave undefined paths unchanged", () => {
    const partialOptions: Partial<Options> = { dirPath: undefined };
    const result = normalizeOptions(partialOptions, mockCfftFolderPath);
    expect(result.dirPath).toBeUndefined();
  });

  it("should not modify absolute paths if they start with cfftFolderPath", () => {
    const absolutePath = path.join(mockCfftFolderPath, "/absolute/path");
    const result = normalizeOptions(
      { dirPath: absolutePath },
      mockCfftFolderPath
    );

    expect(result.dirPath).toBe(absolutePath);
  });

  it("should join absolute paths that do not start with cfftFolderPath", () => {
    const absolutePath = "/different/absolute/path";
    const result = normalizeOptions(
      { dirPath: absolutePath },
      mockCfftFolderPath
    );

    expect(result.dirPath).toBe(path.join(mockCfftFolderPath, absolutePath));
  });

  it("should not modify paths if cfftFolderPath is not provided", () => {
    const result = normalizeOptions({ ...mockOptions }, "");
    expect(result).toEqual(mockOptions);
  });

  it("should correctly handle other non-path fields", () => {
    const result = normalizeOptions({ ...mockOptions }, mockCfftFolderPath);

    expect(result.shouldReplaceFileContent).toBe(true);
    expect(result.shouldReplaceFileName).toBe(false);
    expect(result.fileNameTextToBeReplaced).toBe("oldName");
    expect(result.textToBeReplaced).toBe("oldText");
    expect(result.replaceTextWith).toBe("newText");
    expect(result.searchAndReplaceSeparator).toBe("::");
    expect(result.searchAndReplace).toEqual([
      { search: "old", replace: "new" },
    ]);
  });
});
