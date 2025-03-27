module.exports = [
  {
    title: "About Timescale products",
    href: "about",
    filePath: "index.md",
    pageComponents: ["featured-cards"],
    excerpt:
      "Additional information about Timescale, including how to contribute, and release notes",
    children: [
      {
        title: "Timescale architecture for real-time analytics",
        href: "whitepaper",
        excerpt: "A whitepaper detailing the architectural choices and optimizations for real-time analytics that power Timescale"
      },
      {
        title: "Pricing plans and account management",
        href: "pricing-and-account-management",
        excerpt: "Pricing plans for Timescale Cloud services",
      },
      {
        title: "Changelog",
        href: "changelog",
        excerpt: "A summary of the latest changes to all Timescale products.",
      },
      {
        title: "TimescaleDB editions",
        href: "timescaledb-editions",
        excerpt: "Discover the different TimescaleDB editions and licences",
      },
      {
        title: "Contribute to Timescale",
        href: "contribute-to-timescale",
        excerpt: "Contribute to the Timescale codebase",
      },
      {
        title: "Release notes",
        href: "release-notes",
        excerpt: "Release information for TimescaleDB v2.0.0 - v2.15.1",
      },
    ],
  },
];
