export interface IfStatementItem {
  option: string;
  order: number;
}

/**
 * Processes a list of IfStatementItem objects to replace #IF occurrences in the input string.
 *
 * @param ifStatements - An array of IfStatementItem objects with `option` and `order` properties.
 * @param input - The input string to process.
 * @returns A string with all applicable #IF occurrences replaced in the specified order.
 */
export const replaceIfStatements = (
  ifStatements: IfStatementItem[] | undefined,
  input: string
): string => {
  if (!ifStatements?.length) return input;

  const sortedStatements = ifStatements.sort((a, b) => a.order - b.order);

  sortedStatements.forEach(({ option }) => {
    input = replaceByIfStatementItem(option, input);
  });

  return input;
};

/**
 * Replaces occurrences of "#IF(Content, OPTION)" in a string with "Content",
 * only if the provided `matchingOption` matches the OPTION inside the #IF.
 *
 * @param matchingOption - The option to match against the OPTION in the #IF statement.
 * @param input - The input string to process.
 * @returns A string with all applicable #IF occurrences replaced as specified.
 */
export const replaceByIfStatementItem = (
  matchingOption: string,
  input: string
): string => {
  const pattern = /#IF\(((?:[^#]|#(?!IF))+?),\s*([^)]+)\)/g;

  let result = input;
  let match;

  while ((match = pattern.exec(result)) !== null) {
    const [fullMatch, content, option] = match;

    if (option.trim() === matchingOption) {
      result = result.replace(fullMatch, content.trim());
    }
  }

  return result;
};
