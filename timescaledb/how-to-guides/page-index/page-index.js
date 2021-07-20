module.exports = [
    {
    title: "How-to Guides",
    href: "how-to-guides",
    pageComponents: ['content-list'],
    children: [
      {
        title: "Install TimescaleDB",
        href: "install-timescaledb",
        pageComponents: ['featured-cards'],
        tags: ['timescaledb', 'install'],
        keywords: ['install', 'TimescaleDB'],
        excerpt: ['Install TimescaleDB'],
        children: [
          {
            title: "Timescale Forge",
            href: "installation-forge",
            tags: ['tsc', 'install'],
            keywords: ['install', 'Timescale Cloud'],
            excerpt: ['Install Timescale Forge']
          },
          {
            title: "Timescale Cloud",
            href: "installation-cloud",
            tags: ['mst', 'install'],
            keywords: ['install', 'Managed Service for TimescaleDB'],
            excerpt: ['Install Timescale Cloud']
          },
          {
            title: "Self hosted (including containers)",
            href: "self-hosted",
            type: 'react-page',
            options: { pg_version: ["12", "11"] },
            component: "InstallationPage",
            showNewsletterForm: true,
            tags: ['install', 'timescaledb'],
            keywords: ['TimescaleDB', 'install', 'self-hosted'],
            excerpt: ['Install self-hosted TimescaleDB'],
            children: [
              {
                title: "Docker",
                type: 'redirect-to-child-page',
                href: "docker",
                iconSrc: "//assets.iobeam.com/images/docs/moby.png",
                children: [
                  {
                    title: "Docker",
                    type: 'non-menu-page',
                    href: "installation-docker",
                    tags: ['install', 'docker', 'timescaledb'],
                    keywords: ['TimescaleDB', 'install', 'self-hosted', 'Docker'],
                    excerpt: ['Install self-hosted TimescaleDB with Docker']
                  },
                ],
              },
              {
                title: "Ubuntu",
                type: 'redirect-to-child-page',
                href: "ubuntu",
                iconSrc: "//assets.iobeam.com/images/docs/cof_orange_hex.svg",
                children: [
                  {
                    title: "apt",
                    type: 'non-menu-page',
                    href: "installation-apt-ubuntu",
                    tags: ['install', 'ubuntu', 'apt', 'timescaledb'],
                    keywords: ['TimescaleDB', 'install', 'self-hosted', 'Ubuntu'],
                    excerpt: ['Install self-hosted TimescaleDB on Ubuntu using apt']
                  },
                  {
                    title: "Source (Ubuntu)",
                    type: 'non-menu-page',
                    href: "installation-source",
                  },
                ],
              },
              {
                title: "Debian",
                type: 'redirect-to-child-page',
                href: "debian",
                iconSrc: "//assets.iobeam.com/images/docs/Debian_logo.svg",
                children: [
                  {
                    title: "apt (Debian)",
                    type: 'non-menu-page',
                    href: "installation-apt-debian",
                    tags: ['install', 'debian', 'apt', 'timescaledb'],
                    keywords: ['TimescaleDB', 'install', 'self-hosted', 'Debian'],
                    excerpt: ['Install self-hosted TimescaleDB on Debian using apt']
                  },
                  {
                    title: "Source (Debian)",
                    type: 'non-menu-page',
                    href: "installation-source",
                    tags: ['install', 'debian', 'source', 'timescaledb'],
                    keywords: ['TimescaleDB', 'install', 'self-hosted', 'Debian'],
                    excerpt: ['Install self-hosted TimescaleDB on Debian from source']
                  },
                ],
              },
              {
                title: "RHEL/CentOS",
                type: 'redirect-to-child-page',
                href: "rhel-centos",
                iconSrc: "//assets.iobeam.com/images/docs/Centos_Red_Hat_logo.svg",
                children: [
                  {
                    title: "yum/dnf",
                    type: 'non-menu-page',
                    href: "installation-yum",
                    tags: ['install', 'rhel', 'centos', 'yum', 'timescaledb'],
                    keywords: ['TimescaleDB', 'install', 'self-hosted', 'RHEL', 'CentOS'],
                    excerpt: ['Install self-hosted TimescaleDB on Red Hat or CentOS using yum or dnf']
                  },
                  {
                    title: "Source (Red Hat or CentOS)",
                    type: 'non-menu-page',
                    href: "installation-source",
                    tags: ['install', 'rhel', 'centos', 'source', 'timescaledb'],
                    keywords: ['TimescaleDB', 'install', 'self-hosted', 'RHEL', 'CentOS'],
                    excerpt: ['Install self-hosted TimescaleDB on Red Hat or CentOS from source']
                  },
                ],
              },
              {
                title: "Windows",
                type: 'redirect-to-child-page',
                href: "windows",
                iconSrc: "//assets.iobeam.com/images/docs/Windows_logo_-_2012.svg",
                children: [
                  {
                    title: "Installer (.zip)",
                    type: 'non-menu-page',
                    href: "installation-windows",
                    tags: ['install', 'mswin', 'exe', 'timescaledb'],
                    keywords: ['TimescaleDB', 'install', 'self-hosted', 'MS Windows',],
                    excerpt: ['Install self-hosted TimescaleDB on Microsoft Windows using a zipped .exe file']
                  },
                  {
                    title: "Source (Windows)",
                    type: 'non-menu-page',
                    href: "installation-source-windows",
                    tags: ['install', 'mswin', 'exe', 'source', 'timescaledb'],
                    keywords: ['TimescaleDB', 'install', 'self-hosted', 'MS Windows'],
                    excerpt: ['Install self-hosted TimescaleDB on Microsoft Windows from source']
                  },
                ],
              },
              {
                title: "AMI",
                type: 'redirect-to-child-page',
                href: "ami",
                iconSrc: "//assets.iobeam.com/images/docs/aws_logo.svg",
                children: [
                  {
                    title: "Amazon AMI (Ubuntu)",
                    type: 'non-menu-page',
                    href: "installation-ubuntu-ami",
                    tags: ['install', 'aws', 'ami', 'ubuntu', 'Timescaledb'],
                    keywords: ['TimescaleDB', 'install', 'self-hosted', 'AWS', 'AMI', 'Ubuntu'],
                    excerpt: ['Install self-hosted TimescaleDB on Amazon with an Ubuntu AMI']
                  },
                ],
              },
              {
                title: "MacOS",
                type: 'redirect-to-child-page',
                href: "macos",
                iconSrc: "//assets.iobeam.com/images/docs/Apple_logo_black.svg",
                children: [
                  {
                    title: "Homebrew",
                    type: 'non-menu-page',
                    href: "installation-homebrew",
                    tags: ['install', 'macos', 'homebrew', 'timescaledb'],
                    keywords: ['timescaledb', 'install', 'self-hosted', 'MacOS', 'homebrew'],
                    excerpt: ['Install self-hosted TimescaleDB on MacOS using homebrew']
                  },
                  {
                    title: "Source (MacOS)",
                    type: 'non-menu-page',
                    href: "installation-source",
                    tags: ['install', 'macos', 'source', 'timescaledb'],
                    keywords: ['TimescaleDB', 'install', 'self-hosted', 'MacOS'],
                    excerpt: ['Install self-hosted TimescaleDB on MacOS from source']
                  },
                ],
              }
            ],
          },
          {
            title: "Post-install setup",
            href: "post-install-setup",
            tags: ['install', 'setup', 'selfhosted', 'timescaledb'],
            keywords: ['TimescaleDB', 'install', 'setup', 'self-hosted'],
            excerpt: ['Set up self-hosted TimescaleDB after installation']
          }
        ]
      },
      {
        title: "Install TimescaleDB Toolkit",
        href: "install-timescaledb-toolkit",
        tags: ['toolkit', 'install', 'timescaledb'],
        keywords: ['TimescaleDB', 'install', 'toolkit'],
        excerpt: ['Install the TimescaleDB toolkit']
      },
      {
        title: "Connecting to TimescaleDB",
        href: "connecting",
        tags: ['toolkit', 'install', 'timescaledb'],
        keywords: ['TimescaleDB', 'install', 'toolkit'],
        excerpt: ['Install the TimescaleDB toolkit'],
          children: [
              {
                  href: "psql",
              }
          ]
      },
      {
        href: "hypertables",
        children: [
          {
            title: "CREATE",
            href: "create",
          },
          {
            title: "ALTER",
            href: "alter",
          },
          {
            title: "DROP",
            href: "drop",
          },
          {
            href: "best-practices",
            metaTags: [
              {
                name: "product",
                content: "timescaledb"
              },
              {
                name: "action",
                content: ["configure", "manage"]
              },
              {
                name: "feature",
                content: "hypertables"
              }
            ],
          }
        ]
      },
      {
        href: "distributed-hypertables",
        children: [
          {
            title: "CREATE",
            href: "create"
          },
          {
            title: "INSERT",
            href: "insert"
          },
          {
            title: "SELECT",
            href: "select"
          },
          {
            href: "manage-data-nodes"
          },
          {
            href: "enable-native-replication"
          },
          {
            title: "ALTER",
            href: "alter"
          },
          {
            title: "DROP",
            href: "drop"
          },
          {
            href: "best-practices"
          }
        ]
      },
      {
        href: "write-data",
        children: [
          {
            title: "INSERT",
            href: "insert"
          },
          {
            title: "UPDATE",
            href: "update"
          },
          {
            title: "UPSERT",
            href: "upsert"
          },
          {
            title: "DELETE",
            href: "delete"
          }
        ]
      },
      {
        href: "query-data",
        children: [
          {
            title: "SELECT",
            href: "select"
          },
          {
            title: "Advanced analytic queries",
            href: "advanced-analytic-queries"
          }
        ]
      },
      {
        title: "Multi-node setup",
        href: "multi-node-setup",
        children: [
          {
            href: "required-configuration"
          },
          {
            title: "Enable node communication",
            href: "node-communication"
          },
          {
            href: "maintenance-tasks"
          }
        ]
      },
      {
        href: "continuous-aggregates",
        children: [
          {
            title: "About continuous aggregates",
            href: "about-continuous-aggregates"
          },
          {
            title: "Create a continuous aggregate",
            href: "create-a-continuous-aggregate"
          },
          {
            title: "Refresh policies for continuous aggregates",
            href: "refresh-policies"
          },
          {
            title:"Time in continuous aggregates",
            href: "time"
          },
          {
            title: "Drop data from continuous aggregates",
            href: "drop-data"
          },
          {
            title: "Manage materialized hypertables",
            href: "materialized-hypertables"
          },
          {
            title: "Real time aggregates",
            href: "real-time-aggregates"
          },
          {
            title: "Troubleshoot continuous aggregates",
            href: "troubleshooting"
          }
        ]
      },
      {
        href: "compression",
        children: [
          {
            title: "Compression",
            href: "compression"
          },
          {
            title: "Manually compress chunks",
            href: "manually-compress-chunks"
          },
          {
            title: "Decompress chunks",
            href: "decompress-chunks"
          },
          {
            title: "Backfill historical data",
            href: "backfill-historical-data"
          },
          {
            title: "Modify a schema",
            href: "modify-a-schema"
          }
        ]
      },
      {
        title: "User-defined actions",
        href: "user-defined-actions",
        children: [
          {
            title: "Create and register",
            href: "create-and-register"
          },
          {
            title: "Test and debug",
            href: "test-and-debug"
          },
          {
            title: "Altering and deleting",
            href: "alter-and-delete"
          },
          {
            title: "Example of generic retention",
            href: "example-generic-retention"
          },
          {
            title: "Example of tiered storage",
            href: "example-tiered-storage"
          },
          {
            title: "Example of downsample and compress",
            href: "example-downsample-and-compress"
          }
        ]
      },
      {
        href: "data-retention",
        children: [
          {
            title: "Create a retention policy",
            href: "create-a-retention-policy"
          },
          {
            title: "Manually drop chunks",
            href: "manually-drop-chunks"
          },
          {
            title: "Data retention with continuous aggregates",
            href: "data-retention-with-continuous-aggregates"
          }
        ]
      },
      {
        title: "Data Tiering",
        href: "data-tiering",
        children: [
          {
            title: "Move data",
            href: "move-data"
          }
        ]
      },
      {
        title: "Replication and HA",
        href: "replication-and-ha",
        children: [
          {
            href: "replication"
          }
        ]
      },
      {
        title: "Backup and restore",
        href: "backup-and-restore",
        children: [
          {
            title: "The timescaledb-backup tool",
            href: "timescaledb-backup"
          },
          {
            title: "Using pg_dump/pg_restore",
            href: "pg-dump-and-restore"
          },
          {
            title: "Docker & WAL-E",
            href: "docker-and-wale"
          },
          {
            title: "Physical backups",
            href: "physical"
          }
        ]
      },
      {
        title: "Schema management",
        href: "schema-management",
        children: [
          {
            title: "ALTER hypertables",
            href: "alter"
          },
          {
            href: "indexing"
          },
          {
            href: "triggers"
          },
          {
            href: "constraints"
          },
          {
            title: "JSON",
            href: "json"
          },
          {
            href: "tablespaces"
          }
        ]
      },
      {
        title: "Migrate existing data",
        href: "migrate-data",
        children: [
          {
            title: "Migrate from the same database",
            href: "same-db"
          },
          {
            title: "Migrate from a different database",
            href: "different-db"
          },
          {
            title: "Import from CSV",
            href: "import-csv"
          },
          {
            title: "Migrate InfluxDB data",
            href: "migrate-influxdb"
          }
        ]
      },
      {
        title: "Update TimescaleDB",
        href: "update-timescaledb",
        children: [
          {
            title: "Update from TimescaleDB 1.x to 2.x",
            href: "update-timescaledb-2"
          },
          {
            href: "updating-docker"
          },
          {
            title: "Upgrade PostgreSQL",
            href: "upgrade-postgresql"
          }
        ]
      },
      {
        href: "configuration",
        children: [
          {
            title: "Using timescaledb-tune",
            href: "timescaledb-tune"
          },
          {
            title: "Manual PostgreSQL configuration",
            href: "postgres-config"
          },
          {
            title: "TimescaleDB configuration",
            href: "timescaledb-config"
          },
          {
            title: "Docker configuration",
            href: "docker-config"
          },
          {
            href: "telemetry"
          }
        ]
      },

      {
        href: "alerting"
      },
      {
        title: "Ingest data from other sources",
        href: "ingest-data"
      },
      {
        title: "Troubleshoot TimescaleDB",
        href: "troubleshoot-timescaledb"
      },
      {
        title: "Additional tooling",
        href: "tooling"
      }
    ]
  }
]
