module.exports = [
  {
    title: "Timescale Cloud",
    filePath: 'index.md',
    href: "cloud",
    name: 'About Timescale Cloud',
    excerpt: 'Timescale Cloud is a fully managed, hosted TimescaleDB service',
    tags: ['tsc'],
    keywords: ['Timescale Cloud'],
    excerpt: "Timescale Cloud documentation",
    children: [
      {
        title: "Services",
        href: "services",
        tags: ['services', 'create', 'setup', 'tsc'],
        keywords: ['Services', 'Timescale Cloud'],
        excerpt: "Timescale Cloud services",
        children: [
          {
            title: "Create a service",
            href: "create-a-service",
            tags: ['services', 'create', 'setup', 'tsc'],
            keywords: ['Services', 'Timescale Cloud'],
            excerpt: "Timescale Cloud services",
          },
          {
            title: "Create a service demo",
            href: "create-a-service-demo",
            tags: ['services', 'create', 'setup', 'tsc'],
            keywords: ['Services', 'Timescale Cloud'],
            excerpt: "Timescale Cloud demo service",
          }
        ],
      },
      {
        title: "Service overview",
        href: "service-overview",
        tags: ['services', 'manage', 'tsc'],
        keywords: ['Services', 'Timescale Cloud'],
        excerpt: "Timescale Cloud services overview",
      },
      {
        title: "Service explorer",
        href: "service-explorer",
        tags: ['services', 'explorer', 'manage', 'tsc'],
        keywords: ['Services', 'Explorer', 'Timescale Cloud'],
        excerpt: "Timescale Cloud services explorer",
      },
      {
        title: "Service operations",
        href: "service-operations",
        tags: ['services', 'operations', 'manage', 'tsc'],
        keywords: ['Services', 'Operations', 'Timescale Cloud'],
        excerpt: "Timescale Cloud services operations",
        children: [
          {
            title: "General",
            href: "general",
            tags: ['services', 'operations', 'manage', 'tsc'],
            keywords: ['Services', 'Operations', 'Timescale Cloud'],
            excerpt: "Timescale Cloud services operations, General tab",
          },
          {
            title: "Resources",
            href: "resources",
            tags: ['services', 'operations', 'manage', 'tsc'],
            keywords: ['Services', 'Operations', 'Timescale Cloud'],
            excerpt: "Timescale Cloud services operations, Resources tab",
          },
          {
            title: "Autoscaling",
            href: "autoscaling",
            tags: ['services', 'scaling', 'operations', 'manage', 'tsc'],
            keywords: ['Services', 'Operations', 'scaling', 'Timescale Cloud'],
            excerpt: "Timescale Cloud services operations, Autoscaling tab",
          },
          {
            title: "Replicas",
            href: "replicas",
            tags: ['services', 'replicas', 'operations', 'ha', 'manage', 'tsc'],
            keywords: ['Services', 'Operations', 'HA', 'Replicas', 'Timescale Cloud'],
            excerpt: "Timescale Cloud services operations, Replicas tab",
          },
          {
            title: "Maintenance",
            href: "maintenance",
            tags: ['services', 'maintenance', 'operations', 'manage', 'tsc'],
            keywords: ['Services', 'Operations', 'Maintenance', 'Timescale Cloud'],
            excerpt: "Timescale Cloud services operations, Maintenance tab",
          },
          {
            title: "VPC",
            href: "vpc",
            tags: ['services', 'vpc', 'operations', 'manage', 'tsc'],
            keywords: ['Services', 'Operations', 'VPC', 'Timescale Cloud'],
            excerpt: "Timescale Cloud services operations, VPC tab",
          }
        ],
      },
      {
        title: "Service metrics",
        href: "service-metrics",
        tags: ['services', 'monitor', 'tsc'],
        keywords: ['Services', 'Metrics', 'Timescale Cloud'],
        excerpt: "Timescale Cloud services metrics",
      },
      {
        title: "Service logs",
        href: "service-logs",
        tags: ['services', 'monitor', 'manage', 'tsc'],
        keywords: ['Services', 'Logging', 'Timescale Cloud'],
        excerpt: "Timescale Cloud services logs",
      },
      {
        title: "Service settings",
        href: "service-settings",
        tags: ['services', 'configure', 'manage', 'tsc'],
        keywords: ['Services', 'Configuration', 'Timescale Cloud'],
        excerpt: "Timescale Cloud services settings",
        children: [
          {
            title: "Database configuration",
            href: "customize-configuration",
            tags: ['services', 'configure', 'manage', 'tsc'],
            keywords: ['Services', 'Configuration', 'Timescale Cloud'],
            excerpt: "Timescale Cloud services settings",
          },
          {
            title: "Advanced parameters",
            href: "settings-advanced",
            tags: ['services', 'configure', 'manage', 'tsc'],
            keywords: ['Services', 'Configuration', 'Timescale Cloud'],
            excerpt: "Timescale Cloud services settings",
          },
        ],
      },
      {
        title: "Members",
        href: "members",
        tags: ['users', 'manage', 'tsc'],
        keywords: ['Members', 'Timescale Cloud'],
        excerpt: "Timescale Cloud members",
        children: [
          {
            title: "Members list",
            href: "members-list",
            tags: ['users', 'manage', 'tsc'],
            keywords: ['Members', 'Timescale Cloud'],
            excerpt: "Timescale Cloud members list",
          },
        ]
      },
      {
        title: "Billing",
        href: "billing",
        tags: ['accounts', 'manage', 'tsc'],
        keywords: ['Accounts', 'Timescale Cloud'],
        excerpt: "Timescale Cloud billing",
        children: [
          {
            title: "Account management",
            href: "account-management",
            tags: ['accounts', 'manage', 'tsc'],
            keywords: ['Accounts', 'Timescale Cloud'],
            excerpt: "Timescale Cloud account management",
          }
        ]
      },
      {
        title: "Multi-node",
        href: "cloud-multi-node",
        tags: ['services', 'distributed', 'setup', 'manage', 'tsc'],
        keywords: ['Services', 'HA', 'Multi-node', 'Timescale Cloud'],
        excerpt: "Timescale Cloud Multi-node",
      },
      {
        title: "Backup and restore",
        href: "backup-restore-cloud",
        tags: ['services', 'backup', 'restore', 'manage', 'tsc'],
        keywords: ['Services', 'Backup', 'Restore', 'Timescale Cloud'],
        excerpt: "Timescale Cloud backup and restore",
      },
      {
        title: "High availability",
        href: "high-availability",
        tags: ['services', 'ha', 'setup', 'manage', 'tsc'],
        keywords: ['Services', 'HA', 'Timescale Cloud'],
        excerpt: "Timescale Cloud high availabilioty",
      },
      {
        title: "Migrate a TimescaleDB database to Cloud",
        href: "migrate-to-cloud",
        tags: ['services', 'migrate', 'manage', 'tsc'],
        keywords: ['Services', 'migration', 'Timescale Cloud'],
        excerpt: "Migrate a TimescaleDB database to Timescale Cloud",
        children: [
          {
            title: "Migrate the entire database at once",
            href: "entire-database",
            tags: ['services', 'migrate', 'manage', 'tsc'],
            keywords: ['Services', 'migration', 'Timescale Cloud'],
            excerpt: "Migrate an entire TimescaleDB database to Timescale Cloud",
          },
          {
            title: "Migrate schema and data separately",
            href: "schema-then-data",
            tags: ['services', 'migrate', 'manage', 'tsc'],
            keywords: ['Services', 'migration', 'Timescale Cloud'],
            excerpt: "Migrate a TimescaleDB database schema to Timescale Cloud ",
          },
        ],
      },
    ]
  }
]
