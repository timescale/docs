// @ts-check

"use strict";

const { findPatternInLines } = require("./utils");

/*
 * Check for indent of a procedure tag. Registers an error and fix with
 * markdownlint if tag is indented.
 *
 * @param {Object} params Parsed Markdown content, provided by markdownlint.
 * @param {addErrorCallback} onError The callback that adds markdownlint errors.
 */
const checkProcedureNoIndent = (params, onError) => {
  const { lines } = params;
  const procedureTags = findPatternInLines(lines, "<\\/?procedure>");
  if (procedureTags.length === 0) return;
  for (let i = 0; i < procedureTags.length; i++) {
    const procedureTagText = procedureTags[i].line;
    const numberWhitespaceCharacters =
      procedureTagText.length - procedureTagText.trimStart().length;
    if (numberWhitespaceCharacters === 0) continue;
    onError({
      lineNumber: procedureTags[i].lineNumber,
      fixInfo: {
        deleteCount: numberWhitespaceCharacters,
      },
    });
  }
};

module.exports = {
  names: ["TS004", "timescale.procedures-no-indent"],
  description: "Procedure tags should not be indented",
  tags: ["validation", "procedures"],
  function: checkProcedureNoIndent,
};
