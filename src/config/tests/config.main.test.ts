import { Config } from "./../config.constants";
import { getOrCreateConfig, getTemplateFromConfig } from "../config.main";
import * as ConfigUtils from "../config.utils";
import * as FileUtils from "../../files/files.utils";

const TEMPLATE_CONFIG = {
  name: "component",
  options: {
    template: "/.cfft.templates/component",
    dirPath: "./{fileName}",
    fileNameTextToBeReplaced: "component",
    textToBeReplaced: "FileName",
    replaceTextWith: "{fileName}",
    shouldReplaceFileContent: true,
    shouldReplaceFileName: true,
    searchAndReplaceSeparator: ";",
  },
};
const CONFIG: Config = {
  defaultTemplateName: "component",
  templates: [TEMPLATE_CONFIG],
  folder: "/Users/username",
  path: "/Users/username/cfft.config.json",
};

describe("getOrCreateConfig", () => {
  beforeAll(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();

    jest
      .spyOn(ConfigUtils, "findConfig")
      .mockImplementation(() => Promise.resolve(CONFIG));
  });

  it("should retrieve a config file if it can be found", async () => {
    const result = await getOrCreateConfig();

    expect(result).not.toBeNull();
    expect(result.created).toBeFalsy();
    expect(result.config).toEqual(CONFIG);
  });
  it("should create a config file and write content to it if it can not be found", async () => {
    jest
      .spyOn(ConfigUtils, "findConfig")
      .mockImplementation(() => Promise.resolve(null) as any);

    jest
      .spyOn(FileUtils, "createFileAndWriteContent")
      .mockImplementation(jest.fn());

    const result = await getOrCreateConfig();

    expect(result).not.toBeNull();
    expect(result.created).toBeTruthy();
    expect(ConfigUtils.findConfig).toHaveBeenCalled();
  });

  it("should throw an error if there is an issue creating a file", async () => {
    jest
      .spyOn(ConfigUtils, "findConfig")
      .mockImplementation(() => Promise.resolve(null) as any);

    jest
      .spyOn(FileUtils, "createFileAndWriteContent")
      .mockImplementation(() => {
        throw new Error(`Error creating or writing a file`);
      });

    expect.assertions(1);
    try {
      await getOrCreateConfig();
    } catch (e: any) {
      expect(e.message).toBe("Error creating or writing a file");
    }
  });
});

describe("getTemplateFromConfig", () => {
  beforeAll(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it("should retrieve a template from config correctly", () => {
    const result = getTemplateFromConfig(CONFIG, "component");

    expect(result).toEqual(TEMPLATE_CONFIG);
  });
});
