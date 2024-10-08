import { TemplateConfig } from "./config.constants";
import {
  Config,
  CONFIG_FILE_NAME,
  DEFAULT_CONFIG,
  DEMO_INFO,
  findConfig,
  normalizeConfigPaths,
} from ".";
import { createDirectory, createFileAndWriteContent } from "../files";
import Logger from "../logger";
import path from "path";

/**
 * Parses the existing cfft.config.json configuration or creates it if it doesn't exist
 * @param currentFolderPath The current context path to the folder
 * @param cfftFolderPath The current path to the folder where the cfft.config.json resides
 * @returns The parsed configuration configuration object
 */
export const getOrCreateConfig = async ({
  currentFolderPath,
  cfftFolderPath,
}: {
  currentFolderPath: string;
  cfftFolderPath?: string;
}): Promise<{
  config: Config;
  created: boolean;
}> => {
  let config = await findConfig(currentFolderPath);

  if (!config) {
    if (!cfftFolderPath) {
      cfftFolderPath = currentFolderPath;
    }

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

      config = await findConfig(currentFolderPath);
      config = normalizeConfigPaths(config);

      return { config, created: true };
    } catch (e) {
      Logger.error("Error creating config file");
      throw e;
    }
  }

  config = normalizeConfigPaths(config);

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
