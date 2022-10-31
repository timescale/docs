module.exports = [
  {
    title: "Getting started",
    href: "getting-started",
    pageComponents: ["featured-cards"],
    excerpt: "Getting started with TimescaleDB",
    children: [
      {
        title: "Create a hypertable",
        href: "create-hypertable",
        excerpt: "Create a hypertable in TimescaleDB",
      },
      {
        title: "Add time-series data",
        href: "add-data",
        excerpt: "Add sample data to your TimescaleDB instance",
      },
      {
        title: "Query your data",
        href: "query-data",
        excerpt: "Query your data using full SQL in TimescaleDB",
      },
      {
        title: "Create a continuous aggregate",
        href: "create-cagg",
        excerpt: "Establish continuous aggregates in TimescaleDB",
        children: [
          {
            title: "Continuous aggregate basics",
            href: "create-cagg-basics",
            excerpt: "Create continuous aggregates in TimescaleDB",
          },
          {
            title: "Continuous aggregate policies and refreshing data",
            href: "create-cagg-policy",
            excerpt: "Establish continuous aggregates policy in TimescaleDB",
          },
        ],
      },
      {
        title: "Save space with compression",
        href: "compress-data",
        excerpt: "Use TimescaleDB's native compression to save space",
      },
      {
        title: "Learn about data retention",
        href: "data-retention",
        excerpt:
          "Create a database retention policy for your TimescaleDB instance",
      },

      {
        title: "Next steps",
        href: "next-steps",
        excerpt:
          "Learn how to migrate, visualize and connect your data to TimescaleDB",
      },
    ],
  },
];
