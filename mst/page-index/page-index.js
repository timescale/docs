module.exports = [
  {
    title: "Managed Service for TimescaleDB",
    filePath: 'index.md',
    href: "mst",
    name: 'Managed Service for TimescaleDB',
    excerpt: 'Timescale Cloud is a fully managed TimescaleDB service that allows you to quickly deploy across 75+ regions in AWS, Azure or GCP',
    children: [
      {
        href: "create-a-service",
      },
      {
        title: "Create a multi-node cluster",
        href: "cloud-multi-node"
      },
      {
        href: "viewing-service-logs",
      },
      {
        title: "VPC peering",
        href: "vpc-peering",
      },
      {
        title: "Security",
        href: "security",
      }
    ]
  }
]
