const overviewPageIndex = require('../overview/page-index/page-index')
const gettingStartedPageIndex = require('../getting-started/page-index/page-index')
const howtoPageIndex = require('../how-to-guides/page-index/page-index')
const quickStartPageIndex = require('../quick-start/page-index/page-index')
const tutorialPageIndex = require('../tutorials/page-index/page-index')

module.exports = [
  {
    title: 'TimescaleDB',
    href: 'timescaledb',
    pageComponents:["featured-cards"],
    tags: ["timescaledb", "overview", "get started", "how-to's", "contribute"],
    keywords: ["TimescaleDB","get started","tutorials", "code", "contribute"],
    excerpt:
      "All you need to know about TimescaleDB architecture, concepts, setup, how-to's, tutorials, management, and contribution.",
    filePath: "index.md",
    children: [
      {
        title: "Overview",
        href: "overview",
        tags: ["timescaledb", "get started", "how-to's", "contribute"],
        keywords: ["TimescaleDB", "time-series", "data model", "deployment"],
        excerpt: "Overview of TimescaleDB",
      },
      {
        title: "Getting started",
        href: "getting-started",
        tags: ["timescaledb", "overview", "how-to's", "contribute"],
        keywords: ["instance", "time-series", "hypertable", "query"],
        excerpt: "Getting started with TimescaleDB",
      },
      {
        title: "How-to Guides",
        href: "how-to-guides",
        tags: ["timescaledb", "overview", "get started", "contribute"],
        keywords: ["connect", "write data", "query data", "alerts"],
        excerpt: "How to connect to TimescaleDB, administer and configure the database.",
      },
      {
        title: "Tutorials",
        href: "tutorials",
        tags: ["timescaledb", "overview", "get started", "how-to's"],
        keywords: ["IoT", "analyze data", "monitor", "visualize"],
        excerpt: "Learn all about the common scenarios and usecases for using TimescaleDB",
      },
      {
        title: "Code quick starts",
        href: "quick-start",
        tags: ["timescaledb", "overview", "get started", "how-to's"],
        keywords: ["node", "python", "ruby", "golang", "java", "C#"],
        excerpt: "A collection of quick starts for some of the favorite promramming languages.",
      },
      {
        title: 'Contribute to TimescaleDB',
        href: 'contribute-to-timescaledb',
        tags: ["timescaledb", "overview", "get started", "how-to's"],
        keywords: ["code", "GitHub", "git", "error"],
        excerpt:"Learn more about how to contribute to TimescaleDB",
      },
      {
        title: 'Contribute to documentation',
        href: 'contribute-to-docs',
        tags:["timescaledb", "get started", "how-to's", "contribute"],
        keywords:["code", "docs", "markdown", "styleguide"],
        excerpt:"Learn more about how to contribute to TimescaleDB documentation",
      },
      {
        title: 'Compare TimescaleDB Editions',
        href: 'timescaledb-edition-comparison',
        tags:["timescaledb", "get started", "how-to's", "contribute"],
        keywords:["Apache", "community", "features",],
        excerpt:"Compare different editions of TimecaleDB",
      },
    ],
  },
];
