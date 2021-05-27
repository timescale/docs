const apiReferencePageIndex = require('../api/page-index/page-index')
const timescaleDbPageIndex = require('../timescaledb/page-index/page-index')
const timescaleForgePageIndex = require('../timescale-forge/page-index/page-index')
const timescaleCloudPageIndex = require('../timescale-cloud/page-index/page-index')


module.exports = [
  ...timescaleDbPageIndex,
  ...apiReferencePageIndex,
  ...timescaleForgePageIndex,
  ...timescaleCloudPageIndex,
  {
    Title: "GitHub",
    type: 'external',
    href: "https://github.com",
  },
]
