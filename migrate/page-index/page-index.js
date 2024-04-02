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
          {
            title: "Live migration from TimescaleDB",
            href: "live-migration-from-timescaledb",
            excerpt:
                "Migrate from TimescaleDB using live migration",
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
        title: "Playbooks",
        href: "playbooks",
        excerpt: "Step-by-step migration playbook to Timescale",
        children: [
          {
            title: "From AWS RDS using pg_dump",
            href: "rds-timescale-pg-dump",
            excerpt:
                "Migrate from RDS to Timescale using pg_dump",
          },
          {
            title: "From AWS RDS using live migration",
            href: "rds-timescale-live-migration",
            excerpt:
                "Migrate from RDS to Timescale using live migration",
          },
          {
            title: "Multi-node to Timescale",
            href: "multi-node-to-timescale-service",
            excerpt:
                "Migrate an entire multi-node deployment to Timescale",
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
