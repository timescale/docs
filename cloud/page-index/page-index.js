module.exports = [
  {
    title: "Timescale Cloud",
    filePath: 'index.md',
    href: "cloud",
    name: 'Timescale Cloud',
    excerpt: 'Timescale Cloud is a fully managed TimescaleDB service that allows you to start querying data in less than a minute!',
    children: [
      {
        title: "Create a service",
        href: "create-a-service",
      },
      {
        title: "Migrate from Managed Service for TimescaleDB",
        href: "migrate-mst-cloud",
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
      },
      {
        title: "Scale a service",
        href: "scaling-a-service",
      },
      {
        title: "Customize configuration",
        href: "customize-configuration",
      },
      {
        title: "Multi-node on Timescale Cloud",
        href: "cloud-multi-node"
      },
      {
        title: "VPC peering",
        href: "vpc-peering",
      },
      {
        title: "Disk management",
        href: "disk-management"
      },
      {
        title: "Operations",
        href: "operations"
      },
      {
        title: "Metrics",
        href: "metrics"
      },
      {
        title: "Maintenance",
        href: "maintenance"
      },
      {
        title: "Explorer",
        href: "explorer"
      },
      {
        title: "Backup and restore",
        href: "backup-restore-cloud"
      },
      {
        title: "Account management",
        href: "account-management"
      }
    ]
  }
]
