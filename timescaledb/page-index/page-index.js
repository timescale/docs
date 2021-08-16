const overviewPageIndex = require('../overview/page-index/page-index')
const gettingStartedPageIndex = require('../getting-started/page-index/page-index')
const howtoPageIndex = require('../how-to-guides/page-index/page-index')
const quickStartPageIndex = require('../quick-start/page-index/page-index')
const tutorialPageIndex = require('../tutorials/page-index/page-index')


module.exports = [
  {
    title: "TimescaleDB",
    href: "timescaledb",
    excerpt: 'All you need to know about TimescaleDB architecture, concepts, setup, how-to\'s, tutorials, and management',
    metaTags: [
      {
        name: 'description',
        content: 'This is the description for the timescaleDB page'
      },
    ],
    children: [
      ...overviewPageIndex,
      ...gettingStartedPageIndex,
      ...howtoPageIndex,
      ...tutorialPageIndex,
      ...quickStartPageIndex,
      {
        title: "Contribute to TimescaleDB",
        href: "contribute-to-timescaledb"
      },
      {
        title: "Contribute to documentation",
        href: "contribute-to-docs"
      }
    ]
  }
]
