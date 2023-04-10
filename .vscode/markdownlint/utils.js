// @ts-check

'use strict';

/*
 * Adds a markdownlint error with a corresponding fix that inserts blank lines.
 *
 * @param {addErrorCallback} onError The callback that adds markdownlint errors.
 * @param {number} lineNumber 1-indexed line number to add the error on.
 * @param {number} blankLineOffset Relative line on which to add blank line.
 */
module.exports.addErrorAndInsertBlank = ({ errorCallback, lineNumber, blankLineOffset = 0 }) => {
	errorCallback({
		lineNumber,
		fixInfo: {
			insertText: '\n',
			lineNumber: lineNumber + blankLineOffset,
			editColumn: 1
		}
	});
};

/*
 * Checks if a tag type is valid.
 *
 * @param {string} tagType The tag type to check.
 *
 * @returns {boolean}
 */
const isValidTagType = (tagType) => tagType === 'opening' || tagType === 'closing';

/*
 * Delete a blank line between a tag and its enclosed content.
 *
 * @param {Object} tag The tag to fix.
 * @param {('opening'|'closing')} tagType Whether the tag is an opening or closing tag.
 * @param {addErrorCallback} onError The callback to add a markdownlint error and fix.
 */
const fixBlankLine = ({ tag, tagType, errorCallback }) => {
	const lineNumberToFix = tagType === 'opening' ? tag.lineNumber + 1 : tag.lineNumber - 1;
	errorCallback({
		lineNumber: tag.lineNumber,
		detail: 'Line break between content and tag',
		fixInfo: {
			lineNumber: lineNumberToFix,
			deleteCount: -1
		}
	});
};

/*
 * Check for blank lines between a tag and its enclosed content.
 *
 * @param {Object} tag The tag to check.
 * @param {('opening'|'closing')} tagType Whether the tag is an opening or closing tag.
 * @param {String[]} lines The lines in the document
 * @param {addErrorCallback} onError The callback to add a markdownlint error and fix.
 * @param {Boolean} withExceptions Whether to make exceptions for code blocks and lists.
 * @param {Number} indent Number of spaces that the tag should be indented.
 */
module.exports.checkTagBlankLine = ({ tag, tagType, lines, onError }) => {
	if (!isValidTagType(tagType)) {
		throw `The tag type for checkTagLineBreak must be either opening or closing: ${tagType}`;
	}

	const lineNumberToCheck = tagType === 'opening' ? tag.lineNumber : tag.lineNumber - 2;
	const hasBlankNeighbor = this.isBlank(lines[lineNumberToCheck]);

	if (!hasBlankNeighbor) {
		onError({
			lineNumber: tag.lineNumber,
			detail: 'Exception: Leave a blank line between a highlight block and its content',
			fixInfo: {
				insertText: '\n',
				lineNumber: tagType === 'opening' ? tag.lineNumber + 1 : tag.lineNumber - 1
			}
		});
	}
};

/*
 * Check for lack of line break between a tag and its enclosed content.
 *
 * @param {Object} tag The tag to check.
 * @param {('opening'|'closing')} tagType Whether the tag is an opening or closing tag.
 * @param {string} pattern A regex pattern that matches the tag
 * @param {addErrorCallback} onError The callback to add a markdownlint error and fix.
 */
module.exports.checkTagLineBreak = ({ tag, tagType, pattern, errorCallback }) => {
	if (tagType !== 'opening' && tagType !== 'closing') {
		throw `The tag type for checkTagLineBreak must be either opening or closing: ${tagType}`;
	}

	// Check for lack of line break
	const regex = tagType === 'opening' ? `${pattern}$` : `^\\s*${pattern}`;
	if (!tag.line.match(regex)) {
		const match = tag.line.match(pattern);
		const indexOfTag = match.index + 1;
		const editColumn = tagType === 'opening' ? indexOfTag + match.at(0).length : indexOfTag;
		errorCallback({
			lineNumber: tag.lineNumber,
			detail: 'No line break between content and tag',
			fixInfo: {
				insertText: '\n',
				editColumn: editColumn
			}
		});
	}
};

/*
 * Checks that the number of opening tags matches the number of closing tags. If
 * not, registers an error with markdownlint.
 *
 * @param {Object[]} openingTags Array of opening tags, with properties `line` and `lineNumber`.
 * @param {Object[]} closingTags Array of closing tags.
 * @param {addErrorCallback} onError The callback that adds markdownlint errors.
 */
module.exports.checkTagsClosed = ({ openingTags, closingTags, errorCallback }) => {
	const message = 'This tag has no matching tag';

	let current = 0;
	let next;
	for (let i = 0; i < openingTags.length || i < closingTags.length; i++) {
		next = openingTags[i] ? openingTags[i].lineNumber : null;
		if (next === null) {
			errorCallback({ lineNumber: closingTags[i].lineNumber, detail: message });
			return;
		} else if (next < current) {
			errorCallback({
				lineNumber: openingTags[i - 1].lineNumber,
				detail: message
			});
			return;
		}
		current = next;

		next = closingTags[i] ? closingTags[i].lineNumber : null;
		if (next === null) {
			errorCallback({ lineNumber: openingTags[i].lineNumber, detail: message });
			return;
		} else if (next < current) {
			errorCallback({ lineNumber: next, detail: message });
			return;
		}
		current = next;
	}
};

/*
 * Checks the number of whitespace characters at the beginning of a line.
 *
 * @param {string} line The line to check.
 *
 * @returns {number} The number of whitespace characters at the beginning of the
 * line.
 */
module.exports.countWhitespace = (line) => line.length - line.trimStart().length;

/*
 * Gets all the lines corresponding to a regex pattern.
 *
 * @param {String[]} lines The lines to check.
 * @param {string} pattern The regex pattern to find inside content.
 *
 * @returns {Object[]} Object containing matching lines and their 1-indexed line numbers.
 */
module.exports.findPatternInLines = (lines, pattern) =>
	lines.reduce((patternLines, line, index) => {
		if (line.match(pattern)) {
			patternLines.push({
				line: line,
				lineNumber: index + 1
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
module.exports.isBlank = (line) => line.match(new RegExp(/^\s*$/));

/*
 * Checks if a token's line number is sandwiched between two other lines.
 *
 * @param {token} token The token to check.
 * @param {number} openingLineNumber The smaller line number bound.
 * @param {number} closingLineNumber The larger line number bound.
 *
 * @returns {boolean}
 */
module.exports.isBetween = ({ token, openingLineNumber, closingLineNumber }) =>
	token.lineNumber > openingLineNumber && token.lineNumber < closingLineNumber;

/*
 * Checks that the line of a token has the given indentation. If not, fix
 * indentation.
 *
 * @param {Object} token The token to check.
 * @param {number} indent The number of spaces to indent.
 * @param {addErrorCallback} onError The callback that adds markdownlint errors.
 */
module.exports.matchIndentation = ({ token, indent, errorCallback }) => {
	const lineWhitespace = this.countWhitespace(token.line);
	if (lineWhitespace !== indent) {
		errorCallback({
			lineNumber: token.lineNumber,
			fixInfo: {
				deleteCount: lineWhitespace,
				insertText: ''.padEnd(indent, ' ')
			}
		});
	}
};
