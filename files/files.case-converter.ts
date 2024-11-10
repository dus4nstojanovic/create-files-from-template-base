import {
  toCamelCase,
  toDotCase,
  toHeaderCase,
  toKebabCase,
  toLowerCase,
  toPascalCase,
  toPathCase,
  toSentenceCase,
  toSnakeCase,
  toTextCase,
  toUpperCase,
} from "js-convert-case";

export enum CaseOption {
  CAMEL_CASE = "camelcase",
  SNAKE_CASE = "snakecase",
  PASCAL_CASE = "pascalcase",
  DOT_CASE = "dotcase",
  PATH_CASE = "pathcase",
  TEXT_CASE = "textcase",
  SENTENCE_CASE = "sentencecase",
  HEADER_CASE = "headercase",
  LOWER_CASE = "lowercase",
  UPPER_CASE = "uppercase",
  KEBAB_CASE = "kebabcase",
  UPPER_SNAKE_CASE = "uppersnakecase",
  LOWER_SNAKE_CASE = "lowersnakecase",
}

const getCaseOption = (option: string): CaseOption =>
  option.replace(/[ \/\\_\-\.]/g, "")?.toLowerCase() as CaseOption;
export const convertToSpecificCase = (text: string, option: string) => {
  const caseOption = getCaseOption(option);

  switch (caseOption) {
    case CaseOption.CAMEL_CASE:
      return toCamelCase(text);
    case CaseOption.SNAKE_CASE:
      return toSnakeCase(text);
    case CaseOption.PASCAL_CASE:
      return toPascalCase(text);
    case CaseOption.DOT_CASE:
      return toDotCase(text);
    case CaseOption.PATH_CASE:
      return toPathCase(text);
    case CaseOption.TEXT_CASE:
      return toTextCase(text);
    case CaseOption.SENTENCE_CASE:
      return toSentenceCase(text);
    case CaseOption.HEADER_CASE:
      return toHeaderCase(text);
    case CaseOption.LOWER_CASE:
      return toLowerCase(text);
    case CaseOption.UPPER_CASE:
      return toUpperCase(text);
    case CaseOption.KEBAB_CASE:
      return toKebabCase(text);
    case CaseOption.UPPER_SNAKE_CASE:
      return toSnakeCase(text).toUpperCase();
    case CaseOption.LOWER_SNAKE_CASE:
      return toSnakeCase(text).toLowerCase();
    default:
      return text;
  }
};
