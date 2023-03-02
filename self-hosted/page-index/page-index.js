const overviewPageIndex = require("../overview/page-index/page-index");

module.exports = [
  {
    title: "Self-hosted",
    href: "self-hosted",
    pageComponents: ["featured-cards"],
    excerpt:
      "All you need to know about TimescaleDB architecture, concepts, setup, how-tos, tutorials, management, and contribution.",
    filePath: "index.md",
    children: [...overviewPageIndex],
  },
];
