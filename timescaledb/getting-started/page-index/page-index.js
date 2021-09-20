module.exports = [
    {
        title: "Getting started",
        href: "getting-started",
        pageComponents: ['featured-cards'],
        children: [
          {
            title: "1. Launch your first instance",
            href: "launch-timescaledb",
            tags: ['learn', 'create', 'tsc'],
            keywords: ['tutorial', 'Timescale Forge'],
            excerpt: "Use Timescale Forge to launch your first TimescaleDB instance"
          },
          {
            title: "2. Access your database",
            href: "access-timescaledb",
            tags: ['psql', 'connect', 'learn', 'timescaledb'],
            keywords: ['psql', 'tutorial', 'TimescaleDB'],
            excerpt: "Connect to your database using psql"
          },
          {
            title: "3. Create a hypertable",
            href: "create-hypertable",
            tags: ['hypertables', 'create', 'learn', 'timescaledb'],
            keywords: ['hypertables', 'tutorial', 'TimescaleDB'],
            excerpt: "Create a hypertable in TimescaleDB"
          },
          {
            title: "4. Add time-series data",
            href: "add-data",
            tags: ['hypertables', 'data', 'ingest', 'learn', 'timescaledb'],
            keywords: ['hypertables', 'tutorial', 'TimescaleDB'],
            excerpt: "Add sample data to your TimescaleDB instance"
          },
          {
            title: "5. Query your data",
            href: "query-data",
            tags: ['data', 'query', 'learn', 'timescaledb'],
            keywords: ['tutorial', 'TimescaleDB'],
            excerpt: "Query your data using full SQL in TimescaleDB"
          },
          {
            title: "6. Create a continuous aggregate",
            href: "create-cagg",
            tags: ['caggs', 'create', 'learn', 'timescaledb'],
            keywords: ['continuous aggregates', 'tutorial', 'TimescaleDB'],
            excerpt: "Establish continuous aggregates in TimescaleDB"
          },
          {
            title: "7. Save space with compression",
            href: "compress-data",
            tags: ['compression', 'data', 'learn', 'timescaledb'],
            keywords: ['compression', 'tutorial', 'TimescaleDB'],
            excerpt: "Use TimescaleDB's native compression to save space"
          },
          {
            title: "8. Learn about data retention",
            href: "data-retention",
            tags: ['data', 'manage', 'learn', 'timescaledb'],
            keywords: ['data', 'tutorial', 'TimescaleDB'],
            excerpt: "Create a database retention policy for your TimescaleDB instance"
          },
          {
            title: "9. Next steps",
            href: "next-steps",
            tags: ['migrate', 'visualize', 'manage', 'learn', 'timescaledb'],
            keywords: ['tutorial', 'TimescaleDB'],
            excerpt: "Learn how to migrate, visualize and connect your data to TimescaleDB"
          }
        ]
      }
]
