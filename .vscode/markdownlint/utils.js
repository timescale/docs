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
 * Check a tag for a single line break between it and the enclosed content.
 *
 * @param {Object} tag The tag to check.
 * @param {('opening'|'closing')} tagType Whether the tag is an opening or closing tag.
 * @param {string} pattern A regex pattern that matches the tag
 * @param {String[]} lines The lines in the document
 * @param {addErrorCallback} onError The callback to add a markdownlint error and fix.
 */
module.exports.checkTagLineBreak = (tag, tagType, pattern, lines, onError) => {
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
  if (this.isBlank(lines[lineNumberToCheck])) {
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
