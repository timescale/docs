const apiReferencePageIndex = require("../api/page-index/page-index");
const timescaleDbPageIndex = require("../timescaledb/page-index/page-index");
const timescaleMSTPageIndex = require("../mst/page-index/page-index");
const timescaleSelfHostedPageIndex = require("../self-hosted/page-index/page-index");
const promscalePageIndex = require("../promscale/page-index/page-index");
const installPageIndex = require("../install/page-index/page-index");
const gsgPageIndex = require("../getting-started/page-index/page-index");

module.exports = [
  ...installPageIndex,
  ...gsgPageIndex,
  ...timescaleDbPageIndex,
  ...apiReferencePageIndex,
  ...timescaleMSTPageIndex,
  ...timescaleSelfHostedPageIndex,
  ...promscalePageIndex,
  {
    Title: "GitHub",
    type: "external",
    href: "https://github.com",
  },
];
