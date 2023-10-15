const apiReferencePageIndex = require("../api/page-index/page-index");
const selfHostedPageIndex = require("../self-hosted/page-index/page-index");
const timescaleMSTPageIndex = require("../mst/page-index/page-index");
const gsgPageIndex = require("../getting-started/page-index/page-index");
const timescaleUsingPageIndex = require("../use-timescale/page-index/page-index");
const navigationPageIndex = require("../navigation/page-index/page-index");
const tutorialsPageIndex = require("../tutorials/page-index/page-index.js");
const codeQuickStartsPageIndex = require("../quick-start/page-index/page-index.js");
const migrationPageIndex = require("../migrate/page-index/page-index.js");
const timescaleAboutPageIndex = require("../about/page-index/page-index");
const overviewPageIndex = require("../overview/page-index/page-index");


module.exports = [
  ...overviewPageIndex,
  ...gsgPageIndex,
  ...timescaleUsingPageIndex,
  ...tutorialsPageIndex,
  ...codeQuickStartsPageIndex,
  ...apiReferencePageIndex,
  ...selfHostedPageIndex,
  ...timescaleMSTPageIndex,
  ...timescaleAboutPageIndex,
  ...navigationPageIndex,
  ...migrationPageIndex,
  {
    Title: "GitHub",
    type: "external",
    href: "https://github.com",
  },
];
