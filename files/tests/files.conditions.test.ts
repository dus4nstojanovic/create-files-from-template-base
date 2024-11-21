import { describe, test, expect } from "@jest/globals";
import {
  replaceIfStatements,
  replaceByIfStatementItem,
  IfStatementItem,
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
  test("replaces #IF statements in order of IfStatementItem", () => {
    const input =
      "Start #IF(FirstContent, FIRST) #IF(SecondContent, SECOND) End";
    const ifStatements: IfStatementItem[] = [
      { option: "SECOND", order: 2 },
      { option: "FIRST", order: 1 },
    ];
    const expected = "Start FirstContent SecondContent End";
    expect(replaceIfStatements(ifStatements, input)).toBe(expected);
  });

  test("does not replace unmatched #IF statements", () => {
    const input =
      "Start #IF(FirstContent, FIRST) #IF(SecondContent, SECOND) End";
    const ifStatements: IfStatementItem[] = [{ option: "FIRST", order: 1 }];
    const expected = "Start FirstContent #IF(SecondContent, SECOND) End";
    expect(replaceIfStatements(ifStatements, input)).toBe(expected);
  });

  test("handles nested and ordered replacements", () => {
    const input = "Nested #IF(#IF(InnerContent, INNER), OUTER) Content";
    const ifStatements: IfStatementItem[] = [
      { option: "INNER", order: 1 },
      { option: "OUTER", order: 2 },
    ];
    const expected = "Nested InnerContent Content";
    expect(replaceIfStatements(ifStatements, input)).toBe(expected);
  });

  test("handles empty IfStatementItem array", () => {
    const input = "This is #IF(Content, OPTION).";
    const ifStatements: IfStatementItem[] = [];
    const expected = "This is #IF(Content, OPTION).";
    expect(replaceIfStatements(ifStatements, input)).toBe(expected);
  });

  test("ignores malformed #IF patterns", () => {
    const input = "This #IF(MALFORMED string should remain unchanged.";
    const ifStatements: IfStatementItem[] = [{ option: "MALFORMED", order: 1 }];
    const expected = "This #IF(MALFORMED string should remain unchanged.";
    expect(replaceIfStatements(ifStatements, input)).toBe(expected);
  });
});
