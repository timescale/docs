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
        children: [
          {
            title: "Release notes for TimescaleDB 2.0.0 to 2.9.3",
            href: "past-releases",
            excerpt: "Release notes for TimescaleDB 2.0.0 to 2.9.3",
          },
          {
            title: "Changes in TimescaleDB 2.0",
            href: "changes-in-timescaledb-2",
            excerpt:
              "An overview of major changes between TimescaleDB 1.0 and 2.0",
          },
        ],
      },
      {
        title: "Plans and account management",
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
