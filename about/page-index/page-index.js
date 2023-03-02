module.exports = [
  {
    title: "About Timescale",
    href: "about",
    pageComponents: ["featured-cards"],
    excerpt: "Additional information about Timescale, including how to contribute, and release notes",
    children: [
      {
        title: "Release notes",
        href: "release-notes",
        excerpt: "Timescale release documentation",
        children: [
          {
            title: "Changes in TimescaleDB 2.0",
            href: "changes-in-timescaledb-2",
            excerpt: "An overview of major changes between TimescaleDB 1.0 and 2.0",
          },
        ],
      },
      {
        title: "Timescale editions",
        href: "timescaledb-editions",
        excerpt: "Discover the different Timescale editions and licences",
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
