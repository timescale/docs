

module.exports = [
  {
    Title: "TimescaleDB",
    type: 'page',
    filePath: 'index.md',
    href: "timescaledb",
    name: 'TimescaleDB',
    excerpt: 'blah blha blha',
    children: [
      {
        Title: "Overview",
        type: 'directory',
        href: "overview",
        children: [
          {
            Title: "What is time-series data?",
            type: 'page',
            href: "what-is-time-series-data"
          },
          {
            Title: "Why use TimescaleDB?",
            type: 'page',
            href: "why-timescaledb"
          },
          {
            Title: "Core Concepts",
            type: 'page',
            href: "core-concepts",
            children : [
              {
                Title: "Single vs. Multi-node",
                type: 'page',
                href: "single-vs-multinode"
              },
              {
                Title: "Hypertables",
                type: 'page',
                href: "hypertables"
              },
              {
                Title: "Chunks",
                type: 'page',
                href: "chunks"
              },
              {
                Title: "Distributed Hypertables",
                type: 'page',
                href: "distributed-hypertables"
              },
              {
                Title: "Compression",
                type: 'page',
                href: "compression"
              },
              {
                Title: "Continuous Aggregates",
                type: 'page',
                href: "continuous-aggregates"
              },
              {
                Title: "Data Retention",
                type: 'page',
                href: "data-retention"
              },
              {
                Title: "User Defined Actions",
                type: 'page',
                href: "user-defined-actions"
              },
              {
                Title: "Backup & Restore",
                type: 'page',
                href: "backup-restore"
              }
            ]
          },
          {
            Title: "Deployment Options",
            type: 'page',
            href: "deployment-options",
            children: [
              {
                Title: "Self hosted (including containers)",
                type: 'page',
                href: "self-hosted"
              },
              {
                Title: "Timescale Forge",
                type: 'page',
                href: "timescale-forge"
              },
              {
                Title: "Timescale Cloud",
                type: 'page',
                href: "timescale-cloud"
              }              
            ]
          },
          {
            Title: "Data model flexibility",
            type: 'page',
            href: "data-model-flexibility",
            children: [
              {
                Title: "Wide data model",
                type: 'page',
                href: "wide-data-model"
              },
              {
                Title: "Narrow data model",
                type: 'page',
                href: "narrow-data-model"
              },
              {
                Title: "Relational + Time-series",
                type: 'page',
                href: "relational-timeseries"
              },
              {
                Title: "Geospatial Compatible",
                type: 'page',
                href: "geospatial"
              }
            ]
          },
          {
            Title: "How does it compare?",
            type: 'page',
            href: "how-does-it-compare",
            children: [
              {
                Title: "PostgreSQL",
                type: 'page',
                href: "timescaledb-vs-postgres"
              },
              {
                Title: "NoSQL",
                type: 'page',
                href: "timescaledb-vs-nosql"
              },
            ]
          },
          {
            Title: "Release Notes",
            type: 'page',
            href: "release-notes"
          },          
          {
            Title: "Limitations",
            type: 'page',
            href: "limitations"
          },
          {
            Title: "FAQ",
            type: 'page',
            href: "faq"
          }
        ]
      },
      {
        Title: "Getting Started",
        type: 'directory',
        href: "getting-started",
        children: [
          {
            Title: "Launch your first instance",
            type: 'page',
            href: "launch-timescaledb"
          },
          {
            Title: "Access your database",
            type: 'page',
            href: "access-timescaledb"
          },
          {
            Title: "Add time-series data",
            type: 'page',
            href: "add-data"
          },          
          {
            Title: "Create a Continuous Aggregate",
            type: 'page',
            href: "create-cagg"
          },          
          {
            Title: "Save space with Compression",
            type: 'page',
            href: "compress-data"
          },
          {
            Title: "Learn about Data Retention",
            type: 'page',
            href: "learn-data-retention"
          },
          {
            Title: "Analyze your data",
            type: 'page',
            href: "analyze-your-data"
          },
          {
            Title: "Visualize your data",
            type: 'page',
            href: "visualize-your-data"
          },
          {
            Title: "Migrate data to TimescaleDB",
            type: 'page',
            href: "migrate-data"
          },                                                   
          {
            Title: "Connect with Code",
            type: 'page',
            href: "connect-with-code"
          },
          {
            Title: "Other sample datasets",
            type: 'page',
            href: "sample-datasets"
          }
        ]
      },      
      {
        Title: "How-to Guides",
        type: 'directory',
        href: "how-to-guides",
        children: [
          {
            Title: "Install TimescaleDB",
            type: 'page',
            href: "install-timescaledb"
          },
          {
            Title: "Hypertables",
            type: 'page',
            href: "hypertables"
          },
          {
            Title: "Distributed Hypertables",
            type: 'page',
            href: "distributed-hypertables"
          },
          {
            Title: "Write Data",
            type: 'page',
            href: "write-data"
          },
          {
            Title: "Query Data",
            type: 'page',
            href: "query-data"
          },
          {
            Title: "Multi-node Setup",
            type: 'page',
            href: "multi-node-setup"
          },          
          {
            Title: "Continuous Aggregates",
            type: 'page',
            href: "continuous-aggregates"
          },          
          {
            Title: "Compression",
            type: 'page',
            href: "compression"
          },          
          {
            Title: "User Defined Actions",
            type: 'page',
            href: "user-defined-actions"
          },
          {
            Title: "Data Retention",
            type: 'page',
            href: "data-retention"
          },
          {
            Title: "Data Reordering",
            type: 'page',
            href: "data-reordering"
          },
          {
            Title: "Replication and HA",
            type: 'page',
            href: "replication-and-ha"
          },
          {
            Title: "Visualize Data",
            type: 'page',
            href: "visualize-data"
          },
          {
            Title: "Backup and Restore",
            type: 'page',
            href: "backup-and-restore"
          },
          {
            Title: "Schema Management",
            type: 'page',
            href: "schema-management"
          },
          {
            Title: "Migrate Existing Data",
            type: 'page',
            href: "migrate-data"
          },
          {
            Title: "Update TimescaleDB",
            type: 'page',
            href: "update-timescaledb"
          },
          {
            Title: "Ingest data from other sources",
            type: 'page',
            href: "ingest-from-other-sources"
          },          
        ]
      },
      {
        Title: "Tutorials",
        type: 'directory',
        href: "Tutorials",
        children: [
          {
            Title: "Introduction to time-series forecasting",
            type: 'page',
            href: "time-series-forecast"
          },
          {
            Title: "Analyzing cryptocurrency data",
            type: 'page',
            href: "analyzing-crypto-data"
          },
          {
            Title: "Create SQL Notebooks for time-series",
            type: 'page',
            href: "create-sql-notebooks"
          }, 
          {
            Title: "Grafana",
            type: 'page',
            href: "grafana",
            childern: [
              {
                Title: "Installation",
                type: 'page',
                href: "installation"
              },
              {
                Title: "Create a dashboard and panel",
                type: 'page',
                href: "create-dashboard-and-panel"
              },
              {
                Title: "Build Geospatial dashboards",
                type: 'page',
                href: "geospatial-dashboards"
              },
              {
                Title: "Use Grafana variables",
                type: 'page',
                href: "grafana-variables"
              },
              {
                Title: "Visualize missing data",
                type: 'page',
                href: "visualize-missing-data"
              },
              {
                Title: "Setup alerts",
                type: 'page',
                href: "setup-alerts"
              }
            ]
          },     
          {
            Title: "Visualize data in Tableau",
            type: 'page',
            href: "visualize-with-tableu"
          },
          {
            Title: "Visualize with Power BI",
            type: 'page',
            href: "visualize-with-power-bi"
          }          
        ]
      },
      {
        Title: "Administration",
        type: 'directory',
        href: "administration",
        children: [
          {
            Title: "Configuration",
            type: 'page',
            href: "configuration"
          },
          {
            Title: "Single node",
            type: 'page',
            href: "single-node"
          },
          {
            Title: "Multi-node",
            type: 'page',
            href: "multi-node"
          },
          {
            Title: "Primary/Replica Setup",
            type: 'page',
            href: "primary-replica-setup"
          },
          {
            Title: "Telemetry",
            type: 'page',
            href: "telemetry"
          }                              
        ]
      },
      {
        Title: "Integrations",
        type: 'directory',
        href: "integrations",
        children: [
          {
            Title: "Psql",
            type: 'page',
            href: "psql"
          },
          {
            Title: "Prometheus",
            type: 'page',
            href: "prometheus"
          },
          {
            Title: "Kafka",
            type: 'page',
            href: "kafka"
          },
          {
            Title: "Telegraf",
            type: 'page',
            href: "telegraf"
          },
          {
            Title: "Tableau",
            type: 'page',
            href: "tebleau"
          },
          {
            Title: "Power BI",
            type: 'page',
            href: "power-bi"
          }
        ]
      }
    ]
  }
]
