// @ts-check

"use strict";

const {
  checkTagsClosed,
  countWhitespace,
  findPatternInLines,
  isBetween,
  matchIndentation,
} = require("./utils");

/*
 * Check for consistent indentation of terminal and tab tags. Registers an error
 * and fix with markdownlint if indentation is inconsistent.
 *
 * @param {Object} params Parsed Markdown content, provided by markdownlint.
 * @param {addErrorCallback} onError The callback that adds markdownlint errors.
 */
const checkTerminalIndent = (params, onError) => {
  // Find all terminal-related JSX tags
  const { lines } = params;
  const terminalOpeningTags = findPatternInLines(lines, "<terminal>");
  const terminalClosingTags = findPatternInLines(lines, "<\\/terminal>");
  const tabTags = findPatternInLines(lines, "<\\/?tab.*>");
  if (terminalOpeningTags.length === 0) return;

  // Create an error for any unmatched terminal opening or closing tags
  checkTagsClosed(terminalOpeningTags, terminalClosingTags, onError);

  // Early return if number of opening and closing tags do not match, because
  // it is unclear how to split multiple terminals into sets to check matching
  // indentation.
  if (terminalOpeningTags.length !== terminalClosingTags.length) return;

  // For each set of terminal tags, check that indent is the same throughout
  // the set. Use the opening terminal tag as the standard for the entire set.
  for (let i = 0; i < terminalOpeningTags.length; i++) {
    // Get all tags corresponding to the same terminal component
    const terminalOpeningLine = terminalOpeningTags[i].lineNumber;
    const terminalClosingLine = terminalClosingTags[i].lineNumber;
    const enclosedTabs = tabTags.filter((tag) =>
      isBetween(tag, terminalOpeningLine, terminalClosingLine)
    );

    // Check whitespace equal
    const allowedWhitespace = countWhitespace(terminalOpeningTags[i].line);
    matchIndentation(terminalClosingTags[i], allowedWhitespace, onError);
    enclosedTabs.forEach((tabTag) =>
      matchIndentation(tabTag, allowedWhitespace, onError)
    );
  }
};

module.exports = {
  names: ["TS005", "timescale.terminal-indent"],
  description: "Terminal and tab tags must be consistently indented",
  tags: ["validation", "terminals"],
  function: checkTerminalIndent,
};
