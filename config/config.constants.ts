import { Options } from "../options";

export const CONFIG_FILE_NAME = "cfft.config.json";

export type SearchAndReplaceItem = {
  search: string;
  replace: string;
  ignoreCase?: boolean;
  injectFile?: boolean;
  order?: number;
};

export type ConfigOnlyOptions = {
  searchAndReplace: SearchAndReplaceItem[];
  hooksPath: string;
};

export type ConfigTemplateOptions = Omit<Options, "fileName" | "template"> &
  ConfigOnlyOptions;

export type TemplateConfig = {
  name: string;
  description?: string;
  options: Partial<ConfigTemplateOptions>;
};

export type Config = {
  defaultTemplateName: string;
  templates: TemplateConfig[];
  path: string;
  folder: string;
};

// This object is used for the default configuration in the cfft.config.json file
export const DEFAULT_CONFIG: Omit<Config, "path" | "folder"> = {
  defaultTemplateName: "component",
  templates: [
    {
      name: "component",
      options: {
        templatePath: "/.cfft.templates/component",
        dirPath: "./{fileName}",
        fileNameTextToBeReplaced: "component",
        searchAndReplace: [{ search: "FileName", replace: "{fileName}" }],
      },
    },
  ],
};
