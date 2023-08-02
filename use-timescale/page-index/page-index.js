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
        title: "Services",
        href: "services",
        excerpt: "Timescale services",
        children: [
          {
            title: "Service overview",
            href: "service-overview",
            excerpt: "Timescale services overview",
          },
          {
            title: "Create a Timescale service",
            href: "create-a-service",
            excerpt: "Timescale services",
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
            title: "Connection pooling",
            href: "connection-pooling",
            excerpt:
              "Using a connection pool with your Timescale services",
          },
          {
            title: "Troubleshooting Timescale services",
            href: "troubleshooting",
            type: "placeholder",
          },
        ],
      },
      {
        title: "Clouds and regions",
        href: "regions",
        excerpt: "Timescale AWS regions",
      },
      {
        title: "Resources",
        href: "resources",
        excerpt: "Using and changing resources in Timescale",
        children: [
          {
            title: "Manually change resources",
            href: "change-resources",
            excerpt: "Manually adjust your service resources",
          },
        ]
      },
      {
        title: "PostgreSQL extensions",
        href: "extensions",
        excerpt: "Timescale PostgreSQL extensions",
        children: [
          {
            title: "pgvector extension",
            href: "pgvector",
            excerpt: "Using the pgvector PostgreSQL extension",
          },
          {
            title: "pgcrypto extension",
            href: "pgcrypto",
            excerpt: "Using the pgcrypto PostgreSQL extension",
          },
          {
            title: "postgis extension",
            href: "postgis",
            excerpt: "Using the postgis PostgreSQL extension",
          },
        ]
      },
      {
        title: "Timescale integrations",
        href: "integrations",
        excerpt: "Integrate your Timescale database with third-party solutions",
        children: [
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
                  title: "Install psql",
                  href: "psql",
                  excerpt: "Install psql to connect to Timescale",
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
                  excerpt: "Install qStudio to connect to Timescale",
                },
                {
                  title: "Troubleshooting Timescale connections",
                  href: "troubleshooting",
                  type: "placeholder",
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
                        title: "Installing Grafana",
                        href: "installation",
                        excerpt: "Installing Grafana and connecting it to your Timescale service"
                      },
                      {
                        title: "Create a Grafana dashboard and panel",
                        href: "create-dashboard-and-panel",
                        excerpt: "Create a Grafana dashboard and panel to display your Timescale data",
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
        ],
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
            title: "Create hypertables",
            href: "create",
            excerpt: "Create hypertables",
          },
          {
            title: "Change hypertable chunk intervals",
            href: "change-chunk-intervals",
            excerpt: "Change and view chunk time intervals for a hypertable",
          },
          {
            title: "Alter hypertables",
            href: "alter",
            excerpt: "Alter hypertables",
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
            title: "Troubleshoot hypertables",
            href: "troubleshooting",
            type: "placeholder",
            excerpt: "Troubleshooting and error fixes for hypertables",
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
            title: "Use time buckets to group time-series data",
            href: "use-time-buckets",
            excerpt:
              "How to group time series data with the time_bucket function.",
          },
          {
            title: "Troubleshoot problems with time buckets",
            href: "troubleshooting",
            type: "placeholder",
          },
        ],
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
          {
            title: "Delete data",
            href: "delete",
            excerpt: "Delete data from hypertables",
          },
        ],
      },
      {
        title: "Ingest data from other sources",
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
        title: "Migration",
        href: "migration",
        excerpt: "Migrate your existing PostgreSQL database to Timescale",
        children: [
          {
            title: "Migrate with pg_dump and pg_restore",
            href: "pg-dump-and-restore",
            excerpt:
              "Migrate a hypertable or entire database with native PostgreSQL commands",
          },
        ],
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
            title: "SELECT data",
            href: "select",
            excerpt: "Select data in hypertables",
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
            title: "Troubleshooting",
            href: "troubleshooting",
            type: "placeholder",
          },
        ],
      },
      {
        href: "configuration",
        children: [
          {
            title: "About Configuration",
            href: "about-configuration",
            excerpt:
              "Overview of configuration options and methods for PostgreSQL and Timescale",
          },
          {
            title: "Customize configuration",
            href: "customize-configuration",
            excerpt: "Customize your Timescale database configuration",
          },
          {
            title: "Advanced parameters",
            href: "advanced-parameters",
            excerpt:
              "Configure advanced database parameters for your Timescale service",
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
            title: "About schemas",
            href: "about-schemas",
            excerpt: "About hypertable schemas",
          },
          {
            title: "About indexing",
            href: "about-indexing",
            excerpt: "About schema indexes",
          },
          {
            title: "About tablespaces",
            href: "about-tablespaces",
            excerpt: "About schema tablespaces",
          },
          {
            title: "About constraints",
            href: "about-constraints",
            excerpt: "About schema constraints",
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
            title: "Triggers",
            href: "triggers",
            excerpt: "Create triggers on a hypertable",
          },
          {
            title: "JSON",
            href: "json",
            excerpt: "Using JSON data types in a hypertable",
          },
          {
            title: "Troubleshoot schema management",
            href: "troubleshooting",
            type: "placeholder",
          },
        ],
      },
      {
        href: "compression",
        children: [
          {
            title: "About compression",
            href: "about-compression",
            excerpt: "Compress data chunks",
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
            title: "Decompress chunks",
            href: "decompress-chunks",
            excerpt: "Decompress data chunks",
          },
          {
            title: "Backfill historical data",
            href: "backfill-historical-data",
            excerpt: "Backfill historical data to compressed chunks",
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
        title: "Continuous aggregates",
        href: "continuous-aggregates",
        children: [
          {
            title: "About continuous aggregates",
            href: "about-continuous-aggregates",
            excerpt: "About continuous aggregates",
          },
          {
            title: "Create a continuous aggregate",
            href: "create-a-continuous-aggregate",
            excerpt: "Create continuous aggregates",
          },
          {
            title: "Hierarchical continuous aggregates",
            href: "hierarchical-continuous-aggregates",
          },
          {
            title: "Refresh policies for continuous aggregates",
            href: "refresh-policies",
            excerpt: "Manage refresh policies for continuous aggregates",
          },
          {
            title: "Create an index on a continuous aggregate",
            href: "create-index",
            excerpt:
              "Manage automatic index creation and manually create additional indexes",
          },
          {
            title: "Time in continuous aggregates",
            href: "time",
            excerpt: "Manage time in continuous aggregates",
          },
          {
            title: "Drop data from continuous aggregates",
            href: "drop-data",
            excerpt: "Drop data from continuous aggregates",
          },
          {
            title: "Manage materialized hypertables",
            href: "materialized-hypertables",
            excerpt: "Manage materialized hypertables in continuous aggregates",
          },
          {
            title: "Real time aggregates",
            href: "real-time-aggregates",
            excerpt: "Manage real time aggregates in continuous aggregates",
          },
          {
            title: "Compress continuous aggregates",
            href: "compression-on-continuous-aggregates",
            excerpt: "Compress continuous aggregates",
          },
          {
            title: "Migrate a continuous aggregate to the new form",
            href: "migrate",
            excerpt:
              "Migrate old continuous aggregates to the new form introduced in Timescale 2.7",
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
        title: "High availability and replication",
        href: "ha-replicas",
        excerpt: "Timescale high availability and replicas",
        children: [
          {
            title: "High availability",
            href: "high-availability",
            excerpt: "Set up HA replicas on Timescale for high availability",
          },
          {
            title: "Read scaling",
            href: "read-scaling",
            excerpt: "Understand how read scaling works in Timescale",
          },
        ],
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
            title: "Alter and delete a user-defined action",
            href: "alter-and-delete",
            excerpt: "Edit and delete user-defined actions",
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
          {
            title: "Use an action to backfill data periodically",
            href: "example-backfill",
            excerpt: "Example user-defined action for scheduled backfills",
          },
          {
            title: "Troubleshooting",
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
        title: "VPC",
        href: "vpc",
        excerpt: "Timescale services operations, VPC tab",
      },
      {
        title: "Backup and restore",
        href: "backup-restore-cloud",
        excerpt: "Timescale backup and restore",
      },
      {
        title: "Billing and account management",
        href: "account-management",
        excerpt: "Timescale account management",
      },
      {
        title: "Metrics and logging",
        href: "metrics-logging",
        excerpt: "Timescale metrics and logging",
        children: [
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
            title: "Export to a monitoring service",
            href: "integrations",
            excerpt:
              "Export telemetry data to a third-party monitoring service",
          },
        ],
      },
      {
        title: "User Management",
        href: "members",
        excerpt: "Timescale user management",
        children: [
          {
            title: "Members list",
            href: "members-list",
            excerpt: "Timescale members list",
          },
        ],
      },
      {
        title: "Upgrades",
        href: "upgrades",
        excerpt: "Keeping your service up-to-date",
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
            title: "Function pipelines",
            href: "function-pipelines",
            excerpt:
              "Use functional programming to simplify complex SQL queries",
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
            title: "Statistical aggregates",
            href: "stats-aggs",
            excerpt:
              "Calculate descriptive statistics and models, including averages, standard deviation, linear regression, and more",
          },
          {
            title: "Gapfilling and interpolation",
            href: "gapfilling-interpolation",
            type: "directory",
            excerpt: "Fill in data collected at irregular time intervals",
            children: [
              {
                title: "Time bucket gapfill",
                href: "time-bucket-gapfill",
                excerpt:
                  "Learn about the time bucket gapfillling hyperfunction",
              },
              {
                title: "Last observation carried forward",
                href: "locf",
                excerpt: "Learn about the locf hyperfunction",
              },
            ],
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
            title: "Heartbeat aggregation",
            href: "heartbeat-agg",
            excerpt:
              "Build a model of system health from a series of health check timestamps",
          },
          {
            title: "Troubleshoot hyperfunctions",
            href: "troubleshooting",
            type: "placeholder",
          },
        ],
      },
      {
        title: "Data tiering",
        href: "data-tiering",
        excerpt: "Tier older data to save storage costs",
        children: [
          {
            title: "About data tiering",
            href: "about-data-tiering",
            excerpt:
              "Save on storage costs by tiering older data to separate storage",
          },
          {
            title: "Tier data",
            href: "tier-data-object-storage",
            excerpt: "How to tier Timescale data to object storage",
          },
          {
            title: "Untier data",
            href: "untier-data",
            excerpt: "How to untier Timescale data",
          },
        ],
      },
      {
        title: "Security",
        href: "security",
        excerpt: "Learn how your Timescale instance is secured",
        children: [
          {
            title: "Security overview",
            href: "overview",
            excerpt: "Get an overview of Timescale security",
          },
          {
            title: "Multi-factor Authentication",
            href: "multi-factor-authentication",
            excerpt: "Multi-factor authentication for your Timescale account",
          },
          {
            title: "Client credentials",
            href: "client-credentials",
            excerpt: "Client credentials to programmatically access your Timescale account",
          },
          {
            title: "Read only role",
            href: "read-only-role",
            excerpt: "Create a read-only role to access your database",
          },
          {
            title: "Connect with a stricter SSL mode",
            href: "strict-ssl",
            excerpt:
              "Connect to Timescale with a stricter SSL mode of verify-ca or verify-full",
          },
        ],
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
    ],
  },
];
