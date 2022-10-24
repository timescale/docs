module.exports = [
  {
    title: "Getting started",
    href: "getting-started",
    tags: ["timescaledb", "overview", "learn", "contribute"],
    excerpt: "Getting started with TimescaleDB",
    children: [
      {
        title: "Create a hypertable",
        href: "create-hypertable",
        tags: ["hypertables", "create", "learn", "timescaledb"],
        excerpt: "Create a hypertable in TimescaleDB",
      },
      {
        title: "Add time-series data",
        href: "add-data",
        tags: ["hypertables", "data", "ingest", "learn", "timescaledb"],
        excerpt: "Add sample data to your TimescaleDB instance",
      },
      {
        title: "Query your data",
        href: "query-data",
        tags: ["data", "query", "learn", "timescaledb"],
        excerpt: "Query your data using full SQL in TimescaleDB",
      },
      {
        title: "Create a continuous aggregate",
        href: "create-cagg",
        tags: ["caggs", "create", "learn", "timescaledb"],
        excerpt: "Establish continuous aggregates in TimescaleDB",
        children: [
          {
            title: "Continuous aggregate basics",
            href: "create-cagg-basics",
            tags: ["caggs", "create", "learn", "timescaledb"],
            excerpt: "Create continuous aggregates in TimescaleDB",
          },
          {
            title: "Continuous aggregate policies and refreshing data",
            href: "create-cagg-policy",
            tags: ["caggs", "create", "learn", "timescaledb"],
            excerpt: "Establish continuous aggregates policy in TimescaleDB",
          },
        ],
      },
      {
        title: "Save space with compression",
        href: "compress-data",
        tags: ["compression", "data", "learn", "timescaledb"],
        excerpt: "Use TimescaleDB's native compression to save space",
      },
      {
        title: "Learn about data retention",
        href: "data-retention",
        tags: ["data", "manage", "learn", "timescaledb"],
        excerpt:
          "Create a database retention policy for your TimescaleDB instance",
      },

      {
        title: "Next steps",
        href: "next-steps",
        tags: ["migrate", "visualize", "manage", "learn", "timescaledb"],
        excerpt:
          "Learn how to migrate, visualize and connect your data to TimescaleDB",
      },
    ],
  },
];
