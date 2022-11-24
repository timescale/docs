module.exports = [
  {
    title: "How-to Guides",
    href: "how-to-guides",
    pageComponents: ["content-list"],
    excerpt:
      "How to connect to TimescaleDB, and administer and configure the database.",
    children: [
      {
        title: "Connecting to TimescaleDB",
        href: "connecting",
        excerpt: "Connect to TimescaleDB",
        children: [
          {
            title: "About connecting to TimescaleDB",
            href: "about-connecting",
            excerpt: "Learn about connecting to TimescaleDB",
          },
          {
            title: "About psql",
            href: "about-psql",
            excerpt: "Learn about using psql to connect to TimescaleDB",
          },
          {
            title: "Install psql",
            href: "psql",
            excerpt: "Install psql to connect to TimescaleDB",
          },
          {
            title: "Connect using Azure Data Studio",
            href: "azure-data-studio",
            excerpt: "Install Azure Data Studio to connect to TimescaleDB",
          },
          {
            title: "Connect using DBeaver",
            href: "dbeaver",
            excerpt: "Install DBeaver to connect to TimescaleDB",
          },
          {
            title: "Install pgAdmin",
            href: "pgadmin",
            excerpt: "Install pgAdmin to connect to TimescaleDB",
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
            excerpt: "Learn about hypertables in TimescaleDB",
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
        excerpt: "Distributed hypertables for multi-node TimescaleDB",
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
            excerpt: "Learn how time buckets work in TimescaleDB.",
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
        excerpt: "Migrate your data into TimescaleDB",
        children: [
          {
            title: "About data migration",
            href: "about-migrate-data",
            excerpt:
              "Learn different ways of migrating your existing data into TimescaleDB",
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
            excerpt: "Ingest data into TimescaleDB from third-party sources",
          },
          {
            title: "Ingesting data with Prometheus",
            href: "ingest-prometheus",
            excerpt: "Ingest data into TimescaleDB from Prometheus",
          },
          {
            title: "Ingesting data with Kafka",
            href: "ingest-kafka",
            excerpt: "Ingest data into TimescaleDB from Kafka",
          },
          {
            title: "Ingesting data with Telegraf",
            href: "ingest-telegraf",
            excerpt: "Ingest data into TimescaleDB from Telegraf",
          },
          {
            title: "Ingesting data with TimescaleDB parallel copy",
            href: "ingest-parallel-copy",
            excerpt: "Ingest data into TimescaleDB using parallel copy",
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
            excerpt: "Learn how to query data in TimescaleDB",
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
            excerpt: "Learn about data retention in TimescaleDB",
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
              "Migrate old continuous aggregates to the new form introduced in TimescaleDB 2.7",
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
        excerpt: "Configure alerting within TimescaleDB",
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
        title: "Hyperfunctions",
        href: "hyperfunctions",
        pageComponents: ["featured-cards"],
        featuredChildren: [
          "/timescaledb/:currentVersion:/how-to-guides/hyperfunctions/function-pipelines",
          "/timescaledb/:currentVersion:/how-to-guides/hyperfunctions/approx-count-distincts",
          "/timescaledb/:currentVersion:/how-to-guides/hyperfunctions/stats-aggs",
          "/timescaledb/:currentVersion:/how-to-guides/hyperfunctions/gapfilling-interpolation",
          "/timescaledb/:currentVersion:/how-to-guides/hyperfunctions/percentile-approx",
          "/timescaledb/:currentVersion:/how-to-guides/hyperfunctions/counter-aggregation",
          "/timescaledb/:currentVersion:/how-to-guides/hyperfunctions/time-weighted-averages",
        ],
        children: [
          {
            title: "About hyperfunctions",
            href: "about-hyperfunctions",
            excerpt:
              "Learn about TimescaleDB hyperfunctions for additional analysis",
          },
          {
            title: "Install and update TimescaleDB Toolkit",
            href: "install-toolkit",
            excerpt: "Install and update the TimescaleDB Toolkit",
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
          {
            title: "About timescaledb-parallel-copy",
            href: "about-timescaledb-parallel-copy",
            excerpt:
              "Quickly insert bulk data by parallelizing `COPY` operations",
          },
        ],
      },
      {
        title: "Uninstall TimescaleDB",
        href: "uninstall-timescaledb",
        excerpt: "Uninstalling TimescaleDB",
      },
      {
        title: "Troubleshoot TimescaleDB",
        href: "troubleshoot-timescaledb",
        excerpt: "Troubleshooting TimescaleDB",
      },
    ],
  },
];
