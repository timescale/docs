

module.exports = [
  {
    title: "TimescaleDB",
    filePath: 'index.md',
    href: "timescaledb",
    name: 'TimescaleDB',
    excerpt: 'blah blha blha',
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
            title: "Why use TimescaleDB?",
            href: "why-timescaledb"
          },
          {
            href: "core-concepts",
            children : [
              {
                title: "Single vs. Multi-node",
                href: "single-vs-multinode"
              },
              {
                href: "hypertables"
              },
              {
                href: "chunks"
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
            href: "deployment-options",
            children: [
              {
                title: "Self hosted (including containers)",
                href: "self-hosted"
              },
              {
                href: "timescale-forge"
              },
              {
                href: "timescale-cloud"
              }
            ]
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
            href: "launch-timescaledb"
          },
          {
            title: "Access your database",
            href: "access-timescaledb"
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
            href: "visualize-your-data"
          },
          {
            title: "Migrate data to TimescaleDB",
            href: "migrate-data"
          },
          {
            href: "connect-with-code"
          },
          {
            title: "Other sample datasets",
            href: "sample-datasets"
          }
        ]
      },
      {
        title: "How-to Guides",
        href: "how-to-guides",
        children: [
          {
            title: "Install TimescaleDB",
            href: "install-timescaledb"
          },
          {
            href: "hypertables"
          },
          {
            href: "distributed-hypertables"
          },
          {
            href: "write-data"
          },
          {
            href: "query-data"
          },
          {
            title: "Multi-node Setup",
            href: "multi-node-setup"
          },
          {
            href: "continuous-aggregates"
          },
          {
            href: "compression"
          },
          {
            href: "user-defined-actions"
          },
          {
            href: "data-retention"
          },
          {
            href: "data-reordering"
          },
          {
            title: "Replication and HA",
            href: "replication-and-ha"
          },
          {
            href: "visualize-data"
          },
          {
            href: "backup-and-restore"
          },
          {
            href: "schema-management"
          },
          {
            title: "Migrate Existing Data",
            href: "migrate-data"
          },
          {
            href: "update-timescaledb"
          },
          {
            title: "Ingest data from other sources",
            href: "ingest-from-other-sources"
          },
        ]
      },
      {
        title: "Tutorials",
        href: "tutorials",
        children: [
          {
            title: "Introduction to time-series forecasting",
            href: "time-series-forecast"
          },
          {
            title: "Analyzing cryptocurrency data",
            href: "analyzing-crypto-data"
          },
          {
            title: "Create SQL Notebooks for time-series",
            href: "create-sql-notebooks"
          },
          {
            title: "Grafana",
            href: "grafana",
            childern: [
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
