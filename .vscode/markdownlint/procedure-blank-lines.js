// @ts-check

"use strict";

const {
  addErrorAndInsertBlank,
  findPatternInLines,
  isBlank,
} = require("./utils");

/*
 * Check for blank lines on either side of a procedure tag. Registers an error
 * and fix with markdownlint if blank lines are missing.
 *
 * @param {Object} params Parsed Markdown content, provided by markdownlint.
 * @param {addErrorCallback} onError The callback that adds markdownlint errors.
 */
const checkProcedureBlankLines = (params, onError) => {
  const { lines } = params;
  const procedureTags = findPatternInLines(lines, "<\\/?procedure>");
  if (procedureTags.length === 0) return;
  procedureTags.forEach((procedureTag) => {
    // lineNumber is indexed from 1
    const zeroIndexedLine = procedureTag.lineNumber - 1;
    const hasPrecedingBlank =
      zeroIndexedLine === 0 || isBlank(lines[zeroIndexedLine - 1]);
    const hasFollowingBlank = isBlank(lines[zeroIndexedLine + 1]);
    if (!hasPrecedingBlank)
      addErrorAndInsertBlank({
        errorCallback: onError,
        lineNumber: procedureTag.lineNumber,
        blankLineOffset: 0,
      });
    if (!hasFollowingBlank)
      addErrorAndInsertBlank({
        errorCallback: onError,
        lineNumber: procedureTag.lineNumber,
        blankLineOffset: 1,
      });
  });
};

module.exports = {
  names: ["TS001", "timescale.procedures-blank-lines"],
  description: "Procedure tags should be surrounded by blank lines",
  tags: ["validation", "procedures"],
  function: checkProcedureBlankLines,
};
