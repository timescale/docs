module.exports = [
  {
    title: "Cloud Console",
    filePath: "index.md",
    href: "cloud-console",
    excerpt: "Web-based UI for interacting with Timescale Cloud",
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
    ],
  },
];
