module.exports = [
  {
    title: "Self-hosted Timescale",
    href: "self-hosted",
    filePath: "index.md",
    pageComponents: ["content-list"],
    excerpt:
      "Install self-hosted Timescale, administer, and configure the database.",
    children: [
      {
        title: "Install Timescale",
        href: "install",
        excerpt: "Install self-hosted Timescale",
        children: [
          {
            title: "Linux",
            href: "installation-linux",
            iconSrc: "https://assets.iobeam.com/images/docs/linux-icon.svg",
            excerpt: "Install self-hosted Timescale on Linux",
          },
          {
            title: "Windows",
            href: "installation-windows",
            iconSrc:
              "https://assets.iobeam.com/images/docs/Windows_logo_-_2012.svg",
            excerpt:
              "Install self-hosted Timescale on Microsoft Windows using a zipped .exe file",
          },
          {
            title: "MacOS",
            href: "installation-macos",
            iconSrc:
              "https://assets.iobeam.com/images/docs/Apple_logo_black.svg",
            excerpt: "Install self-hosted Timescale on MacOS using homebrew",
          },
          {
            title: "From source",
            href: "installation-source",
            iconSrc: "https://assets.iobeam.com/images/docs/source.png",
            excerpt:
              "Install self-hosted Timescale on any operating system from source",
          },
          {
            title: "Pre-built containers",
            href: "installation-docker",
            iconSrc:
              "https://s3.amazonaws.com/assets.iobeam.com/images/docs/moby.png",
            excerpt:
              "Install self-hosted Timescale with a pre-built Docker container",
          },
          {
            title: "Kubernetes",
            href: "installation-kubernetes",
            iconSrc:
              "https://s3.amazonaws.com/assets.iobeam.com/images/docs/kubernetes-icon-color.svg",
            excerpt: "Install self-hosted Timescale on Kubernetes",
          },
          {
            title: "Pre-built cloud images",
            href: "installation-cloud-image",
            iconSrc:
              "https://s3.amazonaws.com/assets.iobeam.com/images/docs/aws_logo.svg",
            excerpt:
              "Install self-hosted Timescale on Amazon with an Ubuntu AMI",
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
              "Overview of configuration options and methods for PostgreSQL and self-hosted Timescale",
          },
          {
            title: "Using timescaledb-tune",
            href: "timescaledb-tune",
            excerpt: "Configure self-hosted Timescale using timescaledb-tune",
          },
          {
            title: "Manual PostgreSQL configuration",
            href: "postgres-config",
            excerpt:
              "Configure self-hosted Timescale using the PostgreSQL configuration file",
          },
          {
            title: "Timescale configuration",
            href: "timescaledb-config",
            excerpt:
              "Configure self-hosted Timescale using Timescale configuration parameters",
          },
          {
            title: "Docker configuration",
            href: "docker-config",
            excerpt:
              "Configure self-hosted Timescale when running within a Docker container",
          },
          {
            title: "Telemetry",
            href: "telemetry",
            excerpt: "Configure telemetry gathered by self-hosted Timescale",
          },
        ],
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
            title: "Multi-node setup on self-hosted Timescale",
            href: "multinode-setup",
            excerpt: "Set up multi-node on self-hosted Timescale",
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
            excerpt: "High availability in self-hosted Timescale",
          },
          {
            title: "Configure replication",
            href: "configure-replication",
            excerpt: "Configure replication",
          },
        ],
      },
      {
        title: "Upgrade self-hosted Timescale",
        href: "upgrades",
        children: [
          {
            title: "About upgrades",
            href: "about-upgrades",
            excerpt: "Learn about upgrading self-hosted Timescale",
          },
          {
            title: "Minor upgrades",
            href: "minor-upgrade",
            excerpt: "Upgrade to a new minor version of self-hosted Timescale",
          },
          {
            title: "Major upgrades",
            href: "major-upgrade",
            excerpt: "Upgrade to a new major version of self-hosted Timescale",
          },
          {
            title: "Downgrade self-hosted Timescale",
            href: "downgrade",
            excerpt: "Downgrade a self-hosted Timescale version",
          },
          {
            title: "Upgrade within Docker",
            href: "upgrade-docker",
            excerpt:
              "Upgrade to a new minor version of self-hosted Timescale within a Docker container",
          },
          {
            title: "Upgrade PostgreSQL",
            href: "upgrade-pg",
            excerpt: "Upgrade to a new version of PostgreSQL",
          },
        ],
      },
      {
        title: "Uninstall self-hosted Timescale",
        href: "uninstall",
        excerpt: "Uninstalling self-hosted Timescale",
        children: [
          {
            title: "Uninstall self-hosted Timescale on macOS",
            href: "uninstall-timescaledb",
            excerpt: "Uninstall self-hosted Timescale on macOS",
          },
        ],
      },
      {
        title: "Troubleshooting self-hosted Timescale",
        href: "troubleshooting",
        type: "placeholder",
      },
    ],
  },
];
