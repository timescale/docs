// @ts-check

"use strict";

const {
  checkTagBlankLine,
  checkTagsClosed,
  checkTagLineBreak,
  countWhitespace,
  findPatternInLines,
} = require("./utils");

/*
 * Check for a single line break between a highlight tag and its content.
 *
 * Exception: There must be a blank line if the highlight content ends in a code
 * block or a numbered list.
 *
 * @param {Object} params Parsed Markdown content, provided by markdownlint.
 * @param {addErrorCallback} onError The callback that adds markdownlint errors.
 */
const checkHighlightLineBreak = (params, onError) => {
  const { lines } = params;
  const openingPattern = "<Highlight[^<]*>";
  const closingPattern = "<\\/Highlight>";
  const openingTags = findPatternInLines(lines, openingPattern);
  const closingTags = findPatternInLines(lines, closingPattern);

  // Create an error for any unmatched highlight opening or closing tags
  checkTagsClosed({
    openingTags: openingTags,
    closingTags: closingTags,
    errorCallback: onError,
  });

  // Early return if number of opening and closing tags do not match, because it
  // is unclear how to match highlight tags to check for equal indentation.
  if (openingTags.length !== closingTags.length) return;

  // For each set of highlight tags, check for line break and indent. The tags
  // must be matched rather than checking opening and closing tags separately,
  // because the opening tag determines the indentation.
  for (let i = 0; i < openingTags.length; i++) {
    // Get all tags corresponding to the same highlight component
    const openingTag = openingTags[i];
    const closingTag = closingTags[i];

    // Check whitespace equal
    const allowedWhitespace = countWhitespace(openingTag.line);
    checkTagLineBreak({
      tag: openingTag,
      tagType: "opening",
      pattern: openingPattern,
      errorCallback: onError,
    });
    checkTagBlankLine({
      tag: openingTag,
      tagType: "opening",
      lines,
      onError,
    });
    checkTagLineBreak({
      tag: closingTag,
      tagType: "closing",
      pattern: closingPattern,
      errorCallback: onError,
    });
    checkTagBlankLine({
      tag: closingTag,
      tagType: "closing",
      lines,
      onError,
      withExceptions: true,
      indent: allowedWhitespace,
    });
  }
};

module.exports = {
  names: ["TS007", "timescale.highlight-line-break"],
  description:
    "Highlight tags should be separated from their content by a single line break",
  tags: ["validation", "highlights"],
  function: checkHighlightLineBreak,
};
