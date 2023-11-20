module.exports = [
  {
    title: "Migrate",
    href: "migrate",
    excerpt: "Migrating your data to Timescale",
    children: [
      {
        title: "With downtime: pg_dump/restore",
        href: "pg-dump-and-restore",
        excerpt:
            "Migrate a hypertable or entire database with native PostgreSQL commands",
        children: [
          {
            title: "pg_dump/restore from TimescaleDB",
            href: "pg-dump-restore-from-timescaledb",
            excerpt:
                "Migrate from TimescaleDB using pg_dump/restore",
          },
          {
            title: "pg_dump/restore from PostgreSQL",
            href: "pg-dump-restore-from-postgres",
            excerpt:
                "Migrate from PostgreSQL using pg_dump/restore",
          },
        ]
      },
      {
        title: "With downtime: Multi-node to TimescaleDB service",
        href: "multi-node-to-timescale-service",
        excerpt:
            "Migrate an entire multi-node deployment to a TimescaleDB service",
        children: [
          {
            title: "Multi-node to TimescaleDB service",
            href: "multi-node-to-timescale-service",
            excerpt:
                "Migrate from multi-node to TimescaleDB service using COPY",
          },
        ]
      },
      {
        title: "Low-downtime: Live migration",
        href: "live-migration",
        excerpt: "Migrate a large database with low downtime",
        children: [
          {
            title: "Live migration from PostgreSQL",
            href: "live-migration-from-postgres",
            excerpt:
                "Migrate from PostgreSQL using live migration",
          },
        ],
      },
      {
        title: "Low-downtime: Dual-write and backfill",
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
        title: "Troubleshooting",
        href: "troubleshooting",
        excerpt:
            "Troubleshooting known issues in database migrations",
      },
    ],
  },
];
