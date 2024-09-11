import { TemplateConfig } from "./config.constants";
import {
  Config,
  CONFIG_FILE_NAME,
  DEFAULT_CONFIG,
  DEMO_INFO,
  findConfig,
} from ".";
import { createDirectory, createFileAndWriteContent } from "../files";
import Logger from "../logger";
import path from "path";

/**
 * Parses the existing cfft.config.json configuration or creates it if it doesn't exist
 * @param currentFolderPath The current context path to the folder
 * @returns The parsed configuration configuration object
 */
export const getOrCreateConfig = async ({
  currentFolderPath,
  cfftFolderPath = currentFolderPath,
}: {
  currentFolderPath: string;
  cfftFolderPath?: string;
}): Promise<{
  config: Config;
  created: boolean;
}> => {
  const config = await findConfig(currentFolderPath);

  if (!config) {
    try {
      const cfftPath = path.join(cfftFolderPath, CONFIG_FILE_NAME);
      await createFileAndWriteContent(
        cfftPath,
        JSON.stringify(DEFAULT_CONFIG, undefined, 2)
      );

      Logger.success(
        `⚙️  ${CONFIG_FILE_NAME} config file has been created: '${path.resolve(
          "."
        )}'`
      );

      const cfftTemplatesFolderPath = path.join(
        cfftFolderPath,
        path.normalize(
          DEFAULT_CONFIG.templates[0].options.templatePath as string
        )
      );

      await createDirectory(cfftTemplatesFolderPath);

      // create demo component.tsx
      await createFileAndWriteContent(
        path.join(cfftTemplatesFolderPath, DEMO_INFO.component.name),
        DEMO_INFO.component.content
      );

      // create demo component.module.scss
      await createFileAndWriteContent(
        path.join(cfftTemplatesFolderPath, DEMO_INFO.styles.name),
        DEMO_INFO.styles.content
      );

      Logger.success(
        `⚙️  .cfft.templates directory has been created: '${path.resolve(".")}'`
      );

      return { config: await findConfig(currentFolderPath), created: true };
    } catch (e) {
      Logger.error("Error creating config file");
      throw e;
    }
  }

  return { config, created: false };
};

/**
 * Finds the template configuration object by name and extracts it
 * @param config The configuration object
 * @param templateName The name of the template that should be extracted
 * @returns The template configuration object
 */
export const getTemplateFromConfig = (
  config: Config,
  templateName: string
): TemplateConfig | undefined =>
  config.templates?.find((c) => c.name === templateName);

export const normalizeConfigPaths = (config: Config) => {
  const normalizeIfExists = (value: string | undefined) =>
    value ? path.normalize(value) : value;

  config?.templates?.forEach((template) => {
    if (template.options) {
      template.options.dirPath = normalizeIfExists(template.options.dirPath);
      template.options.templatePath = normalizeIfExists(
        template.options.templatePath
      );
      template.options.hooksPath = normalizeIfExists(
        template.options.hooksPath
      );
      template.options.configDir = normalizeIfExists(
        template.options.configDir
      );
    }
  });

  return config;
};
