const apiReferencePageIndex = require("../api/page-index/page-index");
const timescaleDbPageIndex = require("../timescaledb/page-index/page-index");
const timescaleCloudPageIndex = require("../cloud/page-index/page-index");
const timescaleMSTPageIndex = require("../mst/page-index/page-index");
const promscalePageIndex = require("../promscale/page-index/page-index");
const gsgPageIndex = require("../getting-started/page-index/page-index");


module.exports = [
  ...gsgPageIndex,
  ...timescaleDbPageIndex,
  ...apiReferencePageIndex,
  ...timescaleCloudPageIndex,
  ...timescaleMSTPageIndex,
  ...promscalePageIndex,
  {
    Title: "GitHub",
    type: "external",
    href: "https://github.com",
  },
];
