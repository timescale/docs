module.exports = [
  {
    title: "Use TigerData products",
    href: "use-timescale",
    defaultOpen: true,
    filePath: "index.md",
    pageComponents: ["content-list"],
    excerpt:
      "How to connect to Tiger, administer, and configure the database.",
    children: [
      {
        title: "Hypertables",
        href: "hypertables",
        children: [
          {
            title: "Optimize time-series data in hypertables",
            href: "hypertable-crud",
            excerpt: "Create hypertables",
          },
          {
            title: "Improve hypertable and query performance",
            href: "improve-query-performance",
            excerpt: "Tune hypertables to increase performance",
          },
          {
            title: "Enforce constraints with unique indexes",
            href: "hypertables-and-unique-indexes",
            excerpt: "Create hypertables with unique indexes",
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
        title: "Hypercore",
        href: "hypercore",
        excerpt:
          "Seamlessly switch between row-oriented and column-oriented storage",
        children: [
          {
            title: "Optimize your data for real-time analytics",
            href: "real-time-analytics-in-hypercore",
            excerpt: "Automate",
          },
          {
            title: "Improve query and upsert performance",
            href: "secondary-indexes",
            excerpt: "Automate",
          },
           {
             title: "Compression methods in hypercore",
             href: "compression-methods",
             excerpt: "Learn about the different compression methods",
           },
          {
            title: "Troubleshoot hypercore",
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
            title: "Create a continuous aggregate",
            href: "create-a-continuous-aggregate",
            excerpt: "Create continuous aggregates",
          },
          {
            title: "Hierarchical continuous aggregates",
            href: "hierarchical-continuous-aggregates",
          },
          {
            title: "Refresh continuous aggregates",
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
            title: "Time and continuous aggregates",
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
            title: "Real-time aggregates",
            href: "real-time-aggregates",
            excerpt: "Manage real time aggregates in continuous aggregates",
          },
          {
            title: "Convert continuous aggregates to the columnstore",
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
        title: "Tiger regions",
        href: "regions",
        excerpt: "Tiger AWS regions",
      },
      {
        title: "Tiger services",
        href: "services",
        excerpt: "About Tiger services",
        children: [
          {
            title: "Services overview",
            href: "service-overview",
            excerpt: "Tiger services overview",
          },
          {
            title: "Service explorer",
            href: "service-explorer",
            excerpt: "Tiger services explorer",
          },
          {
            title: "Service management",
            href: "service-management",
            excerpt: "Tiger services operations, Service management tab",
          },
          {
            title: "Manually change resources",
            href: "change-resources",
            excerpt: "Manually adjust your service resources",
          },
          {
            title: "Connection pooling",
            href: "connection-pooling",
            excerpt: "Using a connection pool with your Tiger services",
          },
          {
            title: "Troubleshooting Tiger services",
            href: "troubleshooting",
            type: "placeholder",
          },
        ],
      },
      {
        title: "Write data",
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
        title: "Query data",
        href: "query-data",
        children: [
          {
            title: "About querying data",
            href: "about-query-data",
            excerpt: "Learn how to query data in Tiger",
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
          {
            title: "Troubleshoot problems with time buckets",
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
            title: "Indexing data",
            href: "indexing",
            excerpt: "Create an index on a hypertable",
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
            title: "Foreign data wrappers",
            href: "foreign-data-wrappers",
          },
          {
            title: "Troubleshoot schema management",
            href: "troubleshooting",
            type: "placeholder",
          },
        ],
      },
      {
        title: "Configuration",
        href: "configuration",
        excerpt: "Configure your Tiger service",
        children: [
          {
            title: "About Configuration",
            href: "about-configuration",
            excerpt:
              "Overview of configuration options and methods for Postgres and Tiger",
          },
          {
            title: "Customize configuration",
            href: "customize-configuration",
            excerpt: "Customize your Tiger database configuration",
          },
          {
            title: "Advanced parameters",
            href: "advanced-parameters",
            excerpt:
              "Configure advanced database parameters for your Tiger service",
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
        excerpt: "Configure alerting in Tiger",
      },
      {
        title: "Data retention",
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
        title: "Storage",
        href: "data-tiering",
        excerpt:
          "Save on storage costs by tiering older data to a low-cost bottomless object storage tier",
        children: [
          {
            title: "About storage tiers",
            href: "about-data-tiering",
            excerpt:
              "Learn how the object storage tier helps you save on storage costs",
          },
          {
            title: "Manage tiering",
            href: "enabling-data-tiering",
            excerpt: "How to enable the object storage tier",
          },
          {
            title: "Querying tiered data",
            href: "querying-tiered-data",
            excerpt: "How to query tiered data",
          },
          {
            title: "Replicas and forks with tiered data",
            href: "tiered-data-replicas-forks",
            excerpt: "How tiered data works on replicas and forks",
          },
          {
            title: "Troubleshooting",
            href: "troubleshooting",
            type: "placeholder",
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
              "Learn about TimescaleDB hyperfunctions for additional analysis",
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
            excerpt: "Calculate statistics from gauges and counters",
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
        title: "Metrics and logging",
        href: "metrics-logging",
        excerpt: "Tiger metrics and logging",
        children: [
          {
            title: "Monitor Tiger services",
            href: "monitoring",
            excerpt: "Tiger service monitoring",
          },
          {
            title: "Export to Amazon Cloudwatch",
            href: "aws-cloudwatch",
            excerpt: "Export telemetry data to Amazon Cloudwatch",
          },
          {
            title: "Export to Datadog",
            href: "datadog",
            excerpt: "Export telemetry data to Datadog",
          },
          {
            title: "Export to Prometheus",
            href: "metrics-to-prometheus",
            excerpt: "Export telemetry data to Prometheus",
          },
        ],
      },
      {
        title: "High availability and read scaling",
        href: "ha-replicas",
        excerpt: "Tiger high availability and read scaling",
        children: [
          {
            title: "Manage high availability",
            href: "high-availability",
            excerpt: "Set up HA replicas on Tiger for high availability",
          },
          {
            title: "Read scaling",
            href: "read-scaling",
            excerpt: "Understand how read scaling works in Tiger",
          },
        ],
      },
      {
        title: "Maintenance and upgrades",
        href: "upgrades",
        excerpt: "Keep your Tiger service up-to-date",
      },
      {
        title: "Tiger Postgres extensions",
        href: "extensions",
        excerpt: "The Postgres extensions installed in each Tiger service",
        children: [
          {
            title: "Create a chatbot using pgvector",
            href: "pgvector",
            excerpt: "Using the pgvector Postgres extension",
          },
          {
            title: "Encrypt data using pgcrypto",
            href: "pgcrypto",
            excerpt: "Using the pgcrypto Postgres extension",
          },
          {
            title: "Analyse geospatial data using postgis",
            href: "postgis",
            excerpt: "Using the postgis Postgres extension",
          },
        ],
      },
      {
        title: "Back up and recover your services",
        href: "backup-restore",
      },
      {
        title: "Jobs",
        href: "jobs",
        children: [
          {
            title: "Create and manage jobs",
            href: "create-and-manage-jobs",
            excerpt: "Create, test, alter, and delete jobs",
          },
          {
            title: "Use a job for generic retention",
            href: "example-generic-retention",
            excerpt: "A job example for a retention policy",
          },
          {
            title: "Use a job for tablespace management",
            href: "example-tiered-storage",
            excerpt:
              "A job example for automatically moving chunks between tablespaces",
          },
          {
            title: "Use a job for downsampling and compression",
            href: "example-downsample-and-compress",
            excerpt: "A job example for downsampling and compressing data",
          },
          {
            title: "Troubleshooting",
            href: "troubleshooting",
            type: "placeholder",
          },
        ],
      },
      {
        title: "Security",
        href: "security",
        excerpt: "Learn how your Tiger instance is secured",
        children: [
          {
            title: "Security overview",
            href: "overview",
            excerpt: "Get an overview of Tiger security",
          },
          {
            title: "Control user access to projects",
            href: "members",
            excerpt: "Project and user role management in Tiger",
          },
          {
            title: "Manage data security in your service",
            href: "read-only-role",
            excerpt: "Restrict access to your data with roles",
          },
          {
            title: "SAML authentication",
            href: "saml",
            excerpt: "SAML / SSO authentication for your Tiger account",
          },
          {
            title: "Multi-factor authentication",
            href: "multi-factor-authentication",
            excerpt: "Multi-factor authentication for your Tiger account",
          },
          {
            title: "Client credentials",
            href: "client-credentials",
            excerpt:
              "Client credentials to programmatically access your Tiger account",
          },
          {
            title: "Connect with a stricter SSL mode",
            href: "strict-ssl",
            excerpt:
              "Connect to Tiger with a stricter SSL mode of verify-ca or verify-full",
          },
          {
            title: "Connect securely from any cloud",
            href: "transit-gateway",
            excerpt:
              "Peer your Tiger service with AWS Transit Gateway",
          },
          {
            title: "VPC peering and AWS PrivateLink",
            href: "vpc",
            excerpt:
              "Secure your Tiger services with VPC peering and AWS PrivateLink",
          },
          {
            title: "IP allow list",
            href: "ip-allow-list",
            excerpt:
              "Create a list of IP addresses that can access your services",
          },
        ],
      },
      {
        title: "Limitations",
        href: "limitations",
        excerpt: "Current limitations of TigerData product features",
      },
      {
        title: "Integrate data lakes with Tiger",
        href: "tigerlake",
        excerpt: "Unifies the Tiger operational architecture with the data lake (S3 + Iceberg) architectures",
      },
      {
        title: "Troubleshoot TigerData products",
        href: "troubleshoot-timescaledb",
        excerpt: "Troubleshooting Tiger and TimescaleDB",
      },
      {
        title: "Compression (Old API, replaced by hypercore)",
        href: "compression",
        children: [
          {
            title: "About compression",
            href: "about-compression",
            excerpt: "Learn about how compression works",
          },
          {
            title: "Compression design",
            href: "compression-design",
            excerpt: "How compression is designed in TimescaleDB",
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
            title: "Compress continuous aggregates",
            href: "compression-on-continuous-aggregates",
            excerpt: "Compress continuous aggregates",
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
            title: "Modify a schema",
            href: "modify-a-schema",
            excerpt: "Change the data schema in compressed chunks",
          },
        ],
      },
    ],
  },
];
