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
  CAMEL_CASE = "CAMEL_CASE",
  SNAKE_CASE = "SNAKE_CASE",
  PASCAL_CASE = "PASCAL_CASE",
  DOT_CASE = "DOT_CASE",
  PATH_CASE = "PATH_CASE",
  TEXT_CASE = "TEXT_CASE",
  SENTENCE_CASE = "SENTENCE_CASE",
  HEADER_CASE = "HEADER_CASE",
  LOWER_CASE = "LOWER_CASE",
  UPPER_CASE = "UPPER_CASE",
  KEBAB_CASE = "KEBAB_CASE",
  UPPER_SNAKE_CASE = "UPPER_SNAKE_CASE",
  LOWER_SNAKE_CASE = "LOWER_SNAKE_CASE",
}

export const convertToSpecificCase = (text: string, option: CaseOption) => {
  switch (option) {
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
      return toSnakeCase(text).toUpperCase();
    default:
      return text;
  }
};
