'use strict';

const {
  addErrorAndInsertBlank,
  findPatternInContent,
  isBlank 
} = require('./utils');

/*
 * Check for blank lines on either side of a procedure tag. Registers an error
 * and fix with markdownlint if blank lines are missing.
 * 
 * @param {Object} params Parsed Markdown content, provided by markdownlint.
 * @param {addErrorCallback} onError The callback that adds markdownlint errors.
 */
const checkProcedureBlankLines = (params, onError) => {
  const { lines } = params;
  const procedureTags = findPatternInContent(params.tokens, '<\/?procedure>');
  if (procedureTags.length === 0) return;
  procedureTags.forEach((procedureTag) => {
    // lineNumber is indexed from 1
    const procedureLine = procedureTag.lineNumber - 1;
    const hasPrecedingBlank =
      procedureLine === 0 || isBlank(lines[procedureLine - 1]);
    const hasFollowingBlank = isBlank(lines[procedureLine + 1]);
    if (!hasPrecedingBlank) addErrorAndInsertBlank(onError, procedureLine, 0);
    if (!hasFollowingBlank) addErrorAndInsertBlank(onError, procedureLine, 1);
  });
};

module.exports = {
  names: [ 'TS001', 'timescale.procedures-blank-lines' ],
  description: 'Procedure tags should be surrounded by blank lines',
  tags: [ 'validation', 'procedures' ],
  function: checkProcedureBlankLines
};
