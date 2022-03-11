module.exports = [
  {
    title: "Timescale Cloud",
    filePath: 'index.md',
    href: "cloud",
    name: 'About Timescale Cloud',
    excerpt: 'Timescale Cloud is a fully managed TimescaleDB service that allows you to start querying data in less than a minute!',
    children: [
      {
        title: "Services",
        href: "services",
        children: [
          {
            title: "Create a service",
            href: "create-a-service",
          },
          {
            title: "Create a service demo",
            href: "create-a-service-demo",
          }
        ],
      },
      {
        title: "Service overview",
        href: "service-overview",
      },
      {
        title: "Service explorer",
        href: "explorer",
      },
      {
        title: "Service operations",
        href: "operations",
        children: [
          {
            title: "General",
            href: "disk-management",
          },
          {
            title: "Resources",
            href: "memory-management",
          },
          {
            title: "Autoscaling",
            href: "scaling-a-service",
          },
          {
            title: "Maintenance",
            href: "maintenance",
          },
          {
            title: "VPC",
            href: "vpc-peering",
          }
        ],
        {
          title: "Service metrics",
          href: "metrics",
        },
        {
          title: "Service logs",
          href: "service-logs",
        },
        {
          title: "Service settings",
          href: "service-settings",
          children: [
            {
              title: "Database configuration",
              href: "customize-configuration",
            },
            {
              title: "Advanced parameters",
              href: "settings-advanced",
            },
          ],
        },
        {
          title: "Members",
          href: "members",
          children: [
            {
              title: "User management",
              href: "members-users",
            },
          ]
        },
        {
          title: "Billing",
          href: "billing",
          children: [
            {
              title: "Account management",
              href: "account-management",
            }
          ]
        },
        {
          title: "Multi-node",
          href: "cloud-multi-node",
        },
        {
          title: "Backup and restore",
          href: "backup-restore-cloud",
        },
        {
          title: "Migrate a TimescaleDB database to Cloud",
          href: "migrate-to-cloud",
          children: [
            {
              title: "Migrate the entire database at once",
              href: "entire-database",
            },
            {
              title: "Migrate schema and data separately",
              href: "schema-then-data",
            },
          ],
        }
      }
    ]
  }
