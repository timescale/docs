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
        title: "Services",
        href: "services",
        excerpt: "Timescale Cloud services",
        children: [
          {
            title: "Create a TimescaleDB service",
            href: "create-a-service",
            excerpt: "Timescale Cloud services",
          },
          {
            title: "Create a PostgreSQL service",
            href: "create-a-pg-service",
            excerpt: "PostgreSQL services",
          },
        ],
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
        title: "Service operations",
        href: "service-operations",
        excerpt: "Timescale Cloud services operations",
        children: [
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
            title: "VPC",
            href: "vpc",
            excerpt: "Timescale Cloud services operations, VPC tab",
          },
          {
            title: "Service management",
            href: "service-management",
            excerpt:
              "Timescale Cloud services operations, Service management tab",
          },
          {
            title: "Database parameters",
            href: "database-parameters",
            excerpt:
              "Timescale Cloud services operations, Database parameters tab",
            children: [
              {
                title: "Customize configuration",
                href: "customize-configuration",
                excerpt:
                  "Customize your Timescale Cloud database configuration",
              },
              {
                title: "Advanced parameters",
                href: "advanced-parameters",
                excerpt:
                  "Configure advanced database parameters for your Timescale Cloud service",
              },
            ],
          },
        ],
      },
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
        title: "Integrations",
        href: "integrations",
        excerpt: "Export telemetry data to a third-party monitoring service",
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
        title: "Multi-node",
        href: "cloud-multi-node",
        excerpt: "Timescale Cloud Multi-node",
      },
      {
        title: "PostgreSQL extensions",
        href: "postgresql-extensions",
        excerpt: "Timescale Cloud PostgreSQL extensions",
      },
      {
        title: "Data tiering",
        href: "data-tiering",
        excerpt:
          "Save on storage costs by tiering older data to separate storage",
        children: [
          {
            title: "About data tiering",
            href: "about-data-tiering",
            excerpt: "Learn about tiering Timescale Cloud data to object storage",
          },
          {
            title: "Tier data to object storage",
            href: "tier-data-object-storage",
            excerpt: "How to tier Timescale Cloud data to object storage",
          },
          {
            title: "Untier data to object storage",
            href: "untier-data",
            excerpt: "How to untier Timescale Cloud data",
          },
        ],
      },
      {
        title: "Backup and restore",
        href: "backup-restore-cloud",
        excerpt: "Timescale Cloud backup and restore",
      },
      {
        title: "High availability",
        href: "high-availability",
        excerpt: "Timescale Cloud high availabilioty",
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
          {
            title: "Multi-factor Authentication",
            href: "multi-factor-authentication",
            excerpt: "Multi-factor authentication for Timescale Cloud account",
          },
        ],
      },
      {
        title: "Migrate a PostgreSQL database to Cloud",
        href: "migrate-to-cloud",
        excerpt: "Migrate a PostgreSQL database to Timescale Cloud",
        children: [
          {
            title: "Migrate with Hypershift",
            href: "hypershift",
            excerpt:
              "Migrate an existing PostgreSQL database to Timescale Cloud in a single step with Hypershift",
          },
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
        title: "Troubleshooting",
        href: "troubleshooting",
        type: "placeholder",
        excerpt:
          "Troubleshoot common problems experienced with Timescale Cloud",
      },
    ],
  },
];
