const apiReferencePageIndex = require('../api-reference/page-index/page-index')
const timescaleDbPageIndex = require('../timescaledb/page-index/page-index')

module.exports = [
  ...timescaleDbPageIndex,
  ...apiReferencePageIndex,
  {
    Title: "GitHub",
    type: 'external',
    href: "https://github.com",
  },
]
