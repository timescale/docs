module.exports = [
  {
    title: "Self-hosted",
    filePath: "index.md",
    href: "self-hosted",
    excerpt: "Self-hosted TimescaleDB",
    children: [
      {
        href: "configuration",
        children: [
          {
            title: "About Configuration",
            href: "about-configuration",
            excerpt:
              "Overview of configuration options and methods for PostgreSQL and TimescaleDB",
          },
          {
            title: "Using timescaledb-tune",
            href: "timescaledb-tune",
            excerpt: "Configure TimescaleDB using timescaledb-tune",
          },
          {
            title: "Manual PostgreSQL configuration",
            href: "postgres-config",
            excerpt:
              "Configure TimescaleDB using the PostgreSQL configuration file",
          },
          {
            title: "TimescaleDB configuration",
            href: "timescaledb-config",
            excerpt:
              "Configure TimescaleDB using TimescaleDB configuration parameters",
          },
          {
            title: "Docker configuration",
            href: "docker-config",
            excerpt:
              "Configure TimescaleDB when running within a Docker container",
          },
          {
            title: "Telemetry",
            href: "telemetry",
            excerpt: "Configure telemetry gathered by TimescaleDB",
          },
          {
            title: "Troubleshooting",
            href: "troubleshooting",
            type: "placeholder",
          },
        ],
      },
      {
        title: "Scaling",
        href: "scaling",
      },
      {
        title: "Backup and restore",
        href: "backup-and-restore",
        children: [
          {
            title: "Using pg_dump/pg_restore",
            href: "pg-dump-and-restore",
            excerpt: "Backing up and restoring with the pg_dump and pg_restore",
          },
          {
            title: "Docker & WAL-E",
            href: "docker-and-wale",
            excerpt: "Backing up and restoring with Docker and WAL-E",
          },
          {
            title: "Physical backups",
            href: "physical",
            excerpt: "Backing up and restoring with physical backups",
          },
          {
            title: "Troubleshooting",
            href: "troubleshooting",
            type: "placeholder",
            excerpt: "Troubleshoot problems with backing up TimescaleDB",
          },
        ],
      },
      {
        title: "Upgrade TimescaleDB",
        href: "upgrades",
        children: [
          {
            title: "About upgrades",
            href: "about-upgrades",
            excerpt: "Learn about upgrading TimescaleDB",
          },
          {
            title: "Minor upgrades",
            href: "minor-upgrade",
            excerpt: "Upgrade to a new minor version of TimescaleDB",
          },
          {
            title: "Major upgrades",
            href: "major-upgrade",
            excerpt: "Upgrade to a new major version of TimescaleDB",
          },
          {
            title: "Downgrade TimescaleDB",
            href: "downgrade",
            excerpt: "Downgrade a TimescaleDB version",
          },
          {
            title: "Upgrade within Docker",
            href: "upgrade-docker",
            excerpt:
              "Upgrade to a new minor version of TimescaleDB within a Docker container",
          },
          {
            title: "Upgrade PostgreSQL",
            href: "upgrade-pg",
            excerpt: "Upgrade to a new version of PostgreSQL",
          },
          {
            title: "Troubleshooting upgrades",
            href: "troubleshooting",
            type: "placeholder",
            excerpt: "Troubleshoot upgrading your TimescaleDB installation",
          },
        ],
      },
      {
        title: "Multi-node",
        href: "multinode-timescaledb",
        children: [
          {
            title: "About multi-node",
            href: "about-multinode",
            excerpt: "Learn about multi-node environments",
          },
          {
            title: "Multi-node setup on TimescaleDB",
            href: "multinode-setup",
            excerpt: "Set up multi-node on self-hosted TimescaleDB",
          },
          {
            title: "Multi-node authentication",
            href: "multinode-auth",
            excerpt: "Set up multi-node authentication",
          },
          {
            title: "Configure multi-node",
            href: "multinode-config",
            excerpt: "Configure a multi-node environment",
          },
          {
            title: "Multi-node administration",
            href: "multinode-administration",
            excerpt: "Administer a multi-node cluster",
          },
          {
            title: "Grow and shrink a multi-node cluster",
            href: "multinode-grow-shrink",
            excerpt: "Grow and shrink a multi-node cluster",
          },
          {
            title: "High availability multi-node",
            href: "multinode-ha",
            excerpt: "Highly available multi-node environments",
          },
          {
            title: "Multi-node maintenance",
            href: "multinode-maintenance",
            excerpt: "Maintain a multi-node environment",
          },
        ],
      },
      {
        title: "Replication and High Availability",
        href: "replication-and-ha",
        children: [
          {
            title: "About high availability",
            href: "about-ha",
            excerpt: "High availability in TimescaleDB",
          },
          {
            title: "Configure replication",
            href: "configure-replication",
            excerpt: "Configure replication",
          },
        ],
      },
      {
        title: "TimescaleDB on Kubernetes",
        href: "timescale-kubernetes",
      },
      {
        title: "Additional tooling",
        href: "tooling",
        excerpt: "Additional tooling for managing TimescaleDB",
        children: [
          {
            title: "About timescaledb-tune",
            href: "about-timescaledb-tune",
            excerpt:
              "Automatically configure your TimescaleDB instance with `timescaledb-tune`",
          },
        ],
      },
      {
        title: "Uninstall TimescaleDB",
        href: "uninstall",
        excerpt: "Uninstalling TimescaleDB",
        children: [
          {
            title: "Uninstall TimescaleDB on macOS",
            href: "uninstall-timescaledb",
            excerpt: "Uninstall TimescaleDB on macOS",
          },
        ],
      },
      {
        title: "Troubleshoot TimescaleDB",
        href: "troubleshoot-timescaledb",
        excerpt: "Troubleshooting TimescaleDB",
      },
    ],
  },
];
