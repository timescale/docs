module.exports = [
  {
    title: "About TigerData products",
    href: "about",
    defaultOpen: true,
    filePath: "index.md",
    pageComponents: ["featured-cards"],
    excerpt:
      "Additional information about TigerData products, their features, and supported platforms",
    children: [
      {
        title: "TigerData architecture for real-time analytics",
        href: "whitepaper",
        excerpt:
          "A whitepaper detailing the architectural choices and optimizations for real-time analytics that power TigerData products",
      },
      {
        title: "Pricing plans and account management",
        href: "pricing-and-account-management",
        excerpt: "Pricing plans for Tiger Cloud services",
      },
      {
        title: "Feature comparison",
        href: "feature-comparison",
        excerpt: "Feature comparison for Tiger Cloud and self-hosted TimescaleDB.",
      },
      {
        title: "Changelog",
        href: "changelog",
        excerpt: "A summary of the latest changes to Tiger Cloud.",
      },
      {
        title: "TimescaleDB editions",
        href: "timescaledb-editions",
        excerpt: "Discover the different TimescaleDB editions and licences",
      },
      {
        title: "Supported platforms",
        href: "supported-platforms",
        excerpt: "The platforms and systems supported by TigerData products",
      },
      {
        title: "Contribute to TigerData",
        href: "contribute-to-timescale",
        excerpt: "Contribute to the codebase and documentation of TigerData products",
      },
      {
        title: "Release notes",
        href: "release-notes",
        excerpt: "Release information for TimescaleDB v2.0.0 - v2.15.1",
      },
    ],
  },
];
