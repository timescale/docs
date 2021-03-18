module.exports = [
  {
    title: "Timescale Cloud",
    filePath: 'index.md',
    href: "timescale-cloud",
    name: 'Timescale Cloud',
    excerpt: 'Timescale Cloud is a fully managed TimescaleDB service that allows you to quickly deploy across 75+ regions in AWS, Azure or GCP',
    children: [
      {
        href: "create-a-service",
      },
      {
        title: "Create a Multi-node Cluster",
        href: "cloud-multi-node"
      },
      {
        href: "viewing-service-logs",
      },
      {
        title: "VPC Peering",
        href: "vpc-peering",
      },
      {
        href: "security",
      }
    ]
  }
]
