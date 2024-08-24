import { TemplateConfig } from "./config.constants";
import { Config, CONFIG_FILE_NAME, DEFAULT_CONFIG, findConfig } from ".";
import { createFileAndWriteContent } from "../files";
import Logger from "../logger";

/**
 * Parses the existing cfft.config.json configuration or creates it if it doesn't exist
 * @param currentFolderPath The current context path to the folder
 * @returns The parsed configuration configuration object
 */
export const getOrCreateConfig = async (
  currentFolderPath: string
): Promise<{
  config: Config;
  created: boolean;
}> => {
  const config = await findConfig(currentFolderPath);

  if (!config) {
    try {
      await createFileAndWriteContent(
        CONFIG_FILE_NAME,
        JSON.stringify(DEFAULT_CONFIG, undefined, 2)
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
