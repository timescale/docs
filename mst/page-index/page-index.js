module.exports = [
  {
    title: "Managed Service for TimescaleDB",
    href: "mst",
    filePath: "index.md",
    pageComponents: ["content-list"],
    excerpt: "Managed Service for TimescaleDB",
    children: [
      {
        title: "About Managed Service for TimescaleDB",
        href: "about-mst",
      },
      {
        title: "Get started with Managed Service for TimescaleDB",
        href: "installation-mst",
      },
      {
        title: "Ingest data",
        href: "ingest-data",
      },
      {
        title: "User management",
        href: "user-management",
      },
      {
        title: "Billing",
        href: "billing",
      },
      {
        title: "Connection pools",
        href: "connection-pools",
      },
      {
        title: "Viewing service logs",
        href: "viewing-service-logs",
      },
      {
        title: "VPC peering",
        href: "vpc-peering",
        children: [
          {
            title: "Setting up VPC peering for the project",
            href: "vpc-peering",
          },
          {
            title:
              "VPC peering on AWS",
            href: "vpc-peering-aws",
          },
          {
            title: "VPC peering on GCP",
            href: "vpc-peering-gcp",
          },
          {
            title: "VPC peering on Azure",
            href: "vpc-peering-azure",
          },
          {
            title: "Attaching a VPC to an AWS Transit Gateway",
            href: "vpc-peering-aws-transit",
          }
        ],
      },
      {
        title: "Integrations",
        href: "integrations",
        excerpt: "Using Managed Service for TimescaleDB with other tools",
        children: [
          {
            title: "Visualizing data with Google Data Studio",
            href: "google-data-studio-mst",
          },
          {
            title:
              "Visualizing data with Grafana",
            href: "grafana-mst",
          },
          {
            title: "Logging",
            href: "logging",
          },
          {
            title: "Sending metrics to Datadog",
            href: "metrics-datadog",
          },
          {
            title: "Monitoring with Prometheus endpoint",
            href: "prometheus-mst",
          }
        ],
      },
      {
        title: "Supported extensions",
        href: "extensions",
      },
      {
        title: "Use PostgreSQL dblink extension",
        href: "dblink-extension",
      },
      {
        title: "Security",
        href: "security",
      },
      {
        title: "Create a replica for PostgreSQL service",
        href: "postgresql-read-replica",
      },
      {
        title: "Maintenance",
        href: "maintenance",
      },
      {
        title: "Failover",
        href: "failover",
      },
      {
        title: "Backups",
        href: "manage-backups",
      },
      {
        title: "Aiven Client",
        href: "aiven-client",
        excerpt:
          "A command line tool for Managed Service for TimescaleDB",
      },
      {
        title: "Migrate your data to Managed Service for TimescaleDB",
        href: "migrate-to-mst",
      },
      {
        title: "Migrate your data to Timescale",
        href: "migrate-to-cloud",
      },
      {
        title: "Using the REST API",
        href: "restapi",
      },
      {
        title: "Identify and resolve issues with indexes",
        href: "identify-index-issues",
      },
      {
        title: "Troubleshooting",
        href: "troubleshooting",
        type: "placeholder",
      },
    ],
  },
];
