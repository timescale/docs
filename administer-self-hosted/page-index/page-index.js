module.exports = [
  {
    title: "Administer Self-hosted TimescaleDB",
    href: "administer-self-hosted",
    filePath: "index.md",
    pageComponents: ["content-list"],
    excerpt: "Managed Service for TimescaleDB",
    children: [
      {
        title: "Install TimescaleDB",
        href: "install",
        excerpt: "Install self-hosted TimescaleDB",
        children: [
          {
            title: "Docker",
            href: "installation-docker",
            iconSrc:
              "https://assets.iobeam.com/images/docs/moby.png",
            excerpt:
              "Install self-hosted TimescaleDB with a pre-built Docker container",
          },
          {
            title: "Kubernetes",
            href: "installation-kubernetes",
            iconSrc:
              "https://assets.iobeam.com/images/docs/kubernetes-icon-color.svg",
            excerpt: "Install self-hosted TimescaleDB on Kubernetes",
          },
          {
            title: "Linux",
            href: "installation-linux",
            iconSrc: "https://assets.iobeam.com/images/docs/linux-icon.svg",
            excerpt: "Install self-hosted TimescaleDB on Linux",
          },
          {
            title: "MacOS",
            href: "installation-macos",
            iconSrc:
              "https://assets.iobeam.com/images/docs/Apple_logo_black.svg",
            excerpt: "Install self-hosted TimescaleDB on MacOS using homebrew",
          },
          {
            title: "Source",
            href: "installation-source",
            iconSrc: "https://assets.iobeam.com/images/docs/source.png",
            excerpt:
              "Install self-hosted TimescaleDB on any operating system from source",
          },
          {
            title: "Windows",
            href: "installation-windows",
            iconSrc:
              "https://assets.iobeam.com/images/docs/Windows_logo_-_2012.svg",
            excerpt:
              "Install self-hosted TimescaleDB on Microsoft Windows using a zipped .exe file",
          },
        ],
      },
      {
        title: "Configuration",
        href: "configuration",
        children: [
          {
            title: "About Configuration",
            href: "about-configuration",
            excerpt:
              "Overview of configuration options and methods for PostgreSQL and self-hosted TimescaleDB",
          },
          {
            title: "Using timescaledb-tune",
            href: "timescaledb-tune",
            excerpt: "Configure self-hosted TimescaleDB using timescaledb-tune",
          },
          {
            title: "Manual PostgreSQL configuration",
            href: "postgres-config",
            excerpt:
              "Configure self-hosted TimescaleDB using the PostgreSQL configuration file",
          },
          {
            title: "TimescaleDB configuration",
            href: "timescaledb-config",
            excerpt:
              "Configure self-hosted TimescaleDB using TimescaleDB configuration parameters",
          },
          {
            title: "Docker configuration",
            href: "docker-config",
            excerpt:
              "Configure self-hosted TimescaleDB when running within a Docker container",
          },
          {
            title: "Telemetry",
            href: "telemetry",
            excerpt: "Configure telemetry gathered by self-hosted TimescaleDB",
          },
        ],
      },
      {
        title: "Backup and restore",
        href: "backup-and-restore",
        children: [
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
        ],
      },
      {
        title: "Migrate to self-hosted TimescaleDB",
        href: "migration",
        children: [
          {
            title: "Migrate entire database",
            href: "entire-database",
            excerpt: "Migrate an entire Timescale database to self-hosted Timescale in one go",
          },
          {
            title: "Migrate schema then data",
            href: "schema-then-data",
            excerpt: "Migrate your Timescale data and schema to self-hosted TimescaleDB",
          },
          {
            title: "Migrate tables from the same database",
            href: "same-db",
            excerpt: "Migrate data into a Timescale hypertable from a regular PostgreSQL table",
          },
          {
            title: "Migrate data to Timescale from InfluxDB",
            href: "migrate-influxdb",
            excerpt: "Migrate data into Timescale using the Outflux tool",
          },
        ],
      },
      {
        title: "Manage storage using tablespaces",
        href: "manage-storage",
        excerpt: "Manage storage by moving data between tablespaces",
      },
      {
        title: "Replication and High Availability",
        href: "replication-and-ha",
        children: [
          {
            title: "About high availability",
            href: "about-ha",
            excerpt: "High availability in self-hosted TimescaleDB",
          },
          {
            title: "Configure replication",
            href: "configure-replication",
            excerpt: "Configure replication",
          },
        ],
      },
      {
        title: "Additional tooling",
        href: "tooling",
        children: [
          {
            title: "TimescaleDB Tune",
            href: "about-timescaledb-tune",
          },
          {
            title: "Install and update Timescale Toolkit",
            href: "install-toolkit",
            excerpt: "Install and update the Timescale Toolkit",
          },
        ],
      },
      {
        title: "Upgrade self-hosted TimescaleDB",
        href: "upgrades",
        children: [
          {
            title: "About upgrades",
            href: "about-upgrades",
            excerpt: "Learn about upgrading self-hosted TimescaleDB",
          },
          {
            title: "Minor upgrades",
            href: "minor-upgrade",
            excerpt:
              "Upgrade to a new minor version of self-hosted TimescaleDB",
          },
          {
            title: "Major upgrades",
            href: "major-upgrade",
            excerpt:
              "Upgrade to a new major version of self-hosted TimescaleDB",
          },
          {
            title: "Downgrade self-hosted TimescaleDB",
            href: "downgrade",
            excerpt: "Downgrade a self-hosted TimescaleDB version",
          },
          {
            title: "Upgrade within Docker",
            href: "upgrade-docker",
            excerpt:
              "Upgrade to a new minor version of self-hosted TimescaleDB within a Docker container",
          },
          {
            title: "Upgrade PostgreSQL",
            href: "upgrade-pg",
            excerpt: "Upgrade to a new version of PostgreSQL",
          },
        ],
      },
      {
        title: "Uninstall self-hosted TimescaleDB",
        href: "uninstall",
        excerpt: "Uninstalling self-hosted TimescaleDB",
        children: [
          {
            title: "Uninstall self-hosted TimescaleDB on macOS",
            href: "uninstall-timescaledb",
            excerpt: "Uninstall self-hosted TimescaleDB on macOS",
          },
        ],
      },
      {
        title: "Troubleshooting self-hosted TimescaleDB",
        href: "troubleshooting",
        type: "placeholder",
      },
    ],
  },
];
