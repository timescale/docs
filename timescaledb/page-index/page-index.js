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
    tags: ["timescaledb", "time-series database", "concepts", "architecture", "management"],
    keywords: ["TimescaleDB","contribute to documentation","contribute to TimescaleDB", "get started", "overview", "how-to", "tutorials", "quick starts", "TimescaleDB editions",],
    excerpt:
      "All you need to know about TimescaleDB architecture, concepts, setup, how-to's, tutorials, and management",
    filePath: "index.md",
    children: [
      {
        title: "Overview",
        href: "installation-cloud",
        tags: ["tsc", "install"],
        keywords: ["install", "Timescale Cloud", "create service", "connect to service"],
        excerpt: "Install Timescale Cloud",
      },
      {
        title: "Getting started",
        href: "installation-cloud",
        tags: ["tsc", "install"],
        keywords: ["install", "Timescale Cloud", "create service", "connect to service"],
        excerpt: "Install Timescale Cloud",
      },
      {
        title: "How-to Guides",
        href: "installation-cloud",
        tags: ["tsc", "install"],
        keywords: ["install", "Timescale Cloud", "create service", "connect to service"],
        excerpt: "Install Timescale Cloud",
      },
      {
        title: "Tutorials",
        href: "installation-cloud",
        tags: ["tsc", "install"],
        keywords: ["install", "Timescale Cloud", "create service", "connect to service"],
        excerpt: "Install Timescale Cloud",
      },
      {
        title: "Code quick starts",
        href: "installation-cloud",
        tags: ["tsc", "install"],
        keywords: ["install", "Timescale Cloud", "create service", "connect to service"],
        excerpt: "Install Timescale Cloud",
      },
      {
        title: 'Contribute to TimescaleDB',
        href: 'contribute-to-timescaledb',
        tags: [],
        keywords: [],
        excerpt:"",
      },
      {
        title: 'Contribute to documentation',
        href: 'contribute-to-docs',
        tags:[],
        keywords:[],
        excerpt:"",
      },
      {
        title: 'Compare TimescaleDB Editions',
        href: 'timescaledb-edition-comparison',
        tags:[],
        keywords:[],
        excerpt:"",
      },
    ],
  },
];
