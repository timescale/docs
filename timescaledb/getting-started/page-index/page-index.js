module.exports = [
    {
        title: "Getting started",
        href: "getting-started",
        pageComponents: ['featured-cards'],
        tags: ["timescaledb", "overview", "learn", "contribute"],
        keywords: ["instance", "time-series", "hypertable", "query"],
        excerpt: "Getting started with TimescaleDB",
        children: [
          {
            title: "1. Create a hypertable",
            href: "create-hypertable",
            tags: ['hypertables', 'create', 'learn', 'timescaledb'],
            keywords: ['hypertables', 'tutorial', 'TimescaleDB'],
            excerpt: "Create a hypertable in TimescaleDB"
          },
          {
            title: "2. Add time-series data",
            href: "add-data",
            tags: ['hypertables', 'data', 'ingest', 'learn', 'timescaledb'],
            keywords: ['hypertables', 'tutorial', 'TimescaleDB'],
            excerpt: "Add sample data to your TimescaleDB instance"
          },
          {
            title: "3. Query your data",
            href: "query-data",
            tags: ['data', 'query', 'learn', 'timescaledb'],
            keywords: ['tutorial', 'TimescaleDB'],
            excerpt: "Query your data using full SQL in TimescaleDB"
          },
          {
            title: "4. Create a continuous aggregate",
            href: "create-cagg",
            tags: ['caggs', 'create', 'learn', 'timescaledb'],
            keywords: ['continuous aggregates', 'tutorial', 'TimescaleDB'],
            excerpt: "Establish continuous aggregates in TimescaleDB",
            children: [
              {
                title: "Continuous aggregate basics",
                href: "create-cagg-basics",
                tags: ['caggs', 'create', 'learn', 'timescaledb'],
                keywords: ['continuous aggregates', 'tutorial', 'TimescaleDB'],
                excerpt: "Create continuous aggregates in TimescaleDB",
              },
              {
                title: "Continuous aggregate policies and refreshing data",
                href: "create-cagg-policy",
                tags: ['caggs', 'create', 'learn', 'timescaledb'],
                keywords: ['continuous aggregates', 'tutorial', 'TimescaleDB'],
                excerpt: "Establish continuous aggregates policy in TimescaleDB",
              },
              ]
          },
          {
            title: "5. Save space with compression",
            href: "compress-data",
            tags: ['compression', 'data', 'learn', 'timescaledb'],
            keywords: ['compression', 'tutorial', 'TimescaleDB'],
            excerpt: "Use TimescaleDB's native compression to save space"
          },
          {
            title: "6. Learn about data retention",
            href: "data-retention",
            tags: ['data', 'manage', 'learn', 'timescaledb'],
            keywords: ['data', 'tutorial', 'TimescaleDB'],
            excerpt: "Create a database retention policy for your TimescaleDB instance"
          },

          {
            title: "7. Next steps",
            href: "next-steps",
            tags: ['migrate', 'visualize', 'manage', 'learn', 'timescaledb'],
            keywords: ['tutorial', 'TimescaleDB'],
            excerpt: "Learn how to migrate, visualize and connect your data to TimescaleDB"
          }
        ]
      }
]
