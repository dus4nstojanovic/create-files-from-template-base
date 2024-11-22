export interface IfStatementItem {
  option: string;
  order: number;
}

export const replaceIfStatements = (
  ifStatements: IfStatementItem[] | undefined,
  input: string
): string => {
  if (!ifStatements?.length) {
    // If no IfStatementItem provided, simply remove all #IF statements.
    return removeAllIfStatements(input);
  }

  // Sort the IfStatementItem array by order.
  const sortedStatements = ifStatements.sort((a, b) => a.order - b.order);

  // Replace matched #IF statements.
  sortedStatements.forEach(({ option }) => {
    input = replaceByIfStatementItem(option, input);
  });

  // Remove any unmatched or leftover #IF statements.
  input = removeAllIfStatements(input);

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
  const pattern = /#IF\(([^,]+),\s*([^)]+)\)/g;

  return input.replace(pattern, (match, content, option) => {
    return option.trim() === matchingOption ? content.trim() : match;
  });
};

/**
 * Removes all occurrences of "#IF(Content, OPTION)" from the input string,
 * handling both multiline and inline cases. Also removes empty lines just before
 * or after the #IF statement.
 *
 * @param input - The input string to process.
 * @returns A string with all #IF occurrences removed, while preserving proper formatting.
 */
export const removeAllIfStatements = (input: string): string => {
  const pattern = /#IF\(([^,]+),\s*([^)]+)\)/g;

  return input
    .replace(pattern, "") // Remove #IF statements
    .replace(/(^|\n)\s*\n/g, "\n") // Remove empty lines directly before or after a removed line
    .trim();
};
