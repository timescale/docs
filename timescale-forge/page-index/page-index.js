module.exports = [
  {
    title: "Timescale Forge",
    filePath: 'index.md',
    href: "timescale-forge",
    name: 'Timescale Forge',
    excerpt: 'Timescale Forge is a fully managed TimescaleDB service that allows you to start querying data in less than a minute!',
    children: [
      {
        title: "Create a service",
        href: "create-a-service",
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
        title: "Create a multi-node cluster",
        href: "forge-multi-node"
      },
      {
        title: "VPC peering with AWS",
        href: "vpc-peering-aws",
        children: [
          {
            title: "Create and connect a VPC",
            href: "create"
          },
          {
            title: "Migrate a service between networks",
            href: "migrate"
          }
        ]
      },
      {
        title: "Disk management",
        href: "disk-management"
      },
      {
        title: "Maintenance",
        href: "maintenance"
      },
      {
        title: "Backup and restore",
        href: "backup-restore-cloud"
      }
    ]
  }
]
