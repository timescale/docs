module.exports = [
  {
    title: "Managed Service for TimescaleDB",
    filePath: "index.md",
    href: "mst",
    name: "Managed Service for TimescaleDB",
    excerpt: "Managed TimescaleDB in the cloud for Azure and GCP deployments",
    children: [
      {
        title: "About Managed Service for TimescaleDB",
        href: "about-mst",
      },
      {
        title: "Install Managed Service for TimescaleDB",
        href: "installation-mst",
      },
      {
        title: "Clouds and regions",
        href: "cloud-regions",
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
        title: "Create a multi-node cluster",
        href: "mst-multi-node",
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
      },
      {
        title: "Integrations",
        href: "integrations",
        excerpt: " MST integrates with the other tools you are already using, and makes it easy to add more integrations",
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
        title: "Troubleshooting",
        href: "troubleshooting",
        type: "placeholder",
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
        title: "Aiven Client for Managed Service for TimescaleDB",
        href: "aiven-client",
        excerpt:
          "A Command Line tool for fully managed TimescaleDB service on AWS, Azure, or GCP.",
        children: [
          {
            title: "Install Aiven Client for Managed Service for TimescaleDB",
            href: "aiven-client-install",
            excerpt:
              "Install Aiven Client to manage your services on MST"
          },
          {
            title: "Create a fork of the service using Aiven Client",
            href: "create-fork",
            excerpt:
              "Create a fork of the service using Aiven Client"
          },
          {
            title: "Create a read-only replica using Aiven Client",
            href: "replicas-cli",
            excerpt:
              "Create a read-only replica using Aivent Client"
          },
          {
            title: "Integrate authentication plugins in Grafana",
            href: "grafana-authentication-plugins",
            excerpt:
              "Configure Google, GitHub, or GitLab authentication plugins for Grafana",
          },
          {
            title: "Send Grafana emails using Aiven Client",
            href: "grafana-email",
            excerpt:
              "Configure the Simple Mail Transfer Protocol (SMTP) server in MST for Grafana"
          },
        ],
      },
      {
        title: "Migrate your data to Managed Service for TimescaleDB",
        href: "migrate-to-mst",
      },
      {
        title: "Migrate your data to Timescale Cloud",
        href: "migrate-to-cloud",
      },
      {
        title: "Using REST API on Managed Service for TimescaleDB",
        href: "restapi",
      },
      {
        title: "Identify and resolve issues with indexes on Managed Service for TimescaleDB",
        href: "identify-index-issues",
      },
    ],
  },
];
