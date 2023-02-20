module.exports = [
  {
    title: "Promscale",
    filePath: "index.md",
    href: "promscale",
    name: "Promscale",
    pageComponents: ["featured-cards"],
    excerpt:
      "Promscale is the open source observability backend for metrics and traces powered by SQL, built on top of TimescaleDB.",
    children: [
      {
        title: "Quick start",
        href: "quick-start",
        excerpt: "Get started with Promscale fast",
      },
      {
        title: "About Promscale",
        href: "about-promscale",
        excerpt: "Learn about Promscale and how it works",
      },
      {
        title: "Promscale benefits",
        href: "promscale-benefits",
        excerpt: "Learn about the benefits of Promscale",
      },
      {
        title: "Install Promscale",
        href: "installation",
        excerpt:
          "Install Promscale on Kubernetes, Docker, virtual machine, or bare metal",
        children: [
          {
            title: "Kubernetes",
            href: "kubernetes",
            excerpt: "Install Promscale on a Kubernetes cluster",
          },
          {
            title: "Docker",
            href: "docker",
            excerpt: "Install Docker for Promscale",
          },
          {
            title: "Binary",
            href: "binary",
            excerpt: "Install Promscale from source on bare metal",
          },
          {
            title: "Debian or Ubuntu",
            href: "debian-ubuntu",
            excerpt: "Install Promscale on Debian or Ubuntu",
          },
          {
            title: "RPM based Linux (Red Hat or CentOS)",
            href: "rhel-centos",
            excerpt: "Install Promscale on RPM based Linux",
          },
        ],
      },
      {
        title: "How-to Guides",
        href: "guides",
        excerpt: "Migrate, upgrade,and integrate Promscale",
        children: [
          {
            title: "Migrate existing data",
            href: "prom-migrator",
            excerpt:
              "Use Prom-migrator to send existing Prometheus data to Promscale",
          },
          {
            title: "Upgrade Promscale",
            href: "upgrade",
            excerpt: "Upgrade Promscale",
          },
        ],
      },
      {
        title: "Recommendations",
        href: "recommendations",
        excerpt:
          "Install Promscale on Kubernetes, Docker, virtual machine, or bare metal",
        children: [
          {
            title: "Resource recommendation guide",
            href: "resource-recomm",
            excerpt: "Recommended resources for Promscale",
          },
          {
            title: "Configuration recommendation guide",
            href: "config-recomm",
            excerpt: "Recommended resources for Promscale",
          },
        ],
      },
      {
        title: "Backup and Restore Promscale",
        href: "backup-restore",
        excerpt: "Learn how to backup and restore a Promscale database",
      },
      {
        title: "Send data to Promscale",
        href: "send-data",
        excerpt:
          "Send data to Promscale from Prometheus, OpenTelemetry and other tools",
        children: [
          {
            title: "Prometheus",
            href: "prometheus",
            excerpt: "Send Prometheus metrics to Promscale",
          },
          {
            title: "OpenTelemetry",
            href: "opentelemetry",
            excerpt: "Send OpenTelemetry data to Promscale",
          },
          {
            title: "Jaeger",
            href: "jaeger",
            excerpt: "Send Jaeger traces to Promscale",
          },
          {
            title: "Zipkin",
            href: "zipkin",
            excerpt: "Send Zipkin traces to Promscale",
          },
          {
            title: "Remote write API",
            href: "remote-write",
            excerpt:
              "Write data to Promscale in JSON, Protobuf, or text format using the remote write API",
          },
        ],
      },
      {
        title: "Query data in Promscale",
        href: "query-data",
        excerpt: "Learn how to query data in Promscale",
        children: [
          {
            title: "Query metrics",
            href: "query-metrics",
            excerpt: "Query metrics data in Promscale",
          },
          {
            title: "Query traces",
            href: "query-traces",
            excerpt: "Query trace data in Promscale",
          },
        ],
      },
      {
        title: "Visualize data in Promscale",
        href: "visualize-data",
        excerpt:
          "Learn about data visualization tools you can use with Promscale",
        children: [
          {
            title: "Grafana",
            href: "grafana",
            excerpt: "Grafana to visualize data in Promscale",
          },
          {
            title: "Jaeger",
            href: "jaeger",
            excerpt: "Jaeger to visualize data in Promscale",
          },
          {
            title: "Application Performance Monitoring (APM)",
            href: "apm-experience",
            excerpt:
              "APM experience within Grafana using dashboards with SQL queries on traces",
          },
        ],
      },
      {
        title: "Alert in Promscale",
        href: "alert",
        excerpt: "Configure alerting rules in Promscale",
      },

      {
        title: "tobs",
        href: "tobs",
        excerpt:
          "Install a complete observability stack in Kubernetes with tobs",
        children: [
          {
            title: "About tobs",
            href: "about",
            excerpt: "Install the observability stack for Kubernetes (tobs)",
          },
          {
            title: "Install",
            href: "tobs",
            excerpt: "Install tobs",
          },
        ],
      },
      {
        title: "Scale Promscale",
        href: "scale-ha",
        excerpt: "Configure Promscale for scaling and high availability",
        children: [
          {
            title: "Prometheus High availability",
            href: "high-availability",
            excerpt: "Configure Promscale and Prometheus high availability",
          },
          {
            title: "Prometheus multi-tenancy",
            href: "prometheus-multi-tenancy",
            excerpt: "Configure Promscale multi-tenancy for Prometheus",
          },
        ],
      },
      {
        title: "Monitor Promscale",
        href: "monitor",
        excerpt:
          "Monitor Promscale with out-of-the-box alerts, runbooks and dashboards",
      },
      {
        title: "Manage data in Promscale",
        href: "manage-data",
        excerpt: "Manage the data stored in Promscale",
        children: [
          {
            title: "Retention",
            href: "retention",
            excerpt: "Configure data retention policies in Promscale",
          },
          {
            title: "Compression",
            href: "compression",
            excerpt: "Configure data compression in Promscale",
          },
          {
            title: "Delete data",
            href: "delete-data",
            excerpt: "Delete data in Promscale",
          },
          {
            title: "Maintenance jobs",
            href: "maintenance-jobs",
            excerpt: "Understand and manage maintenance jobs",
          },
        ],
      },
      {
        title: "Downsample data",
        href: "downsample-data",
        excerpt: "Configure downsampling in Promscale",
        children: [
          {
            title: "Continuous Aggregates",
            href: "caggs",
            excerpt: "Continuous aggregates in Promscale",
          },
          {
            title: "Recording Rules",
            href: "recording",
            excerpt: "Configure recording rules in Promscale",
          },
        ],
      },
      {
        title: "Database roles and permissions",
        href: "roles-and-permissions",
        excerpt:
          "Learn about the different database roles and permissions Promscale defines",
      },
      {
        title: "Troubleshooting Promscale",
        href: "troubleshooting",
        type: "placeholder",
        excerpt: "Troubleshooting Promscale",
      },
      {
        title: "Promscale CLI reference",
        href: "cli",
        excerpt: "Learn about all parameters accepted by the Promscale CLI",
      },
      {
        title: "SQL API functions reference",
        href: "sql-api",
        excerpt: "Learn about all Promscale SQL API functions",
      },
    ],
  },
];
