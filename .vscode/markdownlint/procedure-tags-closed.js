// @ts-check

"use strict";

const { checkTagsClosed, findPatternInLines } = require("./utils");

/*
 * Checks that the number of procedure opening tags matches the number of
 * procedure closing tags. If not, registers an error with markdownlint.
 *
 * @param {Object} params Parsed Markdown content, provided by markdownlint.
 * @param {addErrorCallback} onError The callback that adds markdownlint errors.
 */
const checkProcedureTagsClosed = (params, onError) => {
  const { lines } = params;
  const procedureOpeningTags = findPatternInLines(lines, "<procedure>");
  const procedureClosingTags = findPatternInLines(lines, "<\\/procedure>");
  if (procedureOpeningTags.length === 0 && procedureClosingTags.length === 0)
    return;
  checkTagsClosed({
    openingTags: procedureOpeningTags,
    closingTags: procedureClosingTags,
    errorCallback: onError,
  });
};

module.exports = {
  names: ["TS003", "timescale.procedures-tags-closed"],
  description: "Closing and opening tags must match",
  tags: ["validation", "procedures"],
  function: checkProcedureTagsClosed,
};
