module.exports = [
  {
    title: "Administer your deployment",
    href: "administer-your-deployment",
    filePath: "index.md",
    excerpt:
      "Create, configure, optimize and administer your Timescale installation.",
    children: [
      {
        title: "User management",
        href: "members",
        excerpt: "User management in Timescale Cloud",
        children: [
          {
            title: "Members list",
            href: "members-list",
            excerpt: "Timescale members list",
          },
          {
            title: "Project Ownership",
            href: "project-ownership",
            excerpt: "Timescale project ownership",
          },
        ],
      },
      {
        title: "Monitoring and lerting",
        href: "alerting",
        excerpt: "Configure alerting within Timescale",
      },
      {
        title: "Backup, restore, and PITR",
        href: "backup-restore",
        children: [
          {
            title: "Backup and restore",
            href: "backup-restore-cloud",
            excerpt: "Timescale backup and restore",
          },
          {
            title: "Point-in-time recovery",
            href: "point-in-time-recovery",
            excerpt: "PITR on Timescale services"
          }
        ]
      },
      {
        title: "Security",
        href: "security",
        excerpt: "Learn how your Timescale instance is secured",
        children: [
          {
            title: "About security in Timescale Cloud",
            href: "overview",
            excerpt: "Get an overview of Timescale security",
          },
          {
            title: "Client credentials",
            href: "client-credentials",
            excerpt: "Client credentials to programmatically access your Timescale account",
          },
          {
            title: "Connect with a stricter SSL mode",
            href: "strict-ssl",
            excerpt:
              "Connect to Timescale with a stricter SSL mode of verify-ca or verify-full",
          },
          {
            title: "Multi-factor Authentication",
            href: "multi-factor-authentication",
            excerpt: "Multi-factor authentication for your Timescale account",
          },
          {
            title: "Read only role",
            href: "read-only-role",
            excerpt: "Create a read-only role to access your database",
          },
          {
            title: "SAML authentication",
            href: "saml",
            excerpt: "SAML / SSO authentication for your Timescale account",
          },
        ],
      },
      {
        title: "VPC Peering and AWS PrivateLink",
        href: "vpc",
        excerpt: "Secure your Timescale Service with VPC Peering and AWS PrivateLink",
      },
      {
        title: "Connection pooling",
        href: "connection-pooling",
        excerpt:
          "Using a connection pool with your Timescale services",
      },
      {
        title: "Configuration",
        href: "configuration",
        excerpt: "Configure your Timescale Cloud service",
        children: [
          {
            title: "About Configuration",
            href: "about-configuration",
            excerpt:
              "Overview of configuration options and methods for PostgreSQL and Timescale",
          },
          {
            title: "Advanced parameters",
            href: "advanced-parameters",
            excerpt:
              "Configure advanced database parameters for your Timescale service",
          },
          {
            title: "Customize configuration",
            href: "customize-configuration",
            excerpt: "Customize your Timescale database configuration",
          },
          {
            title: "Troubleshooting",
            href: "troubleshooting",
            type: "placeholder",
          },
        ],
      },
      {
        title: "High availability and read replication",
        href: "ha-replicas",
        excerpt: "Timescale high availability and read replication",
        children: [
          {
            title: "Manage high availability",
            href: "high-availability",
            excerpt: "Set up HA replicas on Timescale for high availability",
          },
          {
            title: "Manage read replication",
            href: "read-scaling",
            excerpt: "Understand how read scaling works in Timescale",
          },
        ],
      },
      {
        title: "Integrate tooling with Timescale Cloud",
        href: "integrations",
        excerpt: "Integrate third-party solutions with Timescale Cloud",
        children: [
          {
            title: "Configuration and deployment",
            href: "config-deploy",
            excerpt: "Integrate your Timescale account with third-party configuration and deployment solutions",
            children:
              [
                {
                  title: "Terraform",
                  href: "terraform",
                  excerpt: "Manage your Timescale services via Terraform",
                },
              ]
          },
          {
            title: "Data ingestion",
            href: "data-ingest",
            excerpt: "Integrate your Timescale database with third-party data and ingestion solutions",
            children:
              [
                {
                  title: "Telegraf",
                  href: "telegraf",
                  excerpt: "Use Telegraf with Timescale",
                },
              ]
          },
          {
            title: "Observability and alerting",
            href: "observability-alerting",
            excerpt: "Integrate your Timescale database with third-party observability and alerting solutions",
            children:
              [
                {
                  title: "Grafana",
                  href: "grafana",
                  excerpt: "Use Grafana with Timescale",
                  children:
                    [
                      {
                        title: "Create a Grafana dashboard and panel",
                        href: "create-dashboard-and-panel",
                        excerpt: "Create a Grafana dashboard and panel to display your Timescale data",
                      },
                      {
                        title: "Installing Grafana",
                        href: "installation",
                        excerpt: "Installing Grafana and connecting it to your Timescale service"
                      },
                      {
                        title: "Use Grafana to visualize geospatial data",
                        href: "geospatial-dashboards",
                        excerpt: "Use Grafana to visualize geospatial data in Timescale",
                      },
                    ]
                },
                {
                  title: "Tableau",
                  href: "tableau",
                  excerpt: "Use Tableau with Timescale",
                },
              ]
          },
          {
            title: "Query and administration",
            href: "query-admin",
            excerpt: "Integrate your Timescale database with third-party query and administration solutions",
            children:
              [
                {
                  title: "About connecting to Timescale",
                  href: "about-connecting",
                  excerpt: "Learn about using connecting to your Timescale database",
                },
                {
                  title: "About psql",
                  href: "about-psql",
                  excerpt: "Learn about using psql to connect to Timescale",
                },
                {
                  title: "Connect using Azure Data Studio",
                  href: "azure-data-studio",
                  excerpt: "Install Azure Data Studio to connect to Timescale",
                },
                {
                  title: "Connect using DBeaver",
                  href: "dbeaver",
                  excerpt: "Install DBeaver to connect to Timescale",
                },
                {
                  title: "Connect using pgAdmin",
                  href: "pgadmin",
                  excerpt: "Install pgAdmin to connect to Timescale",
                },
                {
                  title: "Connect using qStudio",
                  href: "qstudio",
                  excerpt: "Install qstudio to connect to Timescale",
                },
                {
                  title: "Install psql",
                  href: "psql",
                  excerpt: "Install psql to connect to Timescale",
                },
                {
                  title: "Troubleshooting Timescale connections",
                  href: "troubleshooting",
                  type: "placeholder",
                },
              ]
          },
        ],
      },
      {
        title: "Maintenance and upgrades",
        href: "upgrades",
        excerpt: "Keep your Timescale Cloud service up-to-date",
      },
      {
        title: "Metrics and logging",
        href: "metrics-logging",
        excerpt: "Timescale metrics and logging",
        children: [
          {
            title: "Export to Prometheus",
            href: "metrics-to-prometheus",
            excerpt:
              "Export telemetry data to Prometheus",
          },
          {
            title: "Insights",
            href: "insights",
            excerpt: "Query-level performance insights",
          },
          {
            title: "Service metrics",
            href: "service-metrics",
            excerpt: "Timescale services metrics",
          },
          {
            title: "Service logs",
            href: "service-logs",
            excerpt: "Timescale services logs",
          },
          {
            title: "Third-party monitoring for Timescale Cloud Services",
            href: "integrations",
            excerpt:
              "Export telemetry data to a third-party monitoring service",
          },
        ],
      },
      {
        title: "PostgreSQL extensions",
        href: "extensions",
        excerpt: "Timescale PostgreSQL extensions",
        children: [
          {
            title: "pgcrypto extension",
            href: "pgcrypto",
            excerpt: "Using the pgcrypto PostgreSQL extension",
          },
          {
            title: "pgvector extension",
            href: "pgvector",
            excerpt: "Using the pgvector PostgreSQL extension",
          },
          {
            title: "postgis extension",
            href: "postgis",
            excerpt: "Using the postgis PostgreSQL extension",
          },
        ]
      },
      {
        title: "Timescale Cloud regions",
        href: "regions",
        excerpt: "Timescale AWS regions",
      },
      {
        title: "Timescale limitations",
        href: "limitations",
        excerpt: "Current limitations of Timescale features",
      },
    ],
  },
];
