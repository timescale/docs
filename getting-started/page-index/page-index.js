module.exports = [
  {
    title: "Get started",
    href: "getting-started",
    pageComponents: ["featured-cards"],
    excerpt: "Get started with Timescale",
    children: [
      {
        title: "Create a hypertable",
        href: "create-hypertable",
        excerpt: "Create a hypertable in Timescale",
      },
      {
        title: "Add time-series data",
        href: "add-data",
        excerpt: "Add sample data to your Timescale instance",
      },
      {
        title: "Query your data",
        href: "query-data",
        excerpt: "Query your data using full SQL in Timescale",
      },
      {
        title: "Create a continuous aggregate",
        href: "create-cagg",
        excerpt: "Establish continuous aggregates in Timescale",
        children: [
          {
            title: "Continuous aggregate basics",
            href: "create-cagg-basics",
            excerpt: "Create continuous aggregates in Timescale",
          },
          {
            title: "Continuous aggregate policies and refreshing data",
            href: "create-cagg-policy",
            excerpt: "Establish continuous aggregates policy in Timescale",
          },
        ],
      },
      {
        title: "Save space with compression",
        href: "compress-data",
        excerpt: "Use Timescale's native compression to save space",
      },
      {
        title: "Learn about data retention",
        href: "data-retention",
        excerpt:
          "Create a database retention policy for your Timescale instance",
      },

      {
        title: "Next steps",
        href: "next-steps",
        excerpt:
          "Learn how to migrate, visualize and connect your data to Timescale",
      },
    ],
  },
];
