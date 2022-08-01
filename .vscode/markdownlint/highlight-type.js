// @ts-check

'use strict';

const { findPatternInLines } = require('./utils');

const highlightTypes = [
  'note',
  'important',
  'warning',
  'cloud',
  'deprecation',
];

const errorMessage = highlightTypes.reduce((message, type, index) => (
  message.concat(`\`${type}\` ${index === highlightTypes.length - 1 ? '.' : ', '}`)
), 'Allowed highlight types are ');

/*
 * Check for blank lines following an import statement. Registers an error
 * and fix with markdownlint if blank lines are missing.
 * 
 * @param {Object} params Parsed Markdown content, provided by markdownlint.
 * @param {addErrorCallback} onError The callback that adds markdownlint errors.
 */
const checkHighlightType = (params, onError) => {
  const { lines } = params;
  const highlightTags = findPatternInLines(lines, '<highlight[^<]*>');

  highlightTags.forEach((tag) => {
    const match = tag.line.match('type="([^"]+)"');

    if (!match) {
      onError({
        lineNumber: tag.lineNumber,
        detail: 'No type defined for highlight',
      });
      return;
    }

    const highlightType = match.at(1);
    if (!highlightTypes.includes(highlightType)) {
      onError({
        lineNumber: tag.lineNumber,
        detail: `The highlight type \`${highlightType}\` is not allowed.`
      });
    }
  });
};

module.exports = {
  names: [ 'TS008', 'timescale.highlight-types' ],
  description: errorMessage,
  tags: [ 'validation', 'highlights' ],
  function: checkHighlightType
};
