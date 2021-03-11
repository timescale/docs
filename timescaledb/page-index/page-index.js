module.exports = [
  {
    title: "TimescaleDB",
    href: "timescaledb",
    name: 'TimescaleDB',
    excerpt: 'All you need to know about TimescaleDB architecture, concepts, setup, how-to\'s, tutorials and management',
    children: [
      {
        title: "Overview",
        href: "overview",
        children: [
          {
            title: "What is time-series data?",
            href: "what-is-time-series-data"
          },
          {
            title: "Core Concepts",
            href: "core-concepts",
            children : [
              {
                title: "Hypertables & Chunks",
                href: "hypertables-and-chunks"
              },
              {
                title: "Scaling",
                href: "scaling"
              },
              {
                href: "distributed-hypertables"
              },
              {
                href: "compression"
              },
              {
                href: "continuous-aggregates"
              },
              {
                href: "data-retention"
              },
              {
                href: "user-defined-actions"
              },
              {
                title: "Backup & Restore",
                href: "backup-restore"
              }
            ]
          },
          {
            title: "Deployment Options",
            href: "deployment-options"
          },
          {
            title: "Data model flexibility",
            href: "data-model-flexibility",
            children: [
              {
                href: "wide-data-model"
              },
              {
                href: "narrow-data-model"
              },
              {
                title: "Relational + Time-series",
                href: "relational-timeseries"
              },
              {
                title: "Geospatial Compatible",
                href: "geospatial"
              }
            ]
          },
          {
            title: "How does it compare?",
            href: "how-does-it-compare",
            children: [
              {
                title: "PostgreSQL",
                href: "timescaledb-vs-postgres"
              },
              {
                title: "NoSQL",
                href: "timescaledb-vs-nosql"
              },
            ]
          },
          {
            href: "release-notes"
          },
          {
            href: "limitations"
          },
          {
            title: "FAQ",
            href: "faq"
          }
        ]
      },
      {
        title: "Getting Started",
        href: "getting-started",
        children: [
          {
            title: "Launch your first instance",
            href: "launch-timescaledb",
            children: [
              {
                href: 'temporary'
              }
            ]
          },
          {
            title: "Access your database",
            href: "access-timescaledb",
            children: [
              {
                href: "install-psql"
              },
              {
                title: "Connect with IDEs",
                href: "connect-with-ide",
                type: 'directory',
                children: [
                  {
                    title: "pgAdmin",
                    href: "pgadmin"
                  },
                  {
                    title: "DBeaver",
                    href: "dbeaver"
                  },
                  {
                    href: "azure-data-studio"
                  }
                ]
              }
            ]
          },
          {
            title: "Add time-series data",
            href: "add-data"
          },
          {
            title: "Create a Continuous Aggregate",
            href: "create-cagg"
          },
          {
            title: "Save space with Compression",
            href: "compress-data"
          },
          {
            title: "Learn about Data Retention",
            href: "learn-data-retention"
          },
          {
            href: "analyze-your-data"
          },
          {
            href: "next-steps"
          }
        ]
      },
      {
        title: "How-to Guides",
        href: "how-to-guides",
        children: [
          {
            title: "Install TimescaleDB",
            href: "install-timescaledb",
            children: [
                  {
                    href: "timescale-cloud"
                  },
                  {
                    title: "Self hosted (including containers)",
                    href: "self-hosted",
                    type: 'react-page',
                    options: { pg_version: ["12", "11"] },
                    component: "InstallationPage",
                    showNewsletterForm: true,
                    children: [
                     {
                        Title: "Docker",
                        type: 'directory',
                        href: "docker",
                        src: "//assets.iobeam.com/images/docs/moby.png",
                        children: [
                          {
                            Title: "Docker",
                            type: 'non-menu-page',
                            href: "installation-docker",
                          },
                        ],
                      },
                      {
                        Title: "Ubuntu",
                        type: 'directory',
                        href: "ubuntu",
                        src: "//assets.iobeam.com/images/docs/cof_orange_hex.svg",
                        children: [
                          {
                            Title: "apt",
                            type: 'non-menu-page',
                            href: "installation-apt-ubuntu",
                          },
                          {
                            Title: "Source",
                            type: 'non-menu-page',
                            href: "installation-source",
                          },
                        ],
                      },
                      {
                        Title: "Debian",
                        type: 'directory',
                        href: "debian",
                        src: "//assets.iobeam.com/images/docs/Debian_logo.svg",
                        children: [
                          {
                            Title: "apt",
                            type: 'non-menu-page',
                            href: "installation-apt-debian",
                          },
                          {
                            Title: "Source",
                            type: 'non-menu-page',
                            href: "installation-source",
                          },
                        ],
                      },
                      {
                        Title: "RHEL/CentOS",
                        type: 'directory',
                        href: "rhel-centos",
                        src: "//assets.iobeam.com/images/docs/Centos_Red_Hat_logo.svg",
                        children: [
                          {
                            Title: "yum/dnf",
                            type: 'non-menu-page',
                            href: "installation-yum",
                          },
                          {
                            Title: "Source",
                            type: 'non-menu-page',
                            href: "installation-source",
                          },
                        ],
                      },
                      {
                        Title: "Windows",
                        type: 'directory',
                        href: "windows",
                        src: "//assets.iobeam.com/images/docs/Windows_logo_-_2012.svg",
                        children: [
                          {
                            Title: "Installer (.zip)",
                            type: 'non-menu-page',
                            href: "installation-windows",
                          },
                          {
                            Title: "Source",
                            type: 'non-menu-page',
                            href: "installation-source-windows",
                          },
                        ],
                      },
                      {
                        Title: "AMI",
                        type: 'directory',
                        href: "ami",
                        src: "//assets.iobeam.com/images/docs/aws_logo.svg",
                        children: [
                          {
                            Title: "Amazon AMI (Ubuntu)",
                            type: 'non-menu-page',
                            href: "installation-ubuntu-ami",
                          },
                        ],
                      },
                      {
                        Title: "MacOS",
                        type: 'directory',
                        href: "macos",
                        src: "//assets.iobeam.com/images/docs/Apple_logo_black.svg",
                        children: [
                          {
                            Title: "Homebrew",
                            type: 'non-menu-page',
                            href: "installation-homebrew",
                          },
                          {
                            Title: "Source",
                            type: 'non-menu-page',
                            href: "installation-source",
                          },
                        ],
                      }
                    ],
                  }
                ]

          },
          {
            href: "hypertables",
            children: [
              {
                title: "CREATE",
                href: "create"
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
              },
              {
                href: "batching-for-better-performance"
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
                href: "advanced-analytic-queries"
              }
            ]
          },
          {
            href: "multi-node-setup",
            children: [
              {
                href: "required-configuration"
              },
              {
                href: "setup-trust-authentication"
              },
              {
                href: "setup-password-authentication"
              },
              {
                href: "setup-certificate-authentication"
              }
            ]
          },
          {
            href: "continuous-aggregates",
            children: [
              {
                href: "create-a-continuous-aggregate"
              },
              {
                href: "adding-automatic-refresh-policies"
              },
              {
                href: "query-a-continuous-aggregate"
              },
              {
                href: "manually-refresh-specific-ranges"
              },
              {
                href: "best-practices"
              },
              {
                title:"Using integer-based time",
                href: "integer-based-time"
              },
              {
                href: "drop-raw-data"
              }
            ]
          },
          {
            href: "compression",
            children: [
              {
                href: "manually-compress-chunks"
              },
              {
                href: "decompress-chunks"
              },
              {
                href: "backfill-historical-data"
              },
              {
                href: "modify-a-schema"
              }
            ]
          },
          {
            href: "user-defined-actions",
            children: [
              {
                href: "create-and-register"
              },
              {
                href: "test-and-debug"
              },
              {
                title: "Altering and Deleting",
                href: "alter-and-delete"
              },
              {
                href: "example-generic-retention"
              },
              {
                href: "example-tiered-storage"
              },
              {
                href: "example-downsample-and-compress"
              }
            ]
          },
          {
            href: "data-retention",
            children: [
              {
                href: "create-a-retention-policy"
              },
              {
                href: "manually-drop-chunks"
              },
              {
                href: "data-retention-with-continuous-aggregates"
              }
            ]
          },
          {
            href: "data-reordering"
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
            href: "visualize-data"
          },
          {
            href: "backup-and-restore",
            children: [
              {
                title: "Using pg_dump/pg_restore",
                href: "pg-dump-and-restore"
              },
              {
                title: "Docker & WAL-E",
                href: "docker-and-wale"
              }
            ]
          },
          {
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
            title: "Migrate Existing Data",
            href: "migrate-data",
            children: [
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
                title: "Update TimescaleDB from 1.x to 2.x",
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
            title: "Ingest data from other sources",
            href: "ingest-from-other-sources"
          },
        ]
      },
      {
        title: "Tutorials and Quick Starts",
        href: "tutorials",
        children: [
          {
            title: "Quick Start Guides",
            href: "quick-starts",
            children: [
              {
                href: "node-quickstart"
              },
              {
                href: "python-quickstart"
              },
              {
                href: "ruby-quickstart"
              },
              {
                href: "golang-quickstart"
              }
            ]
          },
          {
            title: "Getting started with Promscale",
            href: "promscale",
            children: [
              {
                title: "The Benefits of using Promscale",
                href: "promscale-benefits"
              },
              {
                title: "How Promscale works",
                href: "promscale-how-it-works"
              },
              {
                title: "Installing Promscale",
                href: "promscale-install"
              },
              {
                title: "Run queries with PromQL and SQL",
                href: "promscale-run-queries"
              }
            ]
          },
          {
            title: "Introduction to time-series forecasting",
            href: "time-series-forecast"
          },
          {
            title: "Analyzing cryptocurrency data",
            href: "analyze-cryptocurrency-data"
          },
          {
            title: "Grafana",
            href: "grafana",
            children: [
              {
                href: "installation"
              },
              {
                title: "Create a dashboard and panel",
                href: "create-dashboard-and-panel"
              },
              {
                title: "Build Geospatial dashboards",
                href: "geospatial-dashboards"
              },
              {
                title: "Use Grafana variables",
                href: "grafana-variables"
              },
              {
                title: "Visualize missing data",
                href: "visualize-missing-data"
              },
              {
                title: "Setup alerts",
                href: "setup-alerts"
              }
            ]
          },
          {
            title: "Visualize data in Tableau",
            href: "visualize-with-tableu"
          },
          {
            title: "Visualize with Power BI",
            href: "visualize-with-power-bi"
          },
          {
            href: "sample-datasets"
          }
        ]
      },
      {
        href: "administration",
        children: [
          {
            href: "configuration"
          },
          {
            href: "single-node"
          },
          {
            title: "Multi-node",
            href: "multi-node"
          },
          {
            title: "Primary/Replica Setup",
            href: "primary-replica-setup"
          },
          {
            href: "telemetry"
          }
        ]
      },
      {
        href: "integrations",
        children: [
          {
            href: "psql"
          },
          {
            href: "prometheus"
          },
          {
            href: "kafka"
          },
          {
            href: "telegraf"
          },
          {
            href: "tebleau"
          },
          {
            title: "Power BI",
            href: "power-bi"
          }
        ]
      }
    ]
  }
]
