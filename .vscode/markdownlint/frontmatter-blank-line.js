// @ts-check

'use strict';

const {
  addErrorAndInsertBlank,
  isBlank
} = require('./utils');

/*
 * Check for blank lines following an import statement. Registers an error
 * and fix with markdownlint if blank lines are missing.
 * 
 * @param {Object} params Parsed Markdown content, provided by markdownlint.
 * @param {addErrorCallback} onError The callback that adds markdownlint errors.
 */
const checkFrontmatterBlankLine = (params, onError) => {
  const { frontMatterLines } = params;
  if (!isBlank(frontMatterLines.at(-1))) {
    addErrorAndInsertBlank(onError, 1);
  }
};

module.exports = {
  names: [ 'TS006', 'timescale.frontmatter-blank-line' ],
  description: 'Frontmatter should be followed by a blank line',
  tags: [ 'validation', 'frontmatter' ],
  function: checkFrontmatterBlankLine
};
