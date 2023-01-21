module.exports = [
  {
    title: "Timescale Cloud",
    filePath: "index.md",
    href: "cloud",
    name: "About Timescale Cloud",
    excerpt:
      "Cloud-native TimescaleDB as a service, including all the features of TimescaleDB without the hassle of managing your database",
    children: [
      {
        title: "Find docs by UI section",
        href: "ui",
        type: "placeholder",
        excerpt:
          "Looking for help with a specific section of the Timescale Cloud user interface? Browse the docs organized by UI section.",
      },
      {
        title: "Create a service",
        href: "create",
        excerpt: "Get started with Timescale Cloud by creating a service",
        children: [
          {
            title: "Create a service",
            href: "create-a-service",
            excerpt: "Create a Timescale Cloud service",
          },
          {
            title: "Create a service demo",
            href: "create-a-service-demo",
            excerpt: "Create a Timescale Cloud service with demo data",
          },
        ],
      },
      {
        title: "Migrate a TimescaleDB database to Cloud",
        href: "migrate-to-cloud",
        excerpt: "Migrate a TimescaleDB database to Timescale Cloud",
        children: [
          {
            title: "Migrate the entire database at once",
            href: "entire-database",
            excerpt:
              "Migrate an entire TimescaleDB database to Timescale Cloud",
          },
          {
            title: "Migrate schema and data separately",
            href: "schema-then-data",
            excerpt:
              "Migrate a TimescaleDB database schema to Timescale Cloud ",
          },
        ],
      },
      {
        title: "Service explorer",
        href: "service-explorer",
        excerpt:
          "Explore your database and tables with the Timescale Cloud Service Explorer",
      },
      {
        title: "Members",
        href: "members",
        excerpt: "Timescale Cloud members",
        children: [
          {
            title: "Members list",
            href: "members-list",
            excerpt: "Timescale Cloud members list",
          },
        ],
      },
      {
        title: "Autoscaling",
        href: "autoscaling",
        excerpt:
          "Automatically resize compute and storage for your Timescale Cloud service",
      },
      {
        title: "Data tiering",
        href: "data-tiering",
        excerpt:
          "Save on storage costs by tiering older data to separate storage",
        children: [
          {
            title: "Tier data to object storage",
            href: "tier-data-object-storage",
            excerpt: "How to tier Timescale Cloud data to object storage",
          },
        ],
      },
      {
        title: "Integrations",
        href: "integrations",
        excerpt: "Export telemetry data to a third-party monitoring service",
      },
      {
        title: "High availability",
        href: "high-availability",
        excerpt: "Timescale Cloud high availability",
        children: [
          {
            title: "Replicas",
            href: "replicas",
            excerpt: "Set up a replica on your Timescale Cloud service",
          },
        ],
      },
      {
        title: "Multi-node",
        href: "cloud-multi-node",
        excerpt: "Timescale Cloud Multi-node",
      },
      {
        title: "VPC",
        href: "vpc",
        excerpt:
          "Set up a Timescale Cloud service for secure connections over VPC",
      },
      {
        title: "Metrics and logs",
        href: "metrics-logs",
        excerpt: "View metrics and logs for your Timescale Cloud service",
        children: [
          {
            title: "Metrics",
            href: "metrics",
            excerpt: "View metrics for your Timescale Cloud service",
          },
          {
            title: "Logging",
            href: "logging",
            excerpt: "View logs for your Timescale Cloud service",
          },
        ],
      },
      {
        title: "Billing",
        href: "billing",
        excerpt: "Timescale Cloud billing",
        children: [
          {
            title: "Account management",
            href: "account-management",
            excerpt: "Timescale Cloud account management",
          },
        ],
      },
      {
        title: "Resources and configuration",
        href: "configuration",
        excerpt:
          "Manage your service resources and configure database parameters",
        children: [
          {
            title: "Manage service",
            href: "service-management",
            excerpt:
              "Fork, pause, or delete your service, or reset your service password",
          },
          {
            title: "Service resources",
            href: "resources",
            excerpt: "Manage your service's compute, storage, and memory",
          },
          {
            title: "Customize service configuration",
            href: "customize-configuration",
            excerpt: "Customize the configuration of your database",
          },
          {
            title: "Advanced parameters",
            href: "advanced-parameters",
            excerpt: "Change advanced configuration parameters",
          },
        ],
      },
      {
        title: "PostgreSQL extensions",
        href: "postgresql-extensions",
        excerpt: "Timescale Cloud PostgreSQL extensions",
      },
      {
        title: "Backup and restore",
        href: "backup-restore-cloud",
        excerpt: "Timescale Cloud backup and restore",
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
        title: "Troubleshooting",
        href: "troubleshooting",
        type: "placeholder",
        excerpt:
          "Troubleshoot common problems experienced with Timescale Cloud",
      },
    ],
  },
];
