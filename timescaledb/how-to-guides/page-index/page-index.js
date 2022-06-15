module.exports = [
  {
    title: "How-to Guides",
    href: "how-to-guides",
    pageComponents: ["content-list"],
    tags: ["timescaledb", "overview", "get started", "contribute"],
    keywords: ["connect", "write data", "query data", "alerts"],
    excerpt: "How to connect to TimescaleDB, and administer and configure the database.",
    children: [
      {
        title: "Connecting to TimescaleDB",
        href: "connecting",
        tags: ["connect", "psql", "install", "timescaledb"],
        keywords: ["TimescaleDB", "connect", "psql"],
        excerpt: "Connect to TimescaleDB",
        children: [
          {
            title: "About connecting to TimescaleDB",
            href: "about-connecting",
            tags: ["connect", "psql", "learn", "timescaledb"],
            keywords: ["TimescaleDB", "connect"],
            excerpt: "Learn about connecting to TimescaleDB",
          },
          {
            title: "About psql",
            href: "about-psql",
            tags: ["connect", "psql", "learn", "timescaledb"],
            keywords: ["TimescaleDB", "connect", "psql"],
            excerpt: "Learn about using psql to connect to TimescaleDB",
          },
          {
            title: "Install psql",
            href: "psql",
            tags: ["connect", "psql", "install", "timescaledb"],
            keywords: ["TimescaleDB", "connect", "install", "psql"],
            excerpt: "Install psql to connect to TimescaleDB",
          },
          {
            title: "Install Azure Data Studio",
            href: "azure-data-studio",
            tags: ["connect", "install", "timescaledb"],
            keywords: ["TimescaleDB", "connect", "install"],
            excerpt: "Install Azure Data Studio to connect to TimescaleDB",
          },
          {
            title: "Install DBeaver",
            href: "dbeaver",
            tags: ["connect", "install", "timescaledb"],
            keywords: ["TimescaleDB", "connect", "install"],
            excerpt: "Install DBeaver to connect to TimescaleDB",
          },
          {
            title: "Install pgAdmin",
            href: "pgadmin",
            tags: ["connect", "install", "timescaledb"],
            keywords: ["TimescaleDB", "connect", "install"],
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
            tags: ["hypertables", "timescaledb"],
            keywords: ["hypertables", "TimescaleDB"],
            excerpt: "Learn about hypertables in TimescaleDB",
          },
          {
            title: "Create hypertables",
            href: "create",
            tags: ["hypertables", "create", "timescaledb"],
            keywords: ["hypertables", "TimescaleDB"],
            excerpt: "Create hypertables",
          },
          {
            title: "Change hypertable chunk intervals",
            href: "change-chunk-intervals",
            tags: ["hypertables", "chunks", "edit", "timescaledb"],
            keywords: ["hypertables", "TimescaleDB"],
            excerpt: "Change and view chunk time intervals for a hypertable",
          },
          {
            title: "Alter hypertables",
            href: "alter",
            tags: ["hypertables", "edit", "timescaledb"],
            keywords: ["hypertables", "TimescaleDB"],
            excerpt: "Alter hypertables",
          },
          {
            title: "Create unique indexes on hypertables",
            href: "hypertables-and-unique-indexes",
            tags: ["hypertables", "indexes", "create", "timescaledb"],
            keywords: ["hypertables", "TimescaleDB", "indexes"],
            excerpt: "Create hypertables with unique indexes",
          },
          {
            title: "Drop hypertables",
            href: "drop",
            tags: ["hypertables", "delete", "timescaledb"],
            keywords: ["hypertables", "TimescaleDB"],
            excerpt: "Drop hypertables",
          },
          {
            title: "Troubleshoot hypertables",
            href: "troubleshooting",
            tags: ["hypertables", "tshoot", "timescaledb"],
            keywords: ["hypertables", "troubleshooting", "TimescaleDB"],
            excerpt: "Troubleshooting and error fixes for hypertables",
          },
        ],
      },
      {
        title: "Distributed hypertables",
        href: "distributed-hypertables",
        tags: ["hypertables", "distributed", "timescaledb"],
        keywords: ["hypertables", "distributed", "TimescaleDB"],
        excerpt: "Distributed hypertables for multi-node TimescaleDB",
        children: [
          {
            title: "About distributed hypertables",
            href: "about-distributed-hypertables",
            tags: ["hypertables", "distributed", "timescaledb"],
            keywords: ["hypertables", "distributed", "TimescaleDB"],
            excerpt: "Learn about distributed hypertables",
          },
          {
            title: "Create distributed hypertables",
            href: "create-distributed-hypertables",
            tags: ["hypertables", "create", "distributed", "timescaledb"],
            keywords: ["hypertables", "distributed", "TimescaleDB"],
            excerpt: "Create a distributed hypertable",
          },
          {
            title: "Insert data",
            href: "insert",
            tags: ["hypertables", "ingest", "distributed", "timescaledb"],
            keywords: ["hypertables", "distributed", "TimescaleDB"],
            excerpt: "Insert data into a distributed hypertable",
          },
          {
            title: "Query data",
            href: "query",
            tags: ["query", "distributed", "hypertables", "timescaledb"],
            keywords: ["hypertables", "distributed", "TimescaleDB"],
            excerpt: "Query data in distributed hypertables",
          },
          {
            title: "Alter and drop distributed hypertables",
            href: "alter-drop-distributed-hypertables",
            tags: [
              "hypertables",
              "distributed",
              "edit",
              "delete",
              "timescaledb"
            ],
            keywords: ["hypertables", "distributed", "TimescaleDB"],
            excerpt: "Alter schema for and drop distributed hypertables"
          },
          {
            title: "Create foreign keys on distributed hypertables",
            href: "foreign-keys",
            tags: ["distributed", "hypertables", "timescaledb", "foreign keys"],
            keywords: ["hypertables", "distributed", "TimescaleDB"],
            excerpt:
              "Create foreign keys from distributed hypertables to other tables"
          },
          {
            title: "Use triggers in distributed hypertables",
            href: "triggers",
            tags: ["triggers", "distributed", "hypertables", "timescaledb"],
            keywords: ["hypertables", "distributed", "TimescaleDB"],
            excerpt:
              "Use row- and statement-level triggers in distributed hypertables",
          },
        ],
      },
      {
        title: "Time buckets",
        href: "time-buckets",
        tags: ["time bucket", "timescaledb"],
        keywords: ["time bucket", "TimescaleDB", "hyperfunction"],
        excerpt: "Aggregate data by time interval with time buckets",
        children: [
          {
            title: "About time buckets",
            href: "about-time-buckets",
            tags: ["time bucket", "timescaledb"],
            keywords: ["time bucket", "TimescaleDB", "hyperfunction"],
            excerpt: "Learn how time buckets work in TimescaleDB.",
          },
          {
            title: "Use time buckets to group time-series data",
            href: "use-time-buckets",
            tags: ["time bucket", "timescaledb"],
            keywords: ["time bucket", "TimescaleDB", "hyperfunctions"],
            excerpt: "How to group time series data with the time_bucket function."
          },
        ],
      },
      {
        href: "write-data",
        children: [
          {
            title: "About writing data",
            href: "about-writing-data",
            tags: ["hypertables", "timescaledb"],
            keywords: ["hypertables", "TimescaleDB"],
            excerpt: "Write data into hypertables",
          },
          {
            title: "Insert data",
            href: "insert",
            tags: ["hypertables", "ingest", "data", "timescaledb"],
            keywords: ["hypertables", "TimescaleDB"],
            excerpt: "Insert data into hypertables",
          },
          {
            title: "Update data",
            href: "update",
            tags: ["hypertables", "update", "data", "timescaledb"],
            keywords: ["hypertables", "TimescaleDB"],
            excerpt: "Update data in hypertables",
          },
          {
            title: "Upsert data",
            href: "upsert",
            tags: ["hypertables", "update", "data", "timescaledb"],
            keywords: ["hypertables", "TimescaleDB"],
            excerpt: "Upsert data into hypertables",
          },
          {
            title: "Delete data",
            href: "delete",
            tags: ["hypertables", "delete", "data", "timescaledb"],
            keywords: ["hypertables", "TimescaleDB"],
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
              "Learn different ways of migrating your existing data into TimescaleDB"
          },
          {
            title: "Migrate from the same database",
            href: "same-db",
            tags: ["migrate", "data", "postgresql", "timescaledb"],
            keywords: ["migrate", "data", "TimescaleDB"],
            excerpt: "Migrate data from the same PostgreSQL database",
          },
          {
            title: "Migrate from a different database",
            href: "different-db",
            tags: ["migrate", "data", "postgresql", "timescaledb"],
            keywords: ["migrate", "data", "TimescaleDB"],
            excerpt: "Migrate data from a different PostgreSQL database",
          },
          {
            title: "Import from CSV",
            href: "import-csv",
            tags: ["migrate", "data", "timescaledb"],
            keywords: ["migrate", "data", "TimescaleDB"],
            excerpt: "Migrate data from a .csv file",
          },
          {
            title: "Migrate InfluxDB data",
            href: "migrate-influxdb",
            tags: ["migrate", "data", "influxdb", "timescaledb"],
            keywords: ["migrate", "data", "influxdb", "TimescaleDB"],
            excerpt: "Migrate data from an existing InfluxDB database",
          },
          {
            title: "Troubleshoot data migration",
            href: "troubleshoot-data-migration",
            tags: ["troubleshooting", "migrate", "data", "timescaledb"],
            keywords: ["troubleshooting", "migrate", "data", "TimescaleDB"],
            excerpt: "Troubleshoot problems that occur during  data migration",
          }
        ],
      },
      {
        title: "Ingest data from other sources"
        href: "ingest-data",
        children: [
          {
            title: "About ingesting data"
            href: "about-ingesting"
            tags: ["ingest", "data", "timescaledb"],
            keywords: ["ingest", "timescaledb"],
            excerpt: "Ingest data into TimescaleDB from third-party sources",
          },
          {
            title: "Ingesting data with Prometheus"
            href: "ingest-prometheus"
            tags: ["ingest", "data", "prometheus", "promscale", "timescaledb"],
            keywords: ["ingest", "promscale", "timescaledb"],
            excerpt: "Ingest data into TimescaleDB from Prometheus",
          },
          {
            title: "Ingesting data with Kafka"
            href: "ingest-kafka"
            tags: ["ingest", "data", "kafka", "timescaledb"],
            keywords: ["ingest", "kafka", "timescaledb"],
            excerpt: "Ingest data into TimescaleDB from Kafka",
          },
          {
            title: "Ingesting data with Telegraf"
            href: "ingest-telegraf"
            tags: ["ingest", "data", "telegraf", "timescaledb"],
            keywords: ["ingest", "telegraf", "timescaledb"],
            excerpt: "Ingest data into TimescaleDB from Telegraf",
          },
          {
            title: "Ingesting data with TimescaleDB parallel copy"
            href: "ingest-parallel-copy"
            tags: ["ingest", "data", "timescaledb"],
            keywords: ["ingest", "timescaledb"],
            excerpt: "Ingest data into TimescaleDB using parallel copy",
          },
        ],
      },
      {
        href: "query-data",
        children: [
          {
            title: "SELECT",
            href: "select",
            tags: ["hypertables", "select", "data", "timescaledb"],
            keywords: ["hypertables", "TimescaleDB"],
            excerpt: "Select data in hypertables",
          },
          {
            title: "Advanced analytic queries",
            href: "advanced-analytic-queries",
            tags: [
              "hypertables",
              "analytics",
              "analyze",
              "query",
              "timescaledb",
            ],
            keywords: ["hypertables", "hyperfunctions", "TimescaleDB"],
            excerpt: "Use advanced analytics queries",
          },
          {
            title: "DISTINCT queries with SkipScan",
            href: "skipscan",
            tags: ["skipscan", "distinct", "query", "timescaledb"],
            keywords: ["SkipScan", "query", "timescaledb"],
            excerpt: "Get faster DISTINCT queries with SkipScan",
          },
        ],
      },
      {
        href: "configuration",
        children: [
          {
            title: "About Configuration",
            href: "about-configuration",
            tags: ["configure", "timescaledb"],
            keywords: ["configure", "timescaledb"],
            excerpt:
              "Overview of configuration options and methods for PostgreSQL and TimescaleDB",
          },
          {
            title: "Using timescaledb-tune",
            href: "timescaledb-tune",
            tags: ["configure", "timescaledb"],
            keywords: ["configure", "timescaledb"],
            excerpt: "Configure TimescaleDB using timescaledb-tune",
          },
          {
            title: "Manual PostgreSQL configuration",
            href: "postgres-config",
            tags: ["configure", "postgresql", "timescaledb"],
            keywords: ["configure", "postgresql", "timescaledb"],
            excerpt:
              "Configure TimescaleDB using the PostgreSQL configuration file",
          },
          {
            title: "TimescaleDB configuration",
            href: "timescaledb-config",
            tags: ["configure", "timescaledb"],
            keywords: ["configure", "timescaledb"],
            excerpt:
              "Configure TimescaleDB using TimescaleDB configuration parameters",
          },
          {
            title: "Docker configuration",
            href: "docker-config",
            tags: ["configure", "docker", "timescaledb"],
            keywords: ["configure", "docker", "timescaledb"],
            excerpt:
              "Configure TimescaleDB when running within a Docker container",
          },
          {
            title: "Telemetry",
            href: "telemetry",
            tags: ["configure", "telemetry", "timescaledb"],
            keywords: ["configure", "telemetry", "timescaledb"],
            excerpt: "Configure telemetry gathered by TimescaleDB",
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
            tags: ["schema", "hypertables", "learn", "timescaledb"],
            keywords: ["schema", "hypertables", "TimescaleDB"],
            excerpt: "About hypertable schemas",
          },
          {
            title: "About indexing",
            href: "about-indexing",
            tags: ["schema", "index", "hypertables", "learn", "timescaledb"],
            keywords: ["schema", "hypertables", "index", "TimescaleDB"],
            excerpt: "About schema indexes",
          },
          {
            title: "About tablespaces",
            href: "about-tablespaces",
            tags: ["schema", "hypertables", "learn", "timescaledb"],
            keywords: ["schema", "hypertables", "TimescaleDB"],
            excerpt: "About schema tablespaces",
          },
          {
            title: "About constraints",
            href: "about-constraints",
            tags: ["schema", "hypertables", "learn", "timescaledb"],
            keywords: ["schema", "hypertables", "TimescaleDB"],
            excerpt: "About schema constraints",
          },
          {
            title: "Alter hypertables",
            href: "alter",
            tags: ["schema", "hypertables", "edit", "timescaledb"],
            keywords: ["schema", "hypertables", "TimescaleDB"],
            excerpt: "Change the schema of a hypertable",
          },
          {
            title: "Index",
            href: "indexing",
            tags: ["schema", "hypertables", "index", "timescaledb"],
            keywords: ["schema", "hypertables", "index", "TimescaleDB"],
            excerpt: "Create an index on a hypertable",
          },
          {
            title: "Triggers",
            href: "triggers",
            tags: ["schema", "hypertables", "manage", "timescaledb"],
            keywords: ["schema", "hypertables", "TimescaleDB"],
            excerpt: "Create triggers on a hypertable",
          },
          {
            title: "JSON",
            href: "json",
            tags: ["schema", "hypertables", "json", "data", "timescaledb"],
            keywords: ["schema", "hypertables", "json", "TimescaleDB"],
            excerpt: "Using JSON data types in a hypertable",
          },
        ],
      },
      {
        href: "compression",
        children: [
          {
            title: "About compression",
            href: "about-compression",
            tags: ["compression", "chunks", "data", "timescaledb"],
            keywords: ["compression", "chunks", "TimescaleDB"],
            excerpt: "About data compression",
          },
          {
            title: "Manually compress chunks",
            href: "manually-compress-chunks",
            tags: ["compression", "chunks", "data", "timescaledb"],
            keywords: ["compression", "chunks", "TimescaleDB"],
            excerpt: "Manually compress data chunks",
          },
          {
            title: "Decompress chunks",
            href: "decompress-chunks",
            tags: ["compression", "chunks", "data", "timescaledb"],
            keywords: ["compression", "chunks", "TimescaleDB"],
            excerpt: "Manually decompress data chunks",
          },
          {
            title: "Backfill historical data",
            href: "backfill-historical-data",
            tags: ["compression", "chunks", "data", "timescaledb"],
            keywords: ["compression", "chunks", "TimescaleDB"],
            excerpt: "Backfill historical data to compressed chunks",
          },
          {
            title: "Modify a schema",
            href: "modify-a-schema",
            tags: ["compression", "chunks", "data", "timescaledb"],
            keywords: ["compression", "chunks", "TimescaleDB"],
            excerpt: "Change the data schema in compressed chunks",
          },
        ],
      },
      {
        href: "data-retention",
        tags: ["retention", "data", "timescaledb"],
        keywords: ["retention", "data", "TimescaleDB"],
        excerpt: "Drop data by time value either automatically or manually",
        children: [
          {
            title: "About data retention",
            href: "about-data-retention",
            tags: ["retention", "data", "timescaledb"],
            keywords: ["retention", "data", "TimescaleDB"],
            excerpt: "Learn about data retention in TimescaleDB",
          },
          {
            title: "About data retention with continuous aggregates",
            href: "data-retention-with-continuous-aggregates",
            tags: ["retention", "caggs", "data", "timescaledb"],
            keywords: ["retention", "data", "caggs", "TimescaleDB"],
            excerpt: "Using data retention policies with continuous aggregates",
          },
          {
            title: "Create a retention policy",
            href: "create-a-retention-policy",
            tags: ["retention", "data", "create", "timescaledb"],
            keywords: ["retention", "data", "TimescaleDB"],
            excerpt: "Create a data retention policy",
          },
          {
            title: "Manually drop chunks",
            href: "manually-drop-chunks",
            tags: ["retention", "data", "delete", "chunks", "timescaledb"],
            keywords: ["retention", "data", "TimescaleDB"],
            excerpt: "Manually drop chunks",
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
            tags: ["caggs", "timescaledb"],
            keywords: ["caggs", "TimescaleDB"],
            excerpt: "About continuous aggregates",
          },
          {
            title: "Create a continuous aggregate",
            href: "create-a-continuous-aggregate",
            tags: ["caggs", "create", "timescaledb"],
            keywords: ["caggs", "TimescaleDB"],
            excerpt: "Create continuous aggregates",
          },
          {
            title: "Refresh policies for continuous aggregates",
            href: "refresh-policies",
            tags: ["caggs", "manage", "timescaledb"],
            keywords: ["caggs", "TimescaleDB"],
            excerpt: "Manage refresh policies for continuous aggregates",
          },
          {
            title: "Create an index on a continuous aggregate",
            href: "create-index",
            tags: ["indexes", "caggs", "timescaledb"],
            keywords: ["indexes", "caggs", "TimescaleDB"],
            excerpt: "Manage automatic index creation and manually create additional indexes",
          },
          {
            title: "Time in continuous aggregates",
            href: "time",
            tags: ["caggs", "manage", "timescaledb"],
            keywords: ["caggs", "TimescaleDB"],
            excerpt: "Manage time in continuous aggregates",
          },
          {
            title: "Drop data from continuous aggregates",
            href: "drop-data",
            tags: ["caggs", "delete", "data", "timescaledb"],
            keywords: ["caggs", "TimescaleDB"],
            excerpt: "Drop data from continuous aggregates",
          },
          {
            title: "Manage materialized hypertables",
            href: "materialized-hypertables",
            tags: ["caggs", "hypertables", "manage", "timescaledb"],
            keywords: ["caggs", "TimescaleDB"],
            excerpt: "Manage materialized hypertables in continuous aggregates",
          },
          {
            title: "Real time aggregates",
            href: "real-time-aggregates",
            tags: ["caggs", "manage", "timescaledb"],
            keywords: ["caggs", "TimescaleDB"],
            excerpt: "Manage real time aggregates in continuous aggregates",
          },
          {
            title: "Compress continuous aggregates",
            href: "compression-on-continuous-aggregates",
            tags: ["caggs", "compression", "timescaledb"],
            keywords: ["caggs", "compression", "TimescaleDB"],
            excerpt: "Compress continuous aggregates",
          },
          {
            title: "Troubleshoot continuous aggregates",
            href: "troubleshooting",
            tags: ["caggs", "tshoot", "timescaledb"],
            keywords: ["caggs", "TimescaleDB"],
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
            tags: ["action", "timescaledb"],
            keywords: ["action", "TimescaleDB"],
            excerpt: "Learn about user-defined actions",
          },
          {
            title: "Create and register a user-defined action",
            href: "create-and-register",
            tags: ["action", "create", "timescaledb"],
            keywords: ["action", "TimescaleDB"],
            excerpt: "Create a user-defined action",
          },
          {
            title: "Test and debug a user-defined action",
            href: "test-and-debug",
            tags: ["action", "test", "timescaledb"],
            keywords: ["action", "TimescaleDB"],
            excerpt: "Test and debug user-defined actions",
          },
          {
            title: "Alter and delete a user-defined action",
            href: "alter-and-delete",
            tags: ["action", "edit", "delete", "timescaledb"],
            keywords: ["action", "TimescaleDB"],
            excerpt: "Edit and delete user-defined actions",
          },
          {
            title: "Use an action for generic retention",
            href: "example-generic-retention",
            tags: ["action", "example", "retention", "timescaledb"],
            keywords: ["action", "example", "TimescaleDB"],
            excerpt: "Example user-defined action for a retention policy",
          },
          {
            title: "Use an action for data tiering",
            href: "example-tiered-storage",
            tags: ["action", "example", "timescaledb"],
            keywords: ["action", "example", "TimescaleDB"],
            excerpt: "Example user-defined action for tiered storage",
          },
          {
            title: "Use an action for downsampling and compression",
            href: "example-downsample-and-compress",
            tags: ["action", "example", "compress", "timescaledb"],
            keywords: ["action", "example", "TimescaleDB"],
            excerpt: "Example user-defined action for downsample and compress",
          },
        ],
      },
      {
        title: "Alerting",
        href: "alerting",
        tags: ["alert", "configure", "timescaledb"],
        keywords: ["alert", "configure", "timescaledb"],
        excerpt: "Configure alerting within TimescaleDB",
      },
      {
        title: "Data tiering",
        href: "data-tiering",
        children: [
          {
            title: "About data tiering",
            href: "about-data-tiering",
            tags: ["tiering", "data", "timescaledb"],
            keywords: ["tiering", "data", "TimescaleDB"],
            excerpt: "Learn about data tiering",
          },
          {
            title: "Move data for data tiering",
            href: "move-data",
            tags: ["tiering", "data", "migrate", "chunks", "timescaledb"],
            keywords: ["tiering", "data", "TimescaleDB"],
            excerpt: "Move data with data tiering",
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
            tags: ["backup", "restore", "timescaledb"],
            keywords: ["backup", "TimescaleDB"],
            excerpt: "Backing up and restoring with the pg_dump and pg_restore",
          },
          {
            title: "Docker & WAL-E",
            href: "docker-and-wale",
            tags: ["backup", "restore", "timescaledb"],
            keywords: ["backup", "TimescaleDB"],
            excerpt: "Backing up and restoring with Docker and WAL-E",
          },
          {
            title: "Physical backups",
            href: "physical",
            tags: ["backup", "restore", "timescaledb"],
            keywords: ["backup", "TimescaleDB"],
            excerpt: "Backing up and restoring with physical backups",
          },
        ],
      },
      {
        title: "Update TimescaleDB",
        href: "update-timescaledb",
        children: [
          {
            title: "Update from TimescaleDB 1.x to 2.x",
            href: "update-timescaledb-2",
            tags: ["upgrade", "1-x", "2-x", "timescaledb"],
            keywords: ["upgrade", "1-x", "2-x", "TimescaleDB"],
            excerpt: "Upgrade from TimescaleDB 1.x to TimescaleDB 2.x",
          },
          {
            title: "Update using Docker",
            href: "updating-docker",
            tags: ["upgrade", "docker", "1-x", "2-x", "timescaledb"],
            keywords: ["upgrade", "docker", "1-x", "2-x", "TimescaleDB"],
            excerpt:
              "Upgrade from TimescaleDB 1.x to TimescaleDB 2.x using Docker",
          },
          {
            title: "Upgrade PostgreSQL",
            href: "upgrade-postgresql",
            tags: ["upgrade", "postregsql", "timescaledb"],
            keywords: ["upgrade", "postgresql", "TimescaleDB"],
            excerpt: "Upgrade the version of PostgreSQL used by TimescaleDB",
          },
          {
            title: "Downgrade TimescaleDB",
            href: "downgrade-timescaledb",
            tags: ["downgrade", "timescaledb"],
            keywords: ["TimescaleDB", "downgrade"],
            excerpt: "Downgrade a TimescaleDB version",
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
            tags: ["hyperfunctions", "toolkit", "timescaledb"],
            keywords: ["TimescaleDB", "hyperfunctions", "Toolkit"],
            excerpt:
              "Learn about TimescaleDB hyperfunctions for additional analysis",
          },
          {
            title: "Install and update TimescaleDB Toolkit",
            href: "install-toolkit",
            tags: [
              "toolkit",
              "install",
              "update",
              "hyperfunctions",
              "timescaledb"
            ],
            keywords: ["TimescaleDB", "install", "update", "Toolkit"],
            excerpt: "Install and update the TimescaleDB Toolkit",
          },
          {
            title: "Function pipelines",
            href: "function-pipelines",
            tags: ["toolkit", "hyperfunctions", "query", "timescaledb"],
            keywords: ["TimescaleDB", "hyperfunctions", "Toolkit"],
            excerpt: "Use functional programming to simplify complex SQL queries",
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
                keywords: ["TimescaleDB", "hyperfunctions", "Toolkit"],
                excerpt: "Learn about the hyperloglog hyperfunction",
              },
            ],
          },
          {
            title: "Statistical aggregates",
            href: "stats-aggs",
            tags: ["hyperfunctions", "toolkit", "query", "timescaledb"],
            keywords: ["TimescaleDB", "hyperfunctions", "Toolkit"],
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
                tags: ["hyperfunctions", "toolkit", "query", "timescaledb"],
                keywords: ["TimescaleDB", "hyperfunctions", "Toolkit"],
                excerpt:
                  "Learn about the time bucket gapfillling hyperfunction",
              },
              {
                title: "Last observation carried forward",
                href: "locf",
                tags: ["hyperfunctions", "toolkit", "query", "timescaledb"],
                keywords: ["TimescaleDB", "hyperfunctions", "Toolkit"],
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
                tags: ["hyperfunctions", "toolkit", "query", "timescaledb"],
                keywords: ["TimescaleDB", "hyperfunctions", "Toolkit"],
                excerpt: "Learn about the approximate percentile hyperfunction",
              },
              {
                title: "Advanced aggregation methods",
                href: "advanced-agg",
                tags: ["hyperfunctions", "toolkit", "query", "timescaledb"],
                keywords: ["TimescaleDB", "hyperfunctions", "Toolkit"],
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
                tags: ["hyperfunctions", "toolkit", "query", "timescaledb"],
                keywords: ["TimescaleDB", "hyperfunctions", "Toolkit"],
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
                tags: ["hyperfunctions", "toolkit", "query", "timescaledb"],
                keywords: ["TimescaleDB", "hyperfunctions", "Toolkit"],
                excerpt: "Learn about the time-weighted averages hyperfunction",
              },
            ],
          },
          {
            title: "Troubleshoot hyperfunctions",
            href: "troubleshoot-hyperfunctions",
            tags: ["hyperfunctions", "toolkit", "tshoot", "timescaledb"],
            keywords: [
              "TimescaleDB",
              "hyperfunctions",
              "Toolkit",
              "troubleshoot"
            ],
            excerpt: "Troubleshoot problems with hyperfunctions and TimescaleDB Toolkit",
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
            tags: ["multi-node", "distributed", "nodes"],
            keywords: ["multi-node"],
            excerpt: "Learn about multi-node environments",
          },
          {
            title: "Multi-node setup on TimescaleDB",
            href: "multinode-setup",
            tags: [
              "multi-node",
              "setup",
              "distributed",
              "nodes",
              "timescaledb",
            ],
            keywords: ["multi-node", "setup", "TimescaleDB"],
            excerpt: "Set up multi-node on self-hosted TimescaleDB",
          },
          {
            title: "Multi-node authentication",
            href: "multinode-auth",
            tags: [
              "multi-node",
              "authentication",
              "setup",
              "distributed",
              "nodes",
            ],
            keywords: ["multi-node", "setup", "authentication"],
            excerpt: "Set up multi-node authentication",
          },
          {
            title: "Configure multi-node",
            href: "multinode-config",
            tags: ["multi-node", "configure", "distributed", "nodes"],
            keywords: ["multi-node", "configure"],
            excerpt: "Configure a multi-node environment",
          },
          {
            title: "Multi-node administration",
            href: "multinode-administration",
            tags: ['multi-node', 'management', 'administration', 'distributed', 'nodes'],
            keywords: ['multi-node', 'management', 'administration'],
            excerpt: 'Administer a multi-node cluster'
          },
          {
            title: "Grow and shrink a multi-node cluster",
            href: "multinode-grow-shrink",
            tags: ["multi-node", "configure", "manage", "distributed", "nodes"],
            keywords: ["multi-node", "configure", "manage"],
            excerpt: "Grow and shrink a multi-node cluster",
          },
          {
            title: "High availability multi-node",
            href: "multinode-ha",
            tags: ["multi-node", "ha", "distributed", "nodes"],
            keywords: ["multi-node", "HA"],
            excerpt: "Highly available multi-node environments",
          },
          {
            title: "Multi-node maintenance",
            href: "multinode-maintenance",
            tags: ["multi-node", "maintain", "distributed", "nodes", "manage"],
            keywords: ["multi-node", "maintain"],
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
            tags: ["ha", "replicate", "timescaledb"],
            keywords: ["ha", "replicate", "TimescaleDB"],
            excerpt: "High availability in TimescaleDB",
          },
          {
            title: "Configure replication",
            href: "configure-replication",
            tags: ["ha", "replicate", "timescaledb"],
            keywords: ["replicate", "configure", "TimescaleDB"],
            excerpt: "Configure replication",
          }
        ],
      },
      {
        title: "Additional tooling",
        href: "tooling",
        tags: ["manage", "timescaledb"],
        keywords: ["manage", "timescaledb"],
        excerpt: "Additional tooling for managing TimescaleDB",
        children: [
          {
            title: "About timescaledb-tune",
            href: "about-timescaledb-tune",
            tags: ["manage", "timescaledb"],
            keywords: ["manage", "timescaledb"],
            excerpt: "Automatically configure your TimescaleDB instance with `timescaledb-tune`",
          },
          {
            title: "About timescaledb-parallel-copy",
            href: "about-timescaledb-parallel-copy",
            tags: ["manage", "timescaledb"],
            keywords: ["manage", "timescaledb"],
            excerpt: "Quickly insert bulk data by parallelizing `COPY` operations",
          },
        ]
      },
      {
        title: "Troubleshoot TimescaleDB",
        href: "troubleshoot-timescaledb",
        tags: ["tshoot", "timescaledb"],
        keywords: ["troubleshoot", "timescaledb"],
        excerpt: "Troubleshooting TimescaleDB",
      },
    ],
  },
];
