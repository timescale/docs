module.exports = [
  {
    title: "Migrate and sync data to Tiger Cloud",
    href: "migrate",
    excerpt: "Migrating your data to Tiger Cloud",
    children: [
      {
        title: "Migrate with downtime",
        href: "pg-dump-and-restore",
        excerpt:
          "Migrate a hypertable or entire database with native Postgres commands",
      },
      {
        title: "Live migration",
        href: "live-migration",
        excerpt: "Migrate a large database with low downtime",
      },
      {
        title: "Livesync from Postgres",
        href: "livesync-for-postgresql",
        excerpt: "Synchronize updates to a primary postgres database instance to Tiger Cloud service in real-time",
      },
      {
        title: "Livesync from S3",
        href: "livesync-for-s3",
        excerpt: "Synchronize data from S3 to a Tiger Cloud service in real time",
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
        title: "FAQ and troubleshooting",
        href: "troubleshooting",
        excerpt:
          "Troubleshooting known issues in database migrations",
      },
    ],
  }
];
