// @ts-check

"use strict";

const {
  addErrorAndInsertBlank,
  findPatternInLines,
  isBlank,
} = require("./utils");

/*
 * Check for blank lines following an import statement. Registers an error
 * and fix with markdownlint if blank lines are missing.
 *
 * @param {Object} params Parsed Markdown content, provided by markdownlint.
 * @param {addErrorCallback} onError The callback that adds markdownlint errors.
 */
const checkImportBlankLine = (params, onError) => {
  const { lines } = params;
  const pattern = "^import .+ from '.+';$";
  const importStatements = findPatternInLines(lines, pattern);
  if (importStatements.length === 0) return;
  const lastImportStatementLine = importStatements.at(-1).lineNumber;
  // lineNumber is indexed from 1
  const hasFollowingBlank = isBlank(lines[lastImportStatementLine]);
  if (!hasFollowingBlank)
    addErrorAndInsertBlank(onError, lastImportStatementLine, 1);
};

module.exports = {
  names: ["TS002", "timescale.import-blank-line"],
  description: "Import statements should be followed by a blank line",
  tags: ["validation", "imports"],
  function: checkImportBlankLine,
};
