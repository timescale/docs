module.exports = [
  {
    title: "Import and connect",
    href: "migrate",
    excerpt: "Import, ingest, migrate data, and connect to Tiger Cloud",
    children: [
      {
        title: "Connect a Postgres data source",
        href: "livesync-for-postgresql",
        excerpt: "Synchronize updates to a primary Postgres database instance with a Tiger Cloud service in real time",
      },
      {
        title: "Connect an S3 data source",
        href: "livesync-for-s3",
        excerpt: "Synchronize data from S3 with a Tiger Cloud service in real time",
      },
      {
        title: "Import data using Console",
        href: "import-data-using-console",
        excerpt: "Import data into a Tiger Cloud service using Console",
      },
      {
        title: "Import data using the terminal",
        href: "import-data-using-terminal",
        excerpt: "Import data into a Tiger Cloud service using the terminal",
      },
      {
        title: "Migrate with downtime",
        href: "pg-dump-and-restore",
        excerpt: "Migrate a hypertable or entire database with native Postgres commands",
      },
      {
        title: "Live migration",
        href: "live-migration",
        excerpt: "Migrate a large database with low downtime",
      },
      {
        title: "Dual-write and backfill",
        href: "dual-write-and-backfill",
        excerpt: "Migrate a large database with low downtime",
        children: [
          {
            title: "Dual-write from TimescaleDB",
            href: "dual-write-from-timescaledb",
            excerpt:
              "Migrate from TimescaleDB using dual-write and backfill",
          },
          {
            title: "Dual-write from Postgres",
            href: "dual-write-from-postgres",
            excerpt:
              "Migrate from Postgres using dual-write and backfill",
          },
          {
            title: "Dual-write from other databases",
            href: "dual-write-from-other",
            excerpt:
              "Migrate from other databases using dual-write and backfill",
          },
          {
            title: "timescaledb-backfill",
            href: "timescaledb-backfill",
            excerpt:
              "A tool for backfilling data as part of data migration",
          },

        ],
      },
      {
        title: "Ingest metrics with Telegraf",
        href: "ingest-telegraf",
        excerpt: "Ingest metrics into a Tiger Cloud service using the Telegraf plugin",
      },
      {
        title: "FAQ and troubleshooting",
        href: "troubleshooting",
        excerpt:
          "Troubleshooting known issues in data import and connection",
      },
    ],
  }
];
