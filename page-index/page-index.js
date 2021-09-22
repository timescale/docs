const apiReferencePageIndex = require('../api/page-index/page-index')
const gettingStartedPageIndex = require('../getting-started/page-index/page-index')
const timescaleDbPageIndex = require('../timescaledb/page-index/page-index')
const timescaleForgePageIndex = require('../timescale-forge/page-index/page-index')
const timescaleCloudPageIndex = require('../timescale-cloud/page-index/page-index')
const promscalePageIndex = require('../promscale/page-index/page-index')

module.exports = [
  ...gettingStartedPageIndex,
  ...timescaleDbPageIndex,
  ...timescaleForgePageIndex,
  ...timescaleCloudPageIndex,
  ...promscalePageIndex,
  ...apiReferencePageIndex,
  {
    Title: "GitHub",
    type: 'external',
    href: "https://github.com",
  },
]
