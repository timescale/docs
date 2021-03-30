const overviewPageIndex = require('../overview/page-index/page-index')
const gettingStartedPageIndex = require('../getting-started/page-index/page-index')
const howtoPageIndex = require('../how-to-guides/page-index/page-index')
const tutorialPageIndex = require('../tutorials/page-index/page-index')


module.exports = [
  {
    title: "TimescaleDB",
    href: "timescaledb",
    excerpt: 'All you need to know about TimescaleDB architecture, concepts, setup, how-to\'s, tutorials, and management',
    pageComponents: ['featured-cards'],
    children: [
      ...overviewPageIndex,
      ...gettingStartedPageIndex,
      ...howtoPageIndex,
      ...tutorialPageIndex,
      {
        href: "administration",
        children: [
          {
            href: "configuration"
          },
          {
            href: "telemetry"
          }
        ]
      },
      {
        href: "integrations",
      }
    ]
  }
]
