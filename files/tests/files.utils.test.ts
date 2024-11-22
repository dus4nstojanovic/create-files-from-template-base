import { Options } from "./../../options/options.constants";
import {
  createDirectory,
  createFileAndWriteContent,
  createFileOrDirectoryFromTemplate,
  getInnerDirectoriesAndFilesPaths,
  isDirectory,
  readFileContent,
} from "../files.utils";
import fs from "fs";

describe("getInnerDirectoriesAndFilesPaths", () => {
  const dirPath = "./test-dir";
  const files = ["file1.txt", "file2.txt", "file3.txt"];

  beforeAll(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();

    jest.spyOn(fs, "readdir").mockImplementation((path, callback: any) => {
      callback(null, files);
    });
  });

  it("should return an array of file paths", async () => {
    const expected = files.map((file) => `${dirPath}/${file}`);
    const result = await getInnerDirectoriesAndFilesPaths(dirPath);
    expect(result).toEqual(expected);
  });
  it("should throw an error if the directory cannot be read", async () => {
    jest.spyOn(fs, "readdir").mockImplementation((path, callback: any) => {
      callback(new Error("Directory not found"));
    });
    expect.assertions(1);
    try {
      await getInnerDirectoriesAndFilesPaths(dirPath);
    } catch (e: any) {
      expect(e.message).toBe(
        `Couldn't get files paths from folder: '${dirPath}'`
      );
    }
  });
});

describe("createFileAndWriteContent", () => {
  const pathArg = "./test-file.txt";
  const content = "This is a test file.";

  beforeAll(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();

    jest.spyOn(fs, "writeFile").mockImplementation((path, data, callback) => {
      callback(null);
    });
  });

  it("should create a file with the specified content", async () => {
    jest.spyOn(fs, "writeFile").mockImplementation((path, data, callback) => {
      callback(null);
    });

    await createFileAndWriteContent(pathArg, content);
    expect(fs.writeFile).toHaveBeenCalledWith(
      pathArg,
      content,
      expect.anything()
    );
  });

  it("should throw an error if the file cannot be created", async () => {
    jest.spyOn(fs, "writeFile").mockImplementation((path, data, callback) => {
      callback(new Error("File not found"));
    });
    expect.assertions(1);
    try {
      await createFileAndWriteContent(pathArg, content);
    } catch (e: any) {
      expect(e.message).toBe(`Couldn't create file: '${pathArg}'`);
    }
  });
});

describe("readFileContent", () => {
  const pathArg = "./test-file.txt";
  const content = "This is a test file.";

  beforeAll(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();

    jest.spyOn(fs, "readFile").mockImplementation((path, callback: any) => {
      callback(null, content);
    });
  });

  it("should read the content of the specified file", async () => {
    const result = await readFileContent(pathArg);
    expect(result).toBe(content);
  });

  it("should throw an error if the file cannot be read", async () => {
    jest.spyOn(fs, "readFile").mockImplementation((path, callback: any) => {
      callback(new Error("File not found"));
    });
    expect.assertions(1);
    try {
      await readFileContent(pathArg);
    } catch (e: any) {
      expect(e.message).toBe(
        `Couldn't read file content from path: '${pathArg}'`
      );
    }
  });
});

describe("createDirectory", () => {
  const path = "./test-dir";

  beforeAll(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();

    jest.spyOn(fs, "mkdir").mockImplementation(((
      path: any,
      {},
      callback: any
    ) => {
      callback(null);
    }) as any);
  });

  it("should create a directory with the specified path", async () => {
    const result = await createDirectory(path);
    expect(fs.mkdir).toHaveBeenCalledWith(
      path,
      { recursive: true },
      expect.anything()
    );
    expect(result).toBeUndefined();
  });

  it("should throw an error if the directory cannot be created", async () => {
    jest.spyOn(fs, "mkdir").mockImplementation(((
      path: any,
      {},
      callback: any
    ) => {
      callback(new Error("Directory not found"));
    }) as any);
    expect.assertions(1);
    try {
      await createDirectory(path);
    } catch (e: any) {
      expect(e.message).toBe(`Couldn't create directory for path: '${path}'`);
    }
  });
});

describe("isDirectory", () => {
  const path = "./test-dir";

  beforeAll(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();

    jest.spyOn(fs, "lstatSync").mockImplementation(
      (path) =>
        ({
          isDirectory: jest.fn(() => true),
        } as any)
    );
  });

  it("should return true if the specified path is a directory", () => {
    const result = isDirectory(path);
    expect(fs.lstatSync).toHaveBeenCalledWith(path);
    expect(result).toBe(true);
  });

  it("should throw an error if the path cannot be checked", () => {
    jest.spyOn(fs, "lstatSync").mockImplementation((path) => {
      throw new Error("Path not found");
    });
    expect.assertions(1);
    try {
      isDirectory(path);
    } catch (e: any) {
      expect(e.message).toBe(
        `Couldn't determine if the provided path is a directory: '${path}'`
      );
    }
  });
});

describe("createFileOrDirectoryFromTemplate", () => {
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
    searchAndReplace: [],
    configDir: "path",
    hooksPath: "",
  };

  beforeAll(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();

    jest.spyOn(fs, "readdir").mockImplementation((path, callback: any) => {
      callback(null, ["file1.js", "file2.js"]);
    });

    jest.spyOn(fs, "lstatSync").mockImplementation(
      (path) =>
        ({
          isDirectory: jest.fn(() => !path.toString().includes(".js")),
        } as any)
    );

    jest.spyOn(fs, "mkdir").mockImplementation(((
      path: any,
      options: any,
      callback: any
    ) => {
      callback(null);
    }) as any);

    jest.spyOn(fs, "readFile").mockImplementation((path, callback: any) => {
      callback(null, "This is a test file.");
    });

    jest
      .spyOn(fs, "writeFile")
      .mockImplementation((path, content, callback) => {
        callback(null);
      });
  });

  it("should create a directory with children from the template if the template is a directory", async () => {
    await createFileOrDirectoryFromTemplate(args);

    expect(fs.readdir).toHaveBeenCalledWith(
      args.templatePath,
      expect.any(Function)
    );
    expect(fs.mkdir).toHaveBeenCalledWith(
      `test-dir/template-dir`,
      { recursive: true },
      expect.any(Function)
    );
    expect(fs.writeFile).toHaveBeenNthCalledWith(
      1,
      "test-dir/template-dir/file1.js",
      "This is a test file.",
      expect.any(Function)
    );
    expect(fs.writeFile).toHaveBeenNthCalledWith(
      2,
      "test-dir/template-dir/file2.js",
      "This is a test file.",
      expect.any(Function)
    );
  });

  it("should create a file from the template if the template is a file", async () => {
    jest.spyOn(fs, "lstatSync").mockImplementation(
      (path) =>
        ({
          isDirectory: jest.fn(() => false),
        } as any)
    );

    await createFileOrDirectoryFromTemplate(args);

    expect(fs.readFile).toHaveBeenCalledWith(
      args.templatePath,
      expect.anything()
    );
    expect(fs.writeFile).toHaveBeenCalledWith(
      `test-dir/template-dir`,
      "This is a test file.",
      expect.any(Function)
    );
  });

  it("should throw an error if the template cannot be accessed", async () => {
    jest.spyOn(fs, "lstatSync").mockImplementation((path) => {
      throw new Error("Path not found");
    });

    expect.assertions(1);
    try {
      await createFileOrDirectoryFromTemplate(args);
    } catch (e: any) {
      expect(e.message).toBe(
        `Couldn't determine if the provided path is a directory: '${args.templatePath}'`
      );
    }
  });

  const testShouldConvertCaseCorrectly = async (
    text: string,
    expectedText: string
  ) => {
    jest.spyOn(fs, "readFile").mockImplementation((path, callback: any) => {
      callback(null, text);
    });

    jest.spyOn(fs, "lstatSync").mockImplementation(
      (path) =>
        ({
          isDirectory: jest.fn(() => false),
        } as any)
    );

    const testArgs: typeof args = {
      ...args,
      shouldReplaceFileContent: true,
    };

    await createFileOrDirectoryFromTemplate(testArgs);

    expect(fs.readFile).toHaveBeenCalledWith(
      testArgs.templatePath,
      expect.anything()
    );

    expect(fs.writeFile).toHaveBeenCalledWith(
      `test-dir/template-dir`,
      expectedText,
      expect.any(Function)
    );
  };

  it("should convert case correctly - CAMEL_CASE", async () => {
    await testShouldConvertCaseCorrectly(
      "const route = routes.FOR_SITEMAP.#(param-case, CAMEL_CASE).route;",
      "const route = routes.FOR_SITEMAP.paramCase.route;"
    );
  });

  it("should convert case correctly - SNAKE_CASE", async () => {
    await testShouldConvertCaseCorrectly(
      "const route = routes.FOR_SITEMAP.#(param-case, SNAKE_CASE).route;",
      "const route = routes.FOR_SITEMAP.param_case.route;"
    );
  });

  it("should convert case correctly - PASCAL_CASE", async () => {
    await testShouldConvertCaseCorrectly(
      "const route = routes.FOR_SITEMAP.#(param-case, PASCAL_CASE).route;",
      "const route = routes.FOR_SITEMAP.ParamCase.route;"
    );
  });

  it("should convert case correctly - DOT_CASE", async () => {
    await testShouldConvertCaseCorrectly(
      "const route = routes.FOR_SITEMAP.#(param-case, DOT_CASE).route;",
      "const route = routes.FOR_SITEMAP.param.case.route;"
    );
  });

  it("should convert case correctly - PATH_CASE", async () => {
    await testShouldConvertCaseCorrectly(
      "const route = routes.FOR_SITEMAP.#(param-case, PATH_CASE).route;",
      "const route = routes.FOR_SITEMAP.param/case.route;"
    );
  });

  it("should convert case correctly - TEXT_CASE", async () => {
    await testShouldConvertCaseCorrectly(
      "const route = routes.FOR_SITEMAP.#(param-case, TEXT_CASE).route;",
      "const route = routes.FOR_SITEMAP.param case.route;"
    );
  });

  it("should convert case correctly - SENTENCE_CASE", async () => {
    await testShouldConvertCaseCorrectly(
      "const route = routes.FOR_SITEMAP.#(param-case, SENTENCE_CASE).route;",
      "const route = routes.FOR_SITEMAP.Param case.route;"
    );
  });

  it("should convert case correctly - HEADER_CASE", async () => {
    await testShouldConvertCaseCorrectly(
      "const route = routes.FOR_SITEMAP.#(param-case, HEADER_CASE).route;",
      "const route = routes.FOR_SITEMAP.Param Case.route;"
    );
  });

  it("should convert case correctly - LOWER_CASE", async () => {
    await testShouldConvertCaseCorrectly(
      "const route = routes.FOR_SITEMAP.#(paRam-case, LOWER_CASE).route;",
      "const route = routes.FOR_SITEMAP.param-case.route;"
    );
  });

  it("should convert case correctly - UPPER_CASE", async () => {
    await testShouldConvertCaseCorrectly(
      "const route = routes.FOR_SITEMAP.#(param-case, UPPER_CASE).route;",
      "const route = routes.FOR_SITEMAP.PARAM-CASE.route;"
    );
  });

  it("should convert case correctly - KEBAB_CASE", async () => {
    await testShouldConvertCaseCorrectly(
      "const route = routes.FOR_SITEMAP.#(param-case, KEBAB_CASE).route;",
      "const route = routes.FOR_SITEMAP.param-case.route;"
    );
  });

  it("should convert case correctly - UPPER_SNAKE_CASE", async () => {
    await testShouldConvertCaseCorrectly(
      "const route = routes.FOR_SITEMAP.#(ParamCase, UPPER_SNAKE_CASE).route;",
      "const route = routes.FOR_SITEMAP.PARAM_CASE.route;"
    );
  });

  it("should convert case correctly - LOWER_SNAKE_CASE", async () => {
    await testShouldConvertCaseCorrectly(
      "const route = routes.FOR_SITEMAP.#(ParamCase, LOWER_SNAKE_CASE).route;",
      "const route = routes.FOR_SITEMAP.param_case.route;"
    );
  });

  it("should convert multiple cases correctly", async () => {
    await testShouldConvertCaseCorrectly(
      `
      // START
      const route1 = routes.FOR_SITEMAP.#(param-case, CAMEL_CASE).route;
      const route2 = routes.FOR_SITEMAP.#(param-case, SNAKE_CASE).route;
      const route3 = routes.FOR_SITEMAP.#(param-case, PASCAL_CASE).route;
      const route4 = routes.FOR_SITEMAP.#(param-case, DOT_CASE).route;
      const route5 = routes.FOR_SITEMAP.#(param-case, PATH_CASE).route;
      const route6 = routes.FOR_SITEMAP.#(param-case, TEXT_CASE).route;
      // MIDDLE
      const route7 = routes.FOR_SITEMAP.#(param-case, SENTENCE_CASE).route;
      const route8 = routes.FOR_SITEMAP.#(param-case, HEADER_CASE).route;
      const route9 = routes.FOR_SITEMAP.#(paRam-case, LOWER_CASE).route;
      const route10 = routes.FOR_SITEMAP.#(param-case, UPPER_CASE).route;
      const route11 = routes.FOR_SITEMAP.#(param-case, KEBAB_CASE).route;
      const route12 = routes.FOR_SITEMAP.#(ParamCase, UPPER_SNAKE_CASE).route;
      const route13 = routes.FOR_SITEMAP.#(ParamCase, LOWER_SNAKE_CASE).route;
      // END
      `,
      `// START
      const route1 = routes.FOR_SITEMAP.paramCase.route;
      const route2 = routes.FOR_SITEMAP.param_case.route;
      const route3 = routes.FOR_SITEMAP.ParamCase.route;
      const route4 = routes.FOR_SITEMAP.param.case.route;
      const route5 = routes.FOR_SITEMAP.param/case.route;
      const route6 = routes.FOR_SITEMAP.param case.route;
      // MIDDLE
      const route7 = routes.FOR_SITEMAP.Param case.route;
      const route8 = routes.FOR_SITEMAP.Param Case.route;
      const route9 = routes.FOR_SITEMAP.param-case.route;
      const route10 = routes.FOR_SITEMAP.PARAM-CASE.route;
      const route11 = routes.FOR_SITEMAP.param-case.route;
      const route12 = routes.FOR_SITEMAP.PARAM_CASE.route;
      const route13 = routes.FOR_SITEMAP.param_case.route;
      // END`
    );
  });

  it("should allow case insensitive options", async () => {
    await testShouldConvertCaseCorrectly(
      `
      const route1 = routes.FOR_SITEMAP.#(param-case, PASCAL_CASE).route;
      const route2 = routes.FOR_SITEMAP.#(param-case, PASCALCASE).route;
      const route3 = routes.FOR_SITEMAP.#(param-case, pascalcase).route;
      const route4 = routes.FOR_SITEMAP.#(param-case, PascalCase).route;
      const route5 = routes.FOR_SITEMAP.#(param-case, pascalCase).route;
      const route6 = routes.FOR_SITEMAP.#(param-case, pascal.Case).route;
      const route7 = routes.FOR_SITEMAP.#(param-case, pascal/case).route;
      const route8 = routes.FOR_SITEMAP.#(param-case, pascal\case).route;
      const route9 = routes.FOR_SITEMAP.#(param-case, PASCAL-case).route;
      const route10 = routes.FOR_SITEMAP.#(param-case, PASCAL case).route;
      const route11 = routes.FOR_SITEMAP.#(param-case, pascal case).route;
      `,
      `const route1 = routes.FOR_SITEMAP.ParamCase.route;
      const route2 = routes.FOR_SITEMAP.ParamCase.route;
      const route3 = routes.FOR_SITEMAP.ParamCase.route;
      const route4 = routes.FOR_SITEMAP.ParamCase.route;
      const route5 = routes.FOR_SITEMAP.ParamCase.route;
      const route6 = routes.FOR_SITEMAP.ParamCase.route;
      const route7 = routes.FOR_SITEMAP.ParamCase.route;
      const route8 = routes.FOR_SITEMAP.ParamCase.route;
      const route9 = routes.FOR_SITEMAP.ParamCase.route;
      const route10 = routes.FOR_SITEMAP.ParamCase.route;
      const route11 = routes.FOR_SITEMAP.ParamCase.route;`
    );
  });
});
