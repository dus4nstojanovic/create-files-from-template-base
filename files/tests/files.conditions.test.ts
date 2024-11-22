import { describe, test, expect } from "@jest/globals";
import {
  replaceIfStatements,
  replaceByIfStatementItem,
  IfStatementItem,
  removeAllIfStatements,
} from "../files.conditions";

describe("replaceByIfStatementItem", () => {
  test("replaces matching #IF statement", () => {
    const input = "HOLLA #IF(Something, OPTION)";
    const expected = "HOLLA Something";
    expect(replaceByIfStatementItem("OPTION", input)).toBe(expected);
  });

  test("does not replace when matchingOption does not match", () => {
    const input = "HOLLA #IF(Something, OPTION)";
    const expected = "HOLLA #IF(Something, OPTION)";
    expect(replaceByIfStatementItem("ANOTHER_OPTION", input)).toBe(expected);
  });

  test("leaves strings without #IF unchanged", () => {
    const input = "This is a plain string.";
    const expected = "This is a plain string.";
    expect(replaceByIfStatementItem("OPTION", input)).toBe(expected);
  });
});

describe("replaceIfStatements", () => {
  test("replaces #IF statements in order of IfStatementItem and removes unmatched #IFs", () => {
    const input =
      "Start #IF(FirstContent, FIRST) #IF(SecondContent, SECOND) End";
    const ifStatements: IfStatementItem[] = [
      { option: "SECOND", order: 2 },
      { option: "FIRST", order: 1 },
    ];
    const expected = "Start FirstContent SecondContent End";
    expect(replaceIfStatements(ifStatements, input)).toBe(expected);
  });

  test("removes unmatched #IF statements after replacement", () => {
    const input =
      "Start #IF(FirstContent, FIRST) #IF(SecondContent, SECOND) End";
    const ifStatements: IfStatementItem[] = [{ option: "FIRST", order: 1 }];
    const expected = "Start FirstContent  End";
    expect(replaceIfStatements(ifStatements, input)).toBe(expected);
  });

  test("handles nested and ordered replacements and removes leftovers", () => {
    const input = "Nested #IF(#IF(InnerContent, INNER), OUTER) Content";
    const ifStatements: IfStatementItem[] = [
      { option: "INNER", order: 1 },
      { option: "OUTER", order: 2 },
    ];
    const expected = "Nested InnerContent Content";
    expect(replaceIfStatements(ifStatements, input)).toBe(expected);
  });

  test("handles empty IfStatementItem array and removes all #IF statements", () => {
    const input = "This is #IF(Content, OPTION).";
    const ifStatements: IfStatementItem[] = [];
    const expected = "This is .";
    expect(replaceIfStatements(ifStatements, input)).toBe(expected);
  });

  test("ignores malformed #IF patterns and removes them", () => {
    const input = "This #IF(MALFORMED string should remain unchanged.";
    const ifStatements: IfStatementItem[] = [{ option: "MALFORMED", order: 1 }];
    const expected = "This #IF(MALFORMED string should remain unchanged.";
    const result = replaceIfStatements(ifStatements, input);
    expect(replaceIfStatements(ifStatements, input)).toBe(expected);
  });

  test("removes unmatched #IF statements even if not replaced", () => {
    const input = "Before #IF(Content, OPTION) After #IF(Leftover, OTHER).";
    const ifStatements: IfStatementItem[] = [{ option: "OPTION", order: 1 }];
    const expected = "Before Content After .";
    expect(replaceIfStatements(ifStatements, input)).toBe(expected);
  });

  test("removes #IF statements when multiline and handles replacements", () => {
    const input = `Before
    #IF(Content, OPTION)
    After`;
    const ifStatements: IfStatementItem[] = [{ option: "OPTION", order: 1 }];
    const expected = "Before\n    Content\n    After";
    expect(replaceIfStatements(ifStatements, input)).toBe(expected);
  });
});

describe("removeAllIfStatements", () => {
  test("removes a single #IF statement", () => {
    const input = "This is a test #IF(Content, OPTION) string.";
    const expected = "This is a test  string.";
    expect(removeAllIfStatements(input)).toBe(expected);
  });

  test("removes multiple #IF statements", () => {
    const input =
      "Start #IF(Content1, OPTION1) Middle #IF(Content2, OPTION2) End.";
    const expected = "Start  Middle  End.";
    expect(removeAllIfStatements(input)).toBe(expected);
  });

  test("leaves strings without #IF unchanged", () => {
    const input = "This is a plain string.";
    const expected = "This is a plain string.";
    expect(removeAllIfStatements(input)).toBe(expected);
  });

  test("handles malformed #IF patterns gracefully", () => {
    const input = "This #IF(MALFORMED string should remain unchanged.";
    const expected = "This #IF(MALFORMED string should remain unchanged.";
    expect(removeAllIfStatements(input)).toBe(expected);
  });

  test("removes #IF statements and trims the result", () => {
    const input = "   #IF(Content, OPTION)   ";
    const expected = "";
    expect(removeAllIfStatements(input)).toBe(expected);
  });

  test("removes #IF statements mixed with other content", () => {
    const input =
      "Before #IF(Content, OPTION) After #IF(MoreContent, OTHER_OPTION).";
    const expected = "Before  After .";
    const result = removeAllIfStatements(input);
    expect(result).toBe(expected);
  });

  test("removes #IF statements when multiline", () => {
    const input = `Before
    #IF(Content, OPTION)
    After`;
    const expected = "Before\n    After";
    const result = removeAllIfStatements(input);
    expect(result).toBe(expected);
  });
});
