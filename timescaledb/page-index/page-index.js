const overviewPageIndex = require('../overview/page-index/page-index')
const howtoPageIndex = require('../how-to-guides/page-index/page-index')
const quickStartPageIndex = require('../quick-start/page-index/page-index')
const tutorialPageIndex = require('../tutorials/page-index/page-index')

module.exports = [
  {
    title: 'TimescaleDB',
    href: 'timescaledb',
    pageComponents:["featured-cards"],
    tags: ["timescaledb", "overview", "get started", "learn", "contribute"],
    keywords: ["TimescaleDB","get started","tutorials", "code", "contribute"],
    excerpt:
      "All you need to know about TimescaleDB architecture, concepts, setup, how-tos, tutorials, management, and contribution.",
    filePath: "index.md",
    children: [
      ...overviewPageIndex,
      ...howtoPageIndex,
      ...tutorialPageIndex,
      ...quickStartPageIndex,
      {
        title: 'Compare TimescaleDB Editions',
        href: 'timescaledb-edition-comparison',
        tags:["timescaledb", "get started", "learn", "contribute"],
        keywords:["Apache", "community", "features",],
        excerpt:"Compare different editions of TimescaleDB",
      },
    ],
  },
];
