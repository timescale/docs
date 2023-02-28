const overviewPageIndex = require("../overview/page-index/page-index");
const howtoPageIndex = require("../how-to-guides/page-index/page-index");
const quickStartPageIndex = require("../quick-start/page-index/page-index");
const tutorialPageIndex = require("../tutorials/page-index/page-index");
const cloudConsolePageIndex = require("../cloud-console/page-index/page-index");

module.exports = [
  {
    title: "TimescaleDB",
    href: "timescaledb",
    pageComponents: ["featured-cards"],
    excerpt:
      "All you need to know about TimescaleDB architecture, concepts, setup, how-tos, tutorials, management, and contribution.",
    filePath: "index.md",
    children: [
      ...overviewPageIndex,
      ...howtoPageIndex,
      ...cloudConsolePageIndex,
      ...tutorialPageIndex,
      ...quickStartPageIndex,
      {
        title: "Contribute to TimescaleDB",
        href: "contribute-to-timescaledb",
        excerpt: "Learn more about how to contribute to TimescaleDB",
      },
      {
        title: "Contribute to documentation",
        href: "contribute-to-docs",
        excerpt:
          "Learn more about how to contribute to TimescaleDB documentation",
      },
      {
        title: "Compare TimescaleDB Editions",
        href: "timescaledb-edition-comparison",
        excerpt: "Compare different editions of TimescaleDB",
      },
    ],
  },
];
