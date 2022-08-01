// @ts-check

'use strict';

const {
  checkTagLineBreak,
  findPatternInLines
} = require('./utils');

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
