module.exports = [
  {
    title: "Use Timescale",
    href: "use-timescale",
    filePath: "index.md",
    pageComponents: ["content-list"],
    excerpt:
      "How to connect to Timescale, administer, and configure the database.",
    children: [
      {
        title: "About Timescale Cloud services",
        href: "services",
        excerpt: "About Timescale Cloud services",
        children: [
          {
            title: "About services",
            href: "service-overview",
            excerpt: "Timescale services overview",
          },
          {
            title: "Connection pooling",
            href: "connection-pooling",
            excerpt:
              "Using a connection pool with your Timescale services",
          },
          {
            title: "Dynamic PostgreSQL",
            href: "dynamic-postgresql",
            excerpt: "Dynamic PostgreSQL overview",
          },
          {
            title: "Manually change resources",
            href: "change-resources",
            excerpt: "Manually adjust your service resources",
          },
          {
            title: "Service explorer",
            href: "service-explorer",
            excerpt: "Timescale services explorer",
          },
          {
            title: "Service management",
            href: "service-management",
            excerpt:
              "Timescale services operations, Service management tab",
          },
          {
            title: "Troubleshooting Timescale services",
            href: "troubleshooting",
            type: "placeholder",
          },
        ],
      },
      {
        title: "Alerting",
        href: "alerting",
        excerpt: "Configure alerting within Timescale",
      },
      {
        title: "Backup, restore, and PITR",
        href: "backup-restore",
        children: [
          {
            title: "Backup and restore",
            href: "backup-restore-cloud",
            excerpt: "Timescale backup and restore",
          },
          {
            title: "Point-in-time recovery",
            href: "point-in-time-recovery",
            excerpt: "PITR on Timescale services"
          }
        ]
      },
      {
        title: "Compression",
        href: "compression",
        children: [
          {
            title: "About compression",
            href: "about-compression",
            excerpt: "Learn about how compression works",
          },
          {
            title: "About compression methods",
            href: "compression-methods",
            excerpt: "Learn about the different compression methods",
          },
          {
            title: "Backfill historical data",
            href: "backfill-historical-data",
            excerpt: "Backfill historical data to compressed chunks",
          },
          {
            title: "Compression design",
            href: "compression-design",
            excerpt: "The design of TimescaleDB compression",
          },
          {
            title: "Decompress chunks",
            href: "decompress-chunks",
            excerpt: "Decompress data chunks",
          },
          {
            title: "Enable a compression policy",
            href: "compression-policy",
            excerpt: "Create a compression policy on a hypertable",
          },
          {
            title: "Manual compression",
            href: "manual-compression",
            excerpt: "Compress data chunks",
          },
          {
            title: "Modify compressed data",
            href: "modify-compressed-data",
            excerpt: "Insert and modify data in compressed chunks",
          },
          {
            title: "Modify a schema",
            href: "modify-a-schema",
            excerpt: "Change the data schema in compressed chunks",
          },
          {
            title: "Troubleshooting",
            href: "troubleshooting",
            type: "placeholder",
          },
        ],
      },
      {
        title: "Configuration",
        href: "configuration",
        excerpt: "Configure your Timescale Cloud service",
        children: [
          {
            title: "About Configuration",
            href: "about-configuration",
            excerpt:
              "Overview of configuration options and methods for PostgreSQL and Timescale",
          },
          {
            title: "Advanced parameters",
            href: "advanced-parameters",
            excerpt:
              "Configure advanced database parameters for your Timescale service",
          },
          {
            title: "Customize configuration",
            href: "customize-configuration",
            excerpt: "Customize your Timescale database configuration",
          },
          {
            title: "Troubleshooting",
            href: "troubleshooting",
            type: "placeholder",
          },
        ],
      },
      {
        title: "Continuous aggregates",
        href: "continuous-aggregates",
        children: [
          {
            title: "About continuous aggregates",
            href: "about-continuous-aggregates",
            excerpt: "About continuous aggregates",
          },
          {
            title: "Compress continuous aggregates",
            href: "compression-on-continuous-aggregates",
            excerpt: "Compress continuous aggregates",
          },
          {
            title: "Create a continuous aggregate",
            href: "create-a-continuous-aggregate",
            excerpt: "Create continuous aggregates",
          },
          {
            title: "Create an index on a continuous aggregate",
            href: "create-index",
            excerpt:
              "Manage automatic index creation and manually create additional indexes",
          },
          {
            title: "Drop data from continuous aggregates",
            href: "drop-data",
            excerpt: "Drop data from continuous aggregates",
          },
          {
            title: "Hierarchical continuous aggregates",
            href: "hierarchical-continuous-aggregates",
          },
          {
            title: "Manage materialized hypertables",
            href: "materialized-hypertables",
            excerpt: "Manage materialized hypertables in continuous aggregates",
          },
          {
            title: "Migrate a continuous aggregate to the new form",
            href: "migrate",
            excerpt:
              "Migrate old continuous aggregates to the new form introduced in Timescale 2.7",
          },
          {
            title: "Real time aggregates",
            href: "real-time-aggregates",
            excerpt: "Manage real time aggregates in continuous aggregates",
          },
          {
            title: "Refresh policies for continuous aggregates",
            href: "refresh-policies",
            excerpt: "Manage refresh policies for continuous aggregates",
          },
          {
            title: "Time in continuous aggregates",
            href: "time",
            excerpt: "Manage time in continuous aggregates",
          },
          {
            title: "Troubleshoot continuous aggregates",
            href: "troubleshooting",
            type: "placeholder",
            excerpt: "Troubleshoot continuous aggregates",
          },
        ],
      },
      {
        href: "data-retention",
        excerpt: "Drop data by time value either automatically or manually",
        children: [
          {
            title: "About data retention",
            href: "about-data-retention",
            excerpt: "Learn about data retention in Timescale",
          },
          {
            title: "About data retention with continuous aggregates",
            href: "data-retention-with-continuous-aggregates",
            excerpt: "Using data retention policies with continuous aggregates",
          },
          {
            title: "Create a retention policy",
            href: "create-a-retention-policy",
            excerpt: "Create a data retention policy",
          },
          {
            title: "Manually drop chunks",
            href: "manually-drop-chunks",
            excerpt: "Manually drop chunks",
          },
          {
            title: "Troubleshooting data retention",
            href: "troubleshooting",
            type: "placeholder",
            excerpt: "Troubleshoot data retention",
          },
        ],
      },
      {
        title: "High availability and read replication",
        href: "ha-replicas",
        excerpt: "Timescale high availability and read replication",
        children: [
          {
            title: "Manage high availability",
            href: "high-availability",
            excerpt: "Set up HA replicas on Timescale for high availability",
          },
          {
            title: "Manage read replication",
            href: "read-scaling",
            excerpt: "Understand how read scaling works in Timescale",
          },
        ],
      },
      {
        title: "Hyperfunctions",
        href: "hyperfunctions",
        pageComponents: ["featured-cards"],
        featuredChildren: [
          "/use-timescale/:currentVersion:/hyperfunctions/function-pipelines",
          "/use-timescale/:currentVersion:/hyperfunctions/approx-count-distincts",
          "/use-timescale/:currentVersion:/hyperfunctions/stats-aggs",
          "/use-timescale/:currentVersion:/hyperfunctions/gapfilling-interpolation",
          "/use-timescale/:currentVersion:/hyperfunctions/percentile-approx",
          "/use-timescale/:currentVersion:/hyperfunctions/counter-aggregation",
          "/use-timescale/:currentVersion:/hyperfunctions/time-weighted-averages",
        ],
        children: [
          {
            title: "About hyperfunctions",
            href: "about-hyperfunctions",
            excerpt:
              "Learn about Timescale hyperfunctions for additional analysis",
          },
          {
            title: "Approximate count distincts",
            href: "approx-count-distincts",
            type: "directory",
            excerpt: "Count the number of unique values in a dataset",
            children: [
              {
                title: "Hyperloglog",
                href: "hyperloglog",
                tags: ["hyperfunctions", "toolkit", "query", "timescaledb"],
                excerpt: "Learn about the hyperloglog hyperfunction",
              },
            ],
          },
          {
            title: "Counter aggregation",
            href: "counter-aggregation",
            type: "directory",
            excerpt: "Calculate statistics from gauges and counters",
            children: [
              {
                title: "Counter aggregates",
                href: "counter-aggs",
                excerpt: "Learn about the counter aggregate hyperfunction",
              },
            ],
          },
          {
            title: "Function pipelines",
            href: "function-pipelines",
            excerpt:
              "Use functional programming to simplify complex SQL queries",
          },
          {
            title: "Gapfilling and interpolation",
            href: "gapfilling-interpolation",
            type: "directory",
            excerpt: "Fill in data collected at irregular time intervals",
            children: [
              {
                title: "Last observation carried forward",
                href: "locf",
                excerpt: "Learn about the locf hyperfunction",
              },
              {
                title: "Time bucket gapfill",
                href: "time-bucket-gapfill",
                excerpt:
                  "Learn about the time bucket gapfillling hyperfunction",
              },
            ],
          },
          {
            title: "Heartbeat aggregation",
            href: "heartbeat-agg",
            excerpt:
              "Build a model of system health from a series of health check timestamps",
          },
          {
            title: "Percentile approximation",
            href: "percentile-approx",
            type: "directory",
            excerpt: "Calculate percentiles",
            children: [
              {
                title: "Approximate percentile",
                href: "approximate-percentile",
                excerpt: "Learn about the approximate percentile hyperfunction",
              },
              {
                title: "Advanced aggregation methods",
                href: "advanced-agg",
                excerpt:
                  "Learn about advanced aggregation methods for hyperfunctions",
              },
            ],
          },
          {
            title: "Statistical aggregates",
            href: "stats-aggs",
            excerpt:
              "Calculate descriptive statistics and models, including averages, standard deviation, linear regression, and more",
          },
          {
            title: "Time-weighted averages",
            href: "time-weighted-averages",
            type: "directory",
            excerpt: "Calculate time-weighted averages",
            children: [
              {
                title: "Time-weighted averages",
                href: "time-weighted-average",
                excerpt: "Learn about the time-weighted averages hyperfunction",
              },
            ],
          },
          {
            title: "Troubleshoot hyperfunctions",
            href: "troubleshooting",
            type: "placeholder",
          },
        ],
      },
      {
        title: "Hypercore",
        href: "hypercore",
        excerpt: "The Timescale hybrid row-columnar storage engine for real-time analytics, powered by time-series data",
      },
      {
        title: "Hypertables",
        href: "hypertables",
        children: [
          {
            title: "About hypertables",
            href: "about-hypertables",
            excerpt: "Learn about hypertables in Timescale",
          },
          {
            title: "Alter hypertables",
            href: "alter",
            excerpt: "Alter hypertables",
          },
          {
            title: "Change hypertable chunk intervals",
            href: "change-chunk-intervals",
            excerpt: "Change and view chunk time intervals for a hypertable",
          },
          {
            title: "Create hypertables",
            href: "create",
            excerpt: "Create hypertables",
          },
          {
            title: "Create unique indexes on hypertables",
            href: "hypertables-and-unique-indexes",
            excerpt: "Create hypertables with unique indexes",
          },
          {
            title: "Drop hypertables",
            href: "drop",
            excerpt: "Drop hypertables",
          },
          {
            title: "Improve query performance",
            href: "improve-query-performance",
            excerpt: "Skip chunks",
          },
          {
            title: "Troubleshoot hypertables",
            href: "troubleshooting",
            type: "placeholder",
            excerpt: "Troubleshooting and error fixes for hypertables",
          },
        ],
      },
      {
        title: "Ingest data using third-party tools",
        href: "ingest-data",
        children: [
          {
            title: "About ingesting data from other sources",
            href: "about-ingesting",
            excerpt: "Ingest data into Timescale from third-party sources",
          },
          {
            title: "Ingesting data with Prometheus",
            href: "ingest-prometheus",
            excerpt: "Ingest data into Timescale from Prometheus",
          },
          {
            title: "Ingesting data with Kafka",
            href: "ingest-kafka",
            excerpt: "Ingest data into Timescale from Kafka",
          },
          {
            title: "Ingesting data with Timescale parallel copy",
            href: "about-timescaledb-parallel-copy",
            excerpt:
              "Quickly insert bulk data by parallelizing `COPY` operations",
          },
          {
            title: "Ingesting data from a .csv file",
            href: "import-csv",
            excerpt:
              "Import data into your Timescale instance from an external .csv file",
          },
        ],
      },
      {
        title: "Integrate tooling with Timescale Cloud",
        href: "integrations",
        excerpt: "Integrate third-party solutions with Timescale Cloud",
        children: [
          {
            title: "Configuration and deployment",
            href: "config-deploy",
            excerpt: "Integrate your Timescale account with third-party configuration and deployment solutions",
            children:
              [
                {
                  title: "Terraform",
                  href: "terraform",
                  excerpt: "Manage your Timescale services via Terraform",
                },
              ]
          },
          {
            title: "Data ingestion",
            href: "data-ingest",
            excerpt: "Integrate your Timescale database with third-party data and ingestion solutions",
            children:
              [
                {
                  title: "Telegraf",
                  href: "telegraf",
                  excerpt: "Use Telegraf with Timescale",
                },
              ]
          },
          {
            title: "Observability and alerting",
            href: "observability-alerting",
            excerpt: "Integrate your Timescale database with third-party observability and alerting solutions",
            children:
              [
                {
                  title: "Grafana",
                  href: "grafana",
                  excerpt: "Use Grafana with Timescale",
                  children:
                    [
                      {
                        title: "Create a Grafana dashboard and panel",
                        href: "create-dashboard-and-panel",
                        excerpt: "Create a Grafana dashboard and panel to display your Timescale data",
                      },
                      {
                        title: "Installing Grafana",
                        href: "installation",
                        excerpt: "Installing Grafana and connecting it to your Timescale service"
                      },
                      {
                        title: "Use Grafana to visualize geospatial data",
                        href: "geospatial-dashboards",
                        excerpt: "Use Grafana to visualize geospatial data in Timescale",
                      },
                    ]
                },
                {
                  title: "Tableau",
                  href: "tableau",
                  excerpt: "Use Tableau with Timescale",
                },
              ]
          },
          {
            title: "Query and administration",
            href: "query-admin",
            excerpt: "Integrate your Timescale database with third-party query and administration solutions",
            children:
              [
                {
                  title: "About connecting to Timescale",
                  href: "about-connecting",
                  excerpt: "Learn about using connecting to your Timescale database",
                },
                {
                  title: "About psql",
                  href: "about-psql",
                  excerpt: "Learn about using psql to connect to Timescale",
                },
                {
                  title: "Connect using Azure Data Studio",
                  href: "azure-data-studio",
                  excerpt: "Install Azure Data Studio to connect to Timescale",
                },
                {
                  title: "Connect using DBeaver",
                  href: "dbeaver",
                  excerpt: "Install DBeaver to connect to Timescale",
                },
                {
                  title: "Connect using pgAdmin",
                  href: "pgadmin",
                  excerpt: "Install pgAdmin to connect to Timescale",
                },
                {
                  title: "Connect using qStudio",
                  href: "qstudio",
                  excerpt: "Install qstudio to connect to Timescale",
                },
                {
                  title: "Install psql",
                  href: "psql",
                  excerpt: "Install psql to connect to Timescale",
                },
                {
                  title: "Troubleshooting Timescale connections",
                  href: "troubleshooting",
                  type: "placeholder",
                },
              ]
          },
        ],
      },
      {
        title: "Maintenance and upgrades",
        href: "upgrades",
        excerpt: "Keep your Timescale Cloud service up-to-date",
      },
      {
        title: "Metrics and logging",
        href: "metrics-logging",
        excerpt: "Timescale metrics and logging",
        children: [
          {
            title: "Export to Prometheus",
            href: "metrics-to-prometheus",
            excerpt:
              "Export telemetry data to Prometheus",
          },
          {
            title: "Insights",
            href: "insights",
            excerpt: "Query-level performance insights",
          },
          {
            title: "Service metrics",
            href: "service-metrics",
            excerpt: "Timescale services metrics",
          },
          {
            title: "Service logs",
            href: "service-logs",
            excerpt: "Timescale services logs",
          },
          {
            title: "Third-party monitoring for Timescale Cloud Services",
            href: "integrations",
            excerpt:
              "Export telemetry data to a third-party monitoring service",
          },
        ],
      },
      {
        title: "PostgreSQL extensions",
        href: "extensions",
        excerpt: "Timescale PostgreSQL extensions",
        children: [
          {
            title: "pgcrypto extension",
            href: "pgcrypto",
            excerpt: "Using the pgcrypto PostgreSQL extension",
          },
          {
            title: "pgvector extension",
            href: "pgvector",
            excerpt: "Using the pgvector PostgreSQL extension",
          },
          {
            title: "postgis extension",
            href: "postgis",
            excerpt: "Using the postgis PostgreSQL extension",
          },
        ]
      },
      {
        title: "Query data",
        href: "query-data",
        children: [
          {
            title: "About querying data",
            href: "about-query-data",
            excerpt: "Learn how to query data in Timescale",
          },
          {
            title: "Perform DISTINCT queries with SkipScan",
            href: "skipscan",
            excerpt: "Make DISTINCT queries faster with SkipScan",
          },
          {
            title: "Perform advanced analytic queries",
            href: "advanced-analytic-queries",
            excerpt: "Use advanced analytics queries",
          },
          {
            title: "SELECT data",
            href: "select",
            excerpt: "Select data in hypertables",
          },
          {
            title: "Troubleshooting",
            href: "troubleshooting",
            type: "placeholder",
          },
        ],
      },
      {
        title: "Schema management",
        href: "schema-management",
        children: [
          {
            title: "About constraints",
            href: "about-constraints",
            excerpt: "About schema constraints",
          },
          {
            title: "About indexing",
            href: "about-indexing",
            excerpt: "About schema indexes",
          },
          {
            title: "About schemas",
            href: "about-schemas",
            excerpt: "About hypertable schemas",
          },
          {
            title: "About tablespaces",
            href: "about-tablespaces",
            excerpt: "About schema tablespaces",
          },
          {
            title: "Alter hypertables",
            href: "alter",
            excerpt: "Change the schema of a hypertable",
          },
          {
            title: "Index",
            href: "indexing",
            excerpt: "Create an index on a hypertable",
          },
          {
            title: "JSON",
            href: "json",
            excerpt: "Using JSON data types in a hypertable",
          },
          {
            title: "Triggers",
            href: "triggers",
            excerpt: "Create triggers on a hypertable",
          },
          {
            title: "Troubleshoot schema management",
            href: "troubleshooting",
            type: "placeholder",
          },
        ],
      },
      {
        title: "Security",
        href: "security",
        excerpt: "Learn how your Timescale instance is secured",
        children: [
          {
            title: "About security in Timescale Cloud",
            href: "overview",
            excerpt: "Get an overview of Timescale security",
          },
          {
            title: "Client credentials",
            href: "client-credentials",
            excerpt: "Client credentials to programmatically access your Timescale account",
          },
          {
            title: "Connect with a stricter SSL mode",
            href: "strict-ssl",
            excerpt:
              "Connect to Timescale with a stricter SSL mode of verify-ca or verify-full",
          },
          {
            title: "Multi-factor Authentication",
            href: "multi-factor-authentication",
            excerpt: "Multi-factor authentication for your Timescale account",
          },
          {
            title: "Read only role",
            href: "read-only-role",
            excerpt: "Create a read-only role to access your database",
          },
          {
            title: "SAML authentication",
            href: "saml",
            excerpt: "SAML / SSO authentication for your Timescale account",
          },
        ],
      },
      {
        title: "Tiered storage",
        href: "data-tiering",
        excerpt: "Save on storage costs by tiering older data to a low-cost bottomless object storage tier",
        children: [
          {
            title: "About the object storage tier",
            href: "about-data-tiering",
            excerpt:
              "Learn how the object storage tier helps you save on storage costs",
          },
          {
            title: "Creating tiering policies",
            href: "creating-data-tiering-policy",
            excerpt:
                "How to create a tiering policy",
          },
          {
            title: "Enabling the object storage tier",
            href: "enabling-data-tiering",
            excerpt:
                "How to enable the object storage tier",
          },
          {
            title: "Manually tier data",
            href: "manual-tier-chunk",
            excerpt:
                "How to manually tier data to the object storage tier",
          },
          {
            title: "Manually untier data",
            href: "untier-data",
            excerpt: "How to manualy untier data from the object storage tier",
          },
          {
            title: "Querying tiered data",
            href: "querying-tiered-data",
            excerpt:
                "How to query tiered data",
          },
          {
            title: "Replicas and forks with tiered data",
            href: "tiered-data-replicas-forks",
            excerpt:
                "How tiered data works on replicas and forks",
          },
          {
            title: "Tour of tiered storage",
            href: "tour-data-tiering",
            excerpt:
               "A quick tour of tiered storage",
          },
          {
            title: "Troubleshooting",
            href: "troubleshooting",
            type: "placeholder",
          },          
        ],
      },
      {
        title: "Time buckets",
        href: "time-buckets",
        excerpt: "Aggregate data by time interval with time buckets",
        children: [
          {
            title: "About time buckets",
            href: "about-time-buckets",
            excerpt: "Learn how time buckets work in Timescale.",
          },
          {
            title: "Troubleshoot problems with time buckets",
            href: "troubleshooting",
            type: "placeholder",
          },
          {
            title: "Use time buckets to group time-series data",
            href: "use-time-buckets",
            excerpt:
              "How to group time series data with the time_bucket function.",
          },
        ],
      },
      {
        title: "Timescale Cloud regions",
        href: "regions",
        excerpt: "Timescale AWS regions",
      },
      {
        title: "Timescale limitations",
        href: "limitations",
        excerpt: "Current limitations of Timescale features",
      },
      {
        title: "Troubleshoot Timescale",
        href: "troubleshoot-timescaledb",
        excerpt: "Troubleshooting Timescale",
      },
      {
        title: "User-defined actions",
        href: "user-defined-actions",
        children: [
          {
            title: "About user-defined actions",
            href: "about-user-defined-actions",
            excerpt: "Learn about user-defined actions",
          },
          {
            title: "Alter and delete a user-defined action",
            href: "alter-and-delete",
            excerpt: "Edit and delete user-defined actions",
          },
          {
            title: "Create and register a user-defined action",
            href: "create-and-register",
            excerpt: "Create a user-defined action",
          },
          {
            title: "Test and debug a user-defined action",
            href: "test-and-debug",
            excerpt: "Test and debug user-defined actions",
          },
          {
            title: "Troubleshooting",
            href: "troubleshooting",
            type: "placeholder",
          },
          {
            title: "Use an action for generic retention",
            href: "example-generic-retention",
            excerpt: "Example user-defined action for a retention policy",
          },
          {
            title: "Use an action for tablespace management",
            href: "example-tiered-storage",
            excerpt:
              "Example user-defined action for automatically moving chunks between tablespaces",
          },
          {
            title: "Use an action for downsampling and compression",
            href: "example-downsample-and-compress",
            excerpt: "Example user-defined action for downsample and compress",
          },
        ],
      },
      {
        title: "User management",
        href: "members",
        excerpt: "User management in Timescale Cloud",
        children: [
          {
            title: "Members list",
            href: "members-list",
            excerpt: "Timescale members list",
          },
          {
            title: "Project Ownership",
            href: "project-ownership",
            excerpt: "Timescale project ownership",
          },
        ],
      },
      {
        title: "VPC Peering and AWS PrivateLink",
        href: "vpc",
        excerpt: "Secure your Timescale Service with VPC Peering and AWS PrivateLink",
      },
      {
        href: "write-data",
        children: [
          {
            title: "About writing data",
            href: "about-writing-data",
            excerpt: "Write data into hypertables",
          },
          {
            title: "Delete data",
            href: "delete",
            excerpt: "Delete data from hypertables",
          },
          {
            title: "Insert data",
            href: "insert",
            excerpt: "Insert data into hypertables",
          },
          {
            title: "Update data",
            href: "update",
            excerpt: "Update data in hypertables",
          },
          {
            title: "Upsert data",
            href: "upsert",
            excerpt: "Upsert data into hypertables",
          },
        ],
      },
    ],
  },
];
