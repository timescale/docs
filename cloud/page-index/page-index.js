module.exports = [
  {
    title: "Timescale Cloud",
    filePath: "index.md",
    href: "cloud",
    name: "About Timescale Cloud",
    excerpt:
      "Cloud-native TimescaleDB as a service, including all the features of TimescaleDB without the hassle of managing your database",
    tags: ["tsc"],
    children: [
      {
        title: "Services",
        href: "services",
        tags: ["services", "create", "setup", "tsc"],
        excerpt: "Timescale Cloud services",
        children: [
          {
            title: "Create a service",
            href: "create-a-service",
            tags: ["services", "create", "setup", "tsc"],
            excerpt: "Timescale Cloud services",
          },
          {
            title: "Create a service demo",
            href: "create-a-service-demo",
            tags: ["services", "create", "setup", "tsc"],
            excerpt: "Timescale Cloud demo service",
          },
        ],
      },
      {
        title: "Service overview",
        href: "service-overview",
        tags: ["services", "manage", "tsc"],
        excerpt: "Timescale Cloud services overview",
      },
      {
        title: "Service explorer",
        href: "service-explorer",
        tags: ["services", "explorer", "manage", "tsc"],
        excerpt: "Timescale Cloud services explorer",
      },
      {
        title: "Service operations",
        href: "service-operations",
        tags: ["services", "operations", "manage", "tsc"],
        excerpt: "Timescale Cloud services operations",
        children: [
          {
            title: "General",
            href: "general",
            tags: ["services", "operations", "manage", "tsc"],
            excerpt: "Timescale Cloud services operations, General tab",
          },
          {
            title: "Resources",
            href: "resources",
            tags: ["services", "operations", "manage", "tsc"],
            excerpt: "Timescale Cloud services operations, Resources tab",
          },
          {
            title: "Autoscaling",
            href: "autoscaling",
            tags: ["services", "scaling", "operations", "manage", "tsc"],
            excerpt: "Timescale Cloud services operations, Autoscaling tab",
          },
          {
            title: "Replicas",
            href: "replicas",
            tags: ["services", "replicas", "operations", "ha", "manage", "tsc"],
            excerpt: "Timescale Cloud services operations, Replicas tab",
          },
          {
            title: "Maintenance",
            href: "maintenance",
            tags: ["services", "maintenance", "operations", "manage", "tsc"],
            excerpt: "Timescale Cloud services operations, Maintenance tab",
          },
          {
            title: "VPC",
            href: "vpc",
            tags: ["services", "vpc", "operations", "manage", "tsc"],
            excerpt: "Timescale Cloud services operations, VPC tab",
          },
        ],
      },
      {
        title: "Service metrics",
        href: "service-metrics",
        tags: ["services", "monitor", "tsc"],
        excerpt: "Timescale Cloud services metrics",
      },
      {
        title: "Service logs",
        href: "service-logs",
        tags: ["services", "monitor", "manage", "tsc"],
        excerpt: "Timescale Cloud services logs",
      },
      {
        title: "Service settings",
        href: "service-settings",
        tags: ["services", "configure", "manage", "tsc"],
        excerpt: "Timescale Cloud services settings",
        children: [
          {
            title: "Database configuration",
            href: "customize-configuration",
            tags: ["services", "configure", "manage", "tsc"],
            excerpt: "Timescale Cloud services settings",
          },
          {
            title: "Advanced parameters",
            href: "settings-advanced",
            tags: ["services", "configure", "manage", "tsc"],
            excerpt: "Timescale Cloud services settings",
          },
          {
            title: "PostgreSQL extensions",
            href: "postgresql-extensions",
            tags: ["services", "configure", "extensions", "tsc"],
            keywords: ["Services", "Extensions", "Timescale Cloud"],
            excerpt: "Timescale Cloud PostgreSQL extensions",
          },
        ],
      },
      {
        title: "Members",
        href: "members",
        tags: ["users", "manage", "tsc"],
        excerpt: "Timescale Cloud members",
        children: [
          {
            title: "Members list",
            href: "members-list",
            tags: ["users", "manage", "tsc"],
            excerpt: "Timescale Cloud members list",
          },
        ],
      },
      {
        title: "Integrations",
        href: "integrations",
        tags: ["integrations", "tsc", "datadog", "cloudwatch"],
        excerpt: "Export telemetry data to a third-party monitoring service",
      },
      {
        title: "Billing",
        href: "billing",
        tags: ["accounts", "manage", "tsc"],
        excerpt: "Timescale Cloud billing",
        children: [
          {
            title: "Account management",
            href: "account-management",
            tags: ["accounts", "manage", "tsc"],
            excerpt: "Timescale Cloud account management",
          },
        ],
      },
      {
        title: "Multi-node",
        href: "cloud-multi-node",
        tags: ["services", "distributed", "setup", "manage", "tsc"],
        excerpt: "Timescale Cloud Multi-node",
      },
      {
        title: "Backup and restore",
        href: "backup-restore-cloud",
        tags: ["services", "backup", "restore", "manage", "tsc"],
        excerpt: "Timescale Cloud backup and restore",
      },
      {
        title: "High availability",
        href: "high-availability",
        tags: ["services", "ha", "setup", "manage", "tsc"],
        excerpt: "Timescale Cloud high availabilioty",
      },
      {
        title: "Security",
        href: "security",
        tags: ["encryption", "VPC", "privacy"],
        excerpt: "Learn how your Timescale Cloud instance is secured",
      },
      {
        title: "Migrate a TimescaleDB database to Cloud",
        href: "migrate-to-cloud",
        tags: ["services", "migrate", "manage", "tsc"],
        excerpt: "Migrate a TimescaleDB database to Timescale Cloud",
        children: [
          {
            title: "Migrate the entire database at once",
            href: "entire-database",
            tags: ["services", "migrate", "manage", "tsc"],
            excerpt:
              "Migrate an entire TimescaleDB database to Timescale Cloud",
          },
          {
            title: "Migrate schema and data separately",
            href: "schema-then-data",
            tags: ["services", "migrate", "manage", "tsc"],
            excerpt:
              "Migrate a TimescaleDB database schema to Timescale Cloud ",
          },
        ],
      },
      {
        title: "Troubleshooting",
        href: "troubleshooting",
        type: "placeholder",
        tags: ["tshoot, tsc"],
        excerpt:
          "Troubleshoot common problems experienced with Timescale Cloud",
      },
    ],
  },
];
