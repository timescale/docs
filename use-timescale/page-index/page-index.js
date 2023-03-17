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
        excerpt: "Timescale Cloud services",
        children: [
          {
            title: "Create a Timescale service",
            href: "create-a-service",
            excerpt: "Timescale Cloud services",
          },
          {
            title: "Create a PostgreSQL service",
            href: "create-a-pg-service",
            excerpt: "PostgreSQL services",
          },
          {
            title: "Service overview",
            href: "service-overview",
            excerpt: "Timescale Cloud services overview",
          },
          {
            title: "Service explorer",
            href: "service-explorer",
            excerpt: "Timescale Cloud services explorer",
          },
          {
            title: "Resources",
            href: "resources",
            excerpt: "Timescale Cloud services operations, Resources tab",
          },
          {
            title: "Autoscale",
            href: "autoscaling",
            excerpt: "Timescale Cloud services operations, Autoscaling tab",
          },
          {
            title: "Replication",
            href: "replicas",
            excerpt: "Timescale Cloud services operations, Replicas tab",
          },
          {
            title: "Maintenance",
            href: "maintenance",
            excerpt: "Timescale Cloud services operations, Maintenance tab",
          },
          {
            title: "Service management",
            href: "service-management",
            excerpt:
              "Timescale Cloud services operations, Service management tab",
          },
          {
            title: "Multi-factor Authentication",
            href: "multi-factor-authentication",
            excerpt: "Multi-factor authentication for Timescale Cloud account",
          },
          {
            title: "PostgreSQL extensions",
            href: "postgresql-extensions",
            excerpt: "Timescale Cloud PostgreSQL extensions",
          },
        ],
      },
      {
        title: "Connecting to Timescale",
        href: "connecting",
        excerpt: "Connect to Timescale",
        children: [
          {
            title: "About connecting to Timescale",
            href: "about-connecting",
            excerpt: "Learn about connecting to Timescale",
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
            title: "Install pgAdmin",
            href: "pgadmin",
            excerpt: "Install pgAdmin to connect to Timescale",
          },
          {
            title: "Troubleshooting Timescale connections",
            href: "troubleshooting",
            type: "placeholder",
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
        title: "Distributed hypertables",
        href: "distributed-hypertables",
        excerpt: "Distributed hypertables for multi-node Timescale",
        children: [
          {
            title: "About distributed hypertables",
            href: "about-distributed-hypertables",
            excerpt: "Learn about distributed hypertables",
          },
          {
            title: "Create distributed hypertables",
            href: "create-distributed-hypertables",
            excerpt: "Create a distributed hypertable",
          },
          {
            title: "Insert data",
            href: "insert",
            excerpt: "Insert data into a distributed hypertable",
          },
          {
            title: "Query data",
            href: "query",
            excerpt: "Query data in distributed hypertables",
          },
          {
            title: "Alter and drop distributed hypertables",
            href: "alter-drop-distributed-hypertables",
            excerpt: "Alter schema for and drop distributed hypertables",
          },
          {
            title: "Create foreign keys on distributed hypertables",
            href: "foreign-keys",
            excerpt:
              "Create foreign keys from distributed hypertables to other tables",
          },
          {
            title: "Use triggers in distributed hypertables",
            href: "triggers",
            excerpt:
              "Use row- and statement-level triggers in distributed hypertables",
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
        title: "Data migration",
        href: "migrate-data",
        excerpt: "Migrate your data into Timescale",
        children: [
          {
            title: "About data migration",
            href: "about-migrate-data",
            excerpt:
              "Learn different ways of migrating your existing data into Timescale",
          },
          {
            title: "Migrate with Hypershift",
            href: "hypershift",
            excerpt:
              "Migrate an existing PostgreSQL database to Timescale Cloud in a single step with Hypershift",
          },
          {
            title: "Migrate from the same database",
            href: "same-db",
            excerpt: "Migrate data from the same PostgreSQL database",
          },
          {
            title: "Migrate from a different database",
            href: "different-db",
            excerpt: "Migrate data from a different PostgreSQL database",
          },
          {
            title: "Import from CSV",
            href: "import-csv",
            excerpt: "Migrate data from a .csv file",
          },
          {
            title: "Migrate InfluxDB data",
            href: "migrate-influxdb",
            excerpt: "Migrate data from an existing InfluxDB database",
          },
          {
            title: "Migrate the entire database at once",
            href: "entire-database",
            excerpt: "Migrate an entire Timescale database to Timescale Cloud",
          },
          {
            title: "Migrate schema and data separately",
            href: "schema-then-data",
            excerpt: "Migrate a Timescale database schema to Timescale Cloud ",
          },
          {
            title: "Troubleshoot data migration",
            href: "troubleshooting",
            type: "placeholder",
            excerpt: "Troubleshoot problems that occur during  data migration",
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
            title: "Ingesting data with Telegraf",
            href: "ingest-telegraf",
            excerpt: "Ingest data into Timescale from Telegraf",
          },
          {
            title: "Install and use timescaledb-parallel-copy",
            href: "about-timescaledb-parallel-copy",
            excerpt:
              "Quickly insert bulk data by parallelizing `COPY` operations",
          },
          {
            title: "Ingesting data with Timescale parallel copy",
            href: "ingest-parallel-copy",
            excerpt: "Ingest data into Timescale using parallel copy",
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
            excerpt: "Customize your Timescale Cloud database configuration",
          },
          {
            title: "Advanced parameters",
            href: "advanced-parameters",
            excerpt:
              "Configure advanced database parameters for your Timescale Cloud service",
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
            title: "Manage storage using tablespaces",
            href: "manage-storage",
            excerpt: "Manage storage by moving data between tablespaces",
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
            excerpt: "About data compression",
          },
          {
            title: "Manually compress chunks",
            href: "manually-compress-chunks",
            excerpt: "Manually compress data chunks",
          },
          {
            title: "Decompress chunks",
            href: "decompress-chunks",
            excerpt: "Manually decompress data chunks",
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
        excerpt: "Timescale Cloud services operations, VPC tab",
      },
      {
        title: "Backup and restore",
        href: "backup-restore-cloud",
        excerpt: "Timescale Cloud backup and restore",
      },
      {
        title: "Billing and account management",
        href: "account-management",
        excerpt: "Timescale Cloud account management",
      },
      {
        title: "Metrics and logging",
        href: "metrics-logging",
        excerpt: "Timescale Cloud metrics and logging",
        children: [
          {
            title: "Service metrics",
            href: "service-metrics",
            excerpt: "Timescale Cloud services metrics",
          },
          {
            title: "Service logs",
            href: "service-logs",
            excerpt: "Timescale Cloud services logs",
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
        excerpt: "Timescale Cloud user management",
        children: [
          {
            title: "Members list",
            href: "members-list",
            excerpt: "Timescale Cloud members list",
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
            title: "Install and update Timescale Toolkit",
            href: "install-toolkit",
            excerpt: "Install and update the Timescale Toolkit",
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
            title: "Troubleshoot hyperfunctions",
            href: "troubleshooting",
            type: "placeholder",
          },
        ],
      },
      {
        title: "Multi-node",
        href: "cloud-multi-node",
        excerpt: "Timescale Cloud Multi-node",
      },
      {
        title: "High availability",
        href: "high-availability",
        excerpt: "Timescale Cloud high availabilioty",
      },
      {
        title: "Data tiering to object storage",
        href: "tier-data-object-storage",
        excerpt:
          "Save on storage costs by tiering older data to separate storage",
      },
      {
        title: "Security",
        href: "security",
        excerpt: "Learn how your Timescale Cloud instance is secured",
        children: [
          {
            title: "Security overview",
            href: "overview",
            excerpt: "Get an overview of Timescale Cloud security",
          },
          {
            title: "Connect with a stricter SSL mode",
            href: "strict-ssl",
            excerpt:
              "Connect to Timescale Cloud with a stricter SSL mode of verify-ca or verify-full",
          },
        ],
      },
      {
        title: "Troubleshoot Timescale",
        href: "troubleshoot-timescaledb",
        excerpt: "Troubleshooting Timescale",
      },
    ],
  },
];
