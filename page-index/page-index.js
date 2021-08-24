const apiReferencePageIndex = require('../api/page-index/page-index')
const timescaleDbPageIndex = require('../timescaledb/page-index/page-index')
const timescaleCloudPageIndex = require('../cloud/page-index/page-index')
const timescaleMSTPageIndex = require('../mst/page-index/page-index')


module.exports = [
  ...timescaleDbPageIndex,
  ...apiReferencePageIndex,
  ...timescaleCloudPageIndex,
  ...timescaleMSTPageIndex,
  {
    Title: "GitHub",
    type: 'external',
    href: "https://github.com",
  },
]
