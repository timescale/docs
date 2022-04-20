module.exports = [
  {
    title: "Timescale Cloud",
    filePath: 'index.md',
    href: "cloud",
    name: 'About Timescale Cloud',
    excerpt: 'Timescale Cloud is a fully managed TimescaleDB service that allows you to start querying data in less than a minute!',
    tags: ['cloud'],
    children: [
      {
        title: "Services",
        href: "services",
        tags: ['cloud'],
        children: [
          {
            title: "Create a service",
            href: "create-a-service",
            tags: ['cloud'],
          },
          {
            title: "Create a service demo",
            href: "create-a-service-demo",
            tags: ['cloud'],
          }
        ],
      },
      {
        title: "Service overview",
        href: "service-overview",
        tags: ['cloud'],
      },
      {
        title: "Service explorer",
        href: "service-explorer",
        tags: ['cloud'],
      },
      {
        title: "Service operations",
        href: "service-operations",
        tags: ['cloud'],
        children: [
          {
            title: "General",
            href: "general",
            tags: ['cloud'],
          },
          {
            title: "Resources",
            href: "resources",
            tags: ['cloud'],
          },
          {
            title: "Autoscaling",
            href: "autoscaling",
            tags: ['cloud'],
          },
          {
            title: "Replicas",
            href: "replicas",
            tags: ['cloud'],
          },
          {
            title: "Maintenance",
            href: "maintenance",
            tags: ['cloud'],
          },
          {
            title: "VPC",
            href: "vpc",
            tags: ['cloud'],
          }
        ],
      },
      {
        title: "Service metrics",
        href: "service-metrics",
        tags: ['cloud'],
      },
      {
        title: "Service logs",
        href: "service-logs",
        tags: ['cloud'],
      },
      {
        title: "Service settings",
        href: "service-settings",
        tags: ['cloud'],
        children: [
          {
            title: "Database configuration",
            href: "customize-configuration",
            tags: ['cloud'],
          },
          {
            title: "Advanced parameters",
            href: "settings-advanced",
            tags: ['cloud'],
          },
        ],
      },
      {
        title: "Members",
        href: "members",
        tags: ['cloud'],
        children: [
          {
            title: "User management",
            href: "members-list",
            tags: ['cloud'],
          },
        ]
      },
      {
        title: "Billing",
        href: "billing",
        tags: ['cloud'],
        children: [
          {
            title: "Account management",
            href: "account-management",
            tags: ['cloud'],
          }
        ]
      },
      {
        title: "Multi-node",
        href: "cloud-multi-node",
        tags: ['cloud'],
      },
      {
        title: "Backup and restore",
        href: "backup-restore-cloud",
        tags: ['cloud'],
      },
      {
        title: "High availability",
        href: "high-availability",
        tags: ['cloud'],
      },
      {
        title: "Migrate a TimescaleDB database to Cloud",
        href: "migrate-to-cloud",
        tags: ['cloud'],
        children: [
          {
            title: "Migrate the entire database at once",
            href: "entire-database",
            tags: ['cloud'],
          },
          {
            title: "Migrate schema and data separately",
            href: "schema-then-data",
            tags: ['cloud'],
          },
        ],
      },
    ]
  }
]
