module.exports = [
  {
    title: "About Timescale",
    href: "about",
    filePath: "index.md",
    pageComponents: ["featured-cards"],
    excerpt:
      "Additional information about Timescale, including how to contribute, and release notes",
    children: [
      {
        title: "Changelog",
        href: "changelog",
        excerpt: "A summary of the latest changes to all Timescale products.",
      },
      {
        title: "Release notes",
        href: "release-notes",
        excerpt: "Release information for TimescaleDB v2.0.0 - v2.15.1",
      },
      {
        title: "Pricing plans and account management",
        href: "pricing-and-account-management",
        excerpt: "Pricing tiers for Timescale Cloud services",
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
        title: "Contribute to Timescale documentation",
        href: "contribute-to-docs",
        excerpt: "Contribute to Timescale documentation",
      },
    ],
  },
];
