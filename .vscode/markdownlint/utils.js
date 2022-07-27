'use strict';

/*
 * Adds a markdownlint error with a corresponding fix that inserts blank lines.
 * 
 * @param {addErrorCallback} onError The callback that adds markdownlint errors.
 * @param {number} procedureLine Zero-indexed line number of procedure tag.
 * @param {number} blankLineOffset Relative line on which to add blank line.
 */
module.exports.addErrorAndInsertBlank = (onError, procedureLine, blankLineOffset) => {
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
 * Gets all the tokens with content corresponding to a regex pattern.
 * 
 * @param {string} pattern The regex pattern to find inside content.
 * @param {Object[]} tokens The tokens to check. May have nested token arrays.
 * @returns {Object[]} Tokens corresponding to the pattern. Non-nested.
 */
module.exports.findPatternInContent = (tokens, pattern) => {
  const patternTags = [];
  const recursiveFindPatternInContent = (tokens) => {
    tokens.map((token) => {
      if (token.children) {
        recursiveFindPatternInContent(token.children);
      } else if (
        token.content &&
          token.content.match(new RegExp(pattern))
      ) {
        patternTags.push(token);
      }
    });
  };
  recursiveFindPatternInContent(tokens);
  return patternTags;
};

/*
 * Checks if a line is blank (contains no characters or only whitespace).
 *
 * @param {string} line The line to check.
 * @returns {boolean}
 */
module.exports.isBlank = (line) => line.match(new RegExp('^\s*$'));
