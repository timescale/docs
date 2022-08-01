// @ts-check

const { isBlank, findPatternInLines } = require('./utils');

/*
 * Check a tag for a single line break between it and the enclosed content.
 *
 * @param {Object} tag The tag to check.
 * @param {('opening'|'closing')} tagType Whether the tag is an opening or closing tag.
 * @param {string} pattern A regex pattern that matches the tag
 * @param {String[]} lines The lines in the document
 * @param {addErrorCallback} onError The callback to add a markdownlint error and fix.
 */
const checkTagLineBreak = (tag, tagType, pattern, lines, onError) => {
  if (tagType !== 'opening' && tagType !== 'closing') {
    throw `The tag type for checkTagLineBreak must be either opening or closing: ${tagType}`;
  }

  // Check for lack of line break
  const regex = (tagType === 'opening') ? `${pattern}$` : `^${pattern}`;
  if (!tag.line.match(regex)) {
    const match = tag.line.match(pattern);
    const indexOfTag = match.index + 1;
    const editColumn = (tagType === 'opening')
      ? indexOfTag + match.at(0).length
      : indexOfTag;
    onError({
      lineNumber: tag.lineNumber,
      detail: 'No line break between content and tag',
      fixInfo: {
        insertText: '\n',
        editColumn: editColumn,
      },
    });
    return;
  }

  // Check for multiple line breaks
  const lineNumberToCheck = (tagType === 'opening') ? tag.lineNumber : tag.lineNumber - 2;
  if (isBlank(lines[lineNumberToCheck])) {
    const lineNumberToFix = (tagType === 'opening') ? tag.lineNumber + 1 : tag.lineNumber - 1;
    onError({
      lineNumber: tag.lineNumber,
      detail: 'Multiple line breaks between content and tag',
      fixInfo: {
        lineNumber: lineNumberToFix,
        deleteCount: -1,
      },
    });
  }
};

/*
 * Check for blank lines following an import statement. Registers an error
 * and fix with markdownlint if blank lines are missing.
 * 
 * @param {Object} params Parsed Markdown content, provided by markdownlint.
 * @param {addErrorCallback} onError The callback that adds markdownlint errors.
 */
const checkHighlightLineBreak = (params, onError) => {
  const { lines } = params;
  const openingPattern = '<highlight [^<]+>';
  const closingPattern = '<\/highlight>';
  const openingTags = findPatternInLines(lines, openingPattern);
  const closingTags = findPatternInLines(lines, closingPattern);

  openingTags.forEach((tag) => void checkTagLineBreak(tag, 'opening', openingPattern, lines, onError));
  closingTags.forEach((tag) => void checkTagLineBreak(tag, 'closing', closingPattern, lines, onError));
};

module.exports = {
  names: [ 'TS007', 'timescale.highlight-line-break' ],
  description: 'Highlight tags should be separated from their content by a single line break',
  tags: [ 'validation', 'highlights' ],
  function: checkHighlightLineBreak
};
