module.exports = [
  {
    title: "Migrate your data to Timescale Cloud",
    href: "migrate",
    excerpt: "Migrating your data to Timescale",
    children: [
      {
        title: "Migrate with downtime",
        href: "pg-dump-and-restore",
        excerpt:
          "Migrate a hypertable or entire database with native PostgreSQL commands",
      },
      {
        title: "Live migration",
        href: "live-migration",
        excerpt: "Migrate a large database with low downtime",
      },
      {
        title: "Sigh",
        href: "sigh",
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
            title: "Dual-write from PostgreSQL",
            href: "dual-write-from-postgres",
            excerpt:
              "Migrate from PostgreSQL using dual-write and backfill",
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
