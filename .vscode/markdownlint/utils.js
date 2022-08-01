// @ts-check

'use strict';

/*
 * Adds a markdownlint error with a corresponding fix that inserts blank lines.
 * 
 * @param {addErrorCallback} onError The callback that adds markdownlint errors.
 * @param {number} procedureLine 1-indexed line number of procedure tag.
 * @param {number} blankLineOffset Relative line on which to add blank line.
 */
module.exports.addErrorAndInsertBlank = (onError, lineNumber, blankLineOffset=0) => {
  onError({
    lineNumber: lineNumber,
    fixInfo: {
      'insertText': '\n',
      'lineNumber': lineNumber + blankLineOffset,
      'editColumn': 1
    }
  })
};

/*
 * Checks that the number of opening tags matches the number of closing tags. If
 * not, registers an error with markdownlint.
 * 
 * @param {Object[]} openingTags Array of opening tags, with properties `line` and `lineNumber`.
 * @param {number} closingTags Array of closing tags.
 * @param {addErrorCallback} onError The callback that adds markdownlint errors.
 */
module.exports.checkTagsClosed = (
  openingTags,
  closingTags,
  onError
) => {
  if (openingTags.length === closingTags.length) return;
  
  let current = 0;
  let newCurrent;
  for (let i = 0; i < openingTags.length; i++) {
    newCurrent = openingTags[i].lineNumber;
    if (newCurrent < current) onError({lineNumber: newCurrent});
    current = newCurrent;

    newCurrent = closingTags[i] ? closingTags[i].lineNumber : closingTags[i-1].lineNumber;
    if (newCurrent < current) onError({lineNumber: openingTags[i].lineNumber});
    current = newCurrent;
  };
};

/*
 * Checks the number of whitespace characters at the beginning of a line.
 *
 * @param {string} line The line to check.
 *
 * @returns {number} The number of whitespace characters at the beginning of the
 * line.
 */
module.exports.countWhitespace = (line) => (
  line.length - line.trimStart().length
);

/*
 * Gets all the lines corresponding to a regex pattern.
 * 
 * @param {String[]} lines The lines to check.
 * @param {string} pattern The regex pattern to find inside content.
 * 
 * @returns {Object[]} Object containing matching lines and their 1-indexed line numbers.
 */
module.exports.findPatternInLines =
  (lines, pattern) => lines.reduce((patternLines, line, index) => {
    if (line.match(pattern)) {
      patternLines.push({
        line: line,
        lineNumber: index + 1,
      });
    }
    return patternLines;
  }, []);

/*
 * Checks if a line is blank (contains no characters or only whitespace).
 *
 * @param {string} line The line to check.
 * 
 * @returns {boolean}
 */
module.exports.isBlank = (line) => line.match(new RegExp('^\s*$'));

/*
 * Checks if a token's line number is sandwiched between two other lines.
 *
 * @param {token} token The token to check.
 * @param {number} openingLineNumber The smaller line number bound.
 * @param {number} closingLineNumber The larger line number bound.
 * 
 * @returns {boolean}
 */
module.exports.isBetween = (token, openingLineNumber, closingLineNumber) => (
  token.lineNumber > openingLineNumber && token.lineNumber < closingLineNumber
);

/*
 * Checks that the line of a token has the given indentation. If not, fix
 * indentation.
 * 
 * @param {Object} token The token to check.
 * @param {number} indent The number of spaces to indent.
 * @param {addErrorCallback} onError The callback that adds markdownlint errors.
 */
module.exports.matchIndentation = (token, indent, onError) => {
  const lineWhitespace = this.countWhitespace(token.line);
  if (lineWhitespace !== indent) {
    onError({
      lineNumber: token.lineNumber,
      fixInfo: {
        deleteCount: lineWhitespace,
        insertText: ''.padEnd(indent, ' '),
      },
    });
  }
}
