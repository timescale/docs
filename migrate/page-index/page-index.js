module.exports = [
  {
    title: "Import and sync",
    href: "migrate",
    excerpt: "Import, ingest, migrate data, and connect to Tiger",
    children: [
      {
        title: "Sync from Postgres",
        href: "livesync-for-postgresql",
        excerpt: "Synchronize updates to a primary Postgres database instance with a Tiger service in real time",
      },
      {
        title: "Sync from S3",
        href: "livesync-for-s3",
        excerpt: "Synchronize data from S3 with a Tiger service in real time",
      },
      {
        title: "Stream from Kafka",
        href: "livesync-for-kafka",
        excerpt: "Stream events from Kafka into your Tiger service",
      },
      {
        title: "Upload a file using Console",
        href: "upload-file-using-console",
        excerpt: "Upload files into a Tiger service using Console",
      },
      {
        title: "Upload a file using the terminal",
        href: "upload-file-using-terminal",
        excerpt: "Upload files into a Tiger service using the terminal",
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
                excerpt: "Migrate from TimescaleDB using dual-write and backfill",
              },
              {
                title: "Dual-write from Postgres",
                href: "dual-write-from-postgres",
                excerpt: "Migrate from Postgres using dual-write and backfill",
              },
              {
                title: "Dual-write from other databases",
                href: "dual-write-from-other",
                excerpt: "Migrate from other databases using dual-write and backfill",
              },
              {
                title: "timescaledb-backfill",
                href: "timescaledb-backfill",
                excerpt: "A tool for backfilling data as part of data migration",
              },
          ],
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
