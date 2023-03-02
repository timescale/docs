const apiReferencePageIndex = require("../api/page-index/page-index");
const selfHostedPageIndex = require("../self-hosted/page-index/page-index");
const timescaleMSTPageIndex = require("../mst/page-index/page-index");
const gsgPageIndex = require("../getting-started/page-index/page-index");
const timescaleUsingPageIndex = require("../guides/page-index/page-index");
const timescaleCloudPageIndex = require("../cloud/page-index/page-index");
const tutorialsPageIndex = require("../tutorials/page-index/page-index.js");
const codeQuickStartsPageIndex = require("../quick-start/page-index/page-index.js");
const timescaleAboutPageIndex = require("../getting-started/page-index/page-index");

module.exports = [
  ...gsgPageIndex,
  ...timescaleUsingPageIndex,
  ...timescaleCloudPageIndex
  ...tutorialsPageIndex,
  ...codeQuickStartsPageIndex,
  ...apiReferencePageIndex,
  ...timescaleMSTPageIndex,
  ...selfHostedPageIndex,
  ...timescaleAboutPageIndex,
  {
    Title: "GitHub",
    type: "external",
    href: "https://github.com",
  },
];
