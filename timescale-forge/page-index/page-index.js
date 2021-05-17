module.exports = [
  {
    title: "Timescale Forge",
    filePath: 'index.md',
    href: "timescale-forge",
    name: 'Timescale Forge',
    excerpt: 'Timescale Forge is a fully managed TimescaleDB service that allows you to start querying data in less than a minute!',
    children: [
      {
        href: "create-a-service",
      },
      {
        href: "scaling-a-service",
      },
      {
        href: "customize-configuration",
      },
      {
        title: "Create a multi-node cluster",
        href: "forge-multi-node"
      },
      {
        title: "VPC Peering with AWS",
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
      }
    ]
  }
]
