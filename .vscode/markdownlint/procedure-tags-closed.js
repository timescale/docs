'use strict';

const {
  findPatternInContent 
} = require('./utils');

/*
 * Checks that the number of procedure opening tags matches the number of
 * procedure closing tags. If not, registers an error with markdownlint.
 * 
 * @param {Object} params Parsed Markdown content, provided by markdownlint.
 * @param {addErrorCallback} onError The callback that adds markdownlint errors.
 */
const checkProcedureTagsClosed = (params, onError) => {
  const { lines } = params;
  const procedureOpeningTags =
    findPatternInContent(params.tokens, '<procedure>');
  const procedureClosingTags =
    findPatternInContent(params.tokens, '<\/procedure>');
  if (procedureOpeningTags.length === procedureClosingTags.length) return;
  onError({
    lineNumber: procedureOpeningTags.at(0).lineNumber
  })
};

module.exports = {
  names: [ 'TS003', 'timescale.procedures-tags-closed' ],
  description: 'There is an unclosed procedure tag in this document',
  tags: [ 'validation', 'procedures' ],
  function: checkProcedureTagsClosed
};
