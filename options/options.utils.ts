import { ConfigTemplateOptions } from "../config";
import { Options } from "./options.constants";
import path from "path";

/**
 * Normalizes file paths in the options object if they exist.
 * This function ensures that the paths in the `options` object are properly normalized
 * according to the operating system's file path rules using `path.normalize`.
 *
 * @param {Partial<Options | ConfigTemplateOptions>} options - The options object containing paths that need normalization.
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
  options: Partial<Options | ConfigTemplateOptions>
) => {
  const normalizeIfExists = (value: string | undefined) =>
    value ? path.normalize(value) : value;

  if (options) {
    options.dirPath = normalizeIfExists(options.dirPath);
    options.templatePath = normalizeIfExists(options.templatePath);
    options.hooksPath = normalizeIfExists(options.hooksPath);
    options.configDir = normalizeIfExists(options.configDir);
  }

  return options;
};
