'use strict';

/*
 * Checks if a line is blank (contains no characters or only whitespace).
 *
 * @param {string} line The line to check.
 * @returns {boolean}
 */
const isBlank = (line) => line.match(new RegExp('^\s*$'));

/*
 * Gets all the tokens that correspond to procedure tags.
 * 
 * @param {Object[]} tokens The tokens to check. May have nested token arrays.
 * @returns {Object[]} Tokens corresponding to procedure tags. Non-nested.
 */
const findProcedureTags = (tokens) => {
  const procedureTags = [];
  const recursiveFindProcedureTags = (tokens) => {
    tokens.map((token) => {
      if (token.children) {
        recursiveFindProcedureTags(token.children);
      } else if (
        token.content &&
          token.content.match(new RegExp('<\/?procedure>'))
      ) {
        procedureTags.push(token);
      }
    });
  };
  recursiveFindProcedureTags(tokens);
  return procedureTags;
};

/*
 * Adds a markdownlint error with a corresponding fix that inserts blank lines.
 * 
 * @param {addErrorCallback} onError The callback that adds markdownlint errors.
 * @param {number} procedureLine Zero-indexed line number of procedure tag.
 * @param {number} blankLineOffset Relative line on which to add blank line.
 */
const addErrorAndInsertBlank = (onError, procedureLine, blankLineOffset) => {
  onError({
    lineNumber: procedureLine + 1, // lineNumber is indexed from 1
    fixInfo: {
      'insertText': '\n',
      'lineNumber': procedureLine + 1 + blankLineOffset,
      'editColumn': 1
    }
  })
};

/*
 * Check for blank lines on either side of a procedure tag. Registers an error
 * and fix with markdownlint if blank lines are missing.
 * 
 * @param {Object} params Parsed Markdown content, provided by markdownlint.
 * @param {addErrorCallback} onError The callback that adds markdownlint errors.
 */
const checkProcedureBlankLines = (params, onError) => {
  const { lines } = params;
  const procedureTags = findProcedureTags(params.tokens);
  procedureTags.forEach((procedureTag) => {
    // lineNumber is indexed from 1
    const procedureLine = procedureTag.lineNumber - 1;
    const hasPrecedingBlank =
      procedureLine === 0 || isBlank(lines[procedureLine - 1]);
    const hasFollowingBlank = isBlank(lines[procedureLine + 1]);
    if (!hasPrecedingBlank) addErrorAndInsertBlank(onError, procedureLine, 0);
    if (!hasFollowingBlank) addErrorAndInsertBlank(onError, procedureLine, 1);
  })
};

module.exports = {
  names: [ 'TS001', 'timescale.procedures-blank-lines' ],
  description: 'Procedure tags should be surrounded by blank lines',
  tags: [ 'validation', 'procedures' ],
  function: checkProcedureBlankLines
};
