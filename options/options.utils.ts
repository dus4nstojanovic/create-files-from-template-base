import { ConfigTemplateOptions } from "../config";
import { Options } from "./options.constants";
import path from "path";

/**
 * Normalizes file paths in the options object if they exist.
 * This function ensures that the paths in the `options` object are properly normalized
 * according to the operating system's file path rules using `path.normalize`.
 *
 * @param {Partial<Options | ConfigTemplateOptions>} options - The options object containing paths that need normalization.
 * @param {string} cfftFolderPath The current path to the folder where the cfft.config.json resides
 * @returns {Partial<Options | ConfigTemplateOptions>} The options object with normalized paths.
 *
 * The following fields are normalized if they exist:
 * - `dirPath`
 * - `templatePath`
 * - `hooksPath`
 * - `configDir`
 *
 * If any of these fields are undefined, they will remain unchanged.
 */
export const normalizeOptions = (
  options: Partial<Options | ConfigTemplateOptions>,
  cfftFolderPath: string
) => {
  const normalizeIfExists = (value: string | undefined) => {
    if (!value) return value;

    value = path.normalize(value);

    if (
      path.isAbsolute(value) &&
      !path.resolve(value).startsWith(cfftFolderPath) &&
      cfftFolderPath
    ) {
      value = path.join(cfftFolderPath, value);
    }

    return value;
  };

  if (options) {
    options.dirPath = normalizeIfExists(options.dirPath);
    options.templatePath = normalizeIfExists(options.templatePath);
    options.hooksPath = normalizeIfExists(options.hooksPath);
    options.configDir = normalizeIfExists(options.configDir);

    options?.searchAndReplace?.forEach((sr) => {
      if (sr.injectFile) {
        sr.replace = normalizeIfExists(sr.replace) || "";
      }
    });
  }

  return options;
};
