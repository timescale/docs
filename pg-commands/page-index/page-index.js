module.exports = [
  {
    title: "PostgreSQL for time-series",
    href: "pg-commands",
    pageComponents: ["featured-cards"],
    tags: ["timescaledb", "postgresql", "commands", "getting started"],
    keywords: ["PostgreSQL", "commands", "learn"],
    excerpt: "Working with PostgreSQL commands for time-series data",
    filePath: "index.md",
    children: [
      {
        title: "ORDER BY",
        href: "order-by",
        tags: ["timescaledb", "postgresql", "commands", "getting started"],
        keywords: ["PostgreSQL", "commands", "learn"],
        excerpt: "Using the ORDER BY PostgreSQL command with time-series",
      },
    ],
  },
];
