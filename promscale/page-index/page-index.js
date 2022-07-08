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
        title: "About Promscale",
        href: "about-promscale",
        tags: ["promscale", "learn", "analytics", "prometheus"],
        keywords: ["Promscale", "analytics"],
        excerpt: "Learn about Promscale and how it works",
      },
      {
        title: "Promscale benefits",
        href: "promscale-benefits",
        tags: ["promscale", "learn", "analytics", "prometheus"],
        keywords: ["Promscale", "analytics"],
        excerpt: "Learn about the benefits of Promscale",
      },
      {
        title: "Install Promscale",
        href: "installation",
        tags: ["promscale", "learn", "analytics", "prometheus"],
        keywords: ["Promscale", "analytics"],
        relatedPages: [
          "/promscale/:currentVersion:/guides/resource-recomm",
          "/promscale/:currentVersion:/send-data/",
        ],
        excerpt:
          "Install Promscale on Kubernetes, Docker, virtual machine, or bare metal",
        children: [
          {
            title: "Kubernetes",
            href: "kubernetes",
            tags: ["promscale", "install", "kubernetes", "analytics", "helm"],
            keywords: ["Promscale", "Kubernetes", "analytics", "Helm"],
            relatedPages: [
              "/promscale/:currentVersion:/guides/resource-recomm",
              "/promscale/:currentVersion:/send-data/",
            ],
            excerpt: "Install Promscale on a Kubernetes cluster",
          },
          {
            title: "Docker",
            href: "docker",
            tags: ["promscale", "install", "analytics", "docker"],
            keywords: ["Promscale", "analytics", "Docker"],
            relatedPages: [
              "/promscale/:currentVersion:/guides/resource-recomm",
              "/promscale/:currentVersion:/send-data/",
            ],
            excerpt: "Install Docker for Promscale",
          },
          {
            title: "Binary",
            href: "binary",
            tags: ["promscale", "install", "analytics"],
            keywords: ["Promscale", "analytics"],
            relatedPages: [
              "/promscale/:currentVersion:/guides/resource-recomm",
              "/promscale/:currentVersion:/send-data/",
            ],
            excerpt: "Install Promscale from source on bare metal",
          },
          {
            title: "Debian or Ubuntu",
            href: "debian-ubuntu",
            tags: ["promscale", "install", "analytics"],
            keywords: ["Promscale", "analytics"],
            relatedPages: [
              "/promscale/:currentVersion:/guides/resource-recomm",
              "/promscale/:currentVersion:/send-data/",
            ],
            excerpt: "Install Promscale on Debian or Ubuntu",
          },
          {
            title: "RPM based Linux (Red Hat or CentOS)",
            href: "rhel-centos",
            tags: ["promscale", "install", "analytics"],
            keywords: ["Promscale", "analytics"],
            relatedPages: [
              "/promscale/:currentVersion:/guides/resource-recomm",
              "/promscale/:currentVersion:/send-data/",
            ],
            excerpt: "Install Promscale on RPM based Linux",
          },
          {
            title: "tobs",
            href: "tobs",
            tags: ["promscale", "install", "analytics", "k8s"],
            keywords: ["Promscale", "analytics", "Kubernetes"],
            relatedPages: [
              "/promscale/:currentVersion:/guides/resource-recomm",
              "/promscale/:currentVersion:/send-data/",
            ],
            excerpt: "Install tobs",
          },
        ],
      },
      {
        title: "How-to Guides",
        href: "guides",
        tags: ["promscale", "migration", "upgrade", "docker", "kubernetes"],
        keywords: ["Promscale", "migration", "upgrade"],
        excerpt:
          "Migrate, upgrade,and integrate Promscale",
        children: [
          {
            title: "Migrate existing data",
            href: "prom-migrator",
            tags: ["promscale", "install", "data", "migration", "prometheus"],
            keywords: ["Promscale", "analytics"],
            excerpt:
              "Use Prom-migrator to send existing Prometheus data to Promscale",
          },
          {
            title: "Upgrade Promscale",
            href: "upgrade",
            tags: ["promscale", "upgrade"],
            keywords: ["Promscale", "upgrade"],
            relatedPages: [
              "/promscale/:currentVersion:/send-data/",
            ],
            excerpt: "Upgrade Promscale",
          },
        ],
      },
      {
        title: "Recommendations",
        href: "recommendations",
        tags: ["promscale", "learn", "analytics", "prometheus"],
        keywords: ["Promscale", "analytics"],
        excerpt:
          "Install Promscale on Kubernetes, Docker, virtual machine, or bare metal",
        children: [
          {
            title: "Resource recommendation guide",
            href: "resource-recomm",
            tags: ["promscale", "install", "analytics"],
            keywords: ["Promscale", "analytics"],
            excerpt: "Recommended resources for Promscale",
          },
          {
            title: "Configuration recommendation guide",
            href: "config-recomm",
            tags: ["promscale", "install", "analytics"],
            keywords: ["Promscale", "analytics"],
            excerpt: "Recommended resources for Promscale",
          },
        ],
      },
      {
        title: "Backup and Restore Promscale",
        href: "backup-restore",
        tags: ["promscale", "backup", "restore"],
        keywords: ["Promscale", "backup", "restore"],
        excerpt: "Learn how to backup and restore a Promscale database"
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
            tags: ["promscale", "configure", "prometheus", "metrics"],
            keywords: ["Promscale", "Prometheus"],
            relatedPages: ["/promscale/:currentVersion:/installation/"],
            excerpt: "Send Prometheus metrics to Promscale",
          },
          {
            title: "OpenTelemetry",
            href: "opentelemetry",
            tags: ["promscale", "configure", "opentelemetry", "traces"],
            keywords: ["Promscale", "OpenTelemetry"],
            excerpt: "Send OpenTelemetry data to Promscale",
          },
          {
            title: 'Jaeger',
            href: 'jaeger',
            tags: ['promscale', 'configure', 'jaeger', 'traces'],
            keywords: ['Promscale', 'Jaeger'],
            excerpt: 'Send Jaeger traces to Promscale',
          },
          {
            title: 'Zipkin',
            href: 'zipkin',
            tags: ['promscale', 'configure', 'zipkin', 'traces'],
            keywords: ['Promscale', 'Zipkin'],
            excerpt: 'Send Zipkin traces to Promscale',
          }
        ],
      },
      {
        title: "Query data in Promscale",
        href: "query-data",
        excerpt: "Learn how to query data in Promscale",
        children: [
          {
            title: 'Query metrics',
            href: 'query-metrics',
            tags: ["promscale", "analytics", "sql", "prometheus"],
            keywords: ["Promscale", "analytics", "query", "metrics"],
            excerpt: 'Query metrics data in Promscale'
          },
          {
            title: 'Query traces',
            href: 'query-traces',
            tags: ["promscale", "analytics", "sql", "prometheus"],
            keywords: ["Promscale", "analytics", "query", "traces"],
            excerpt: 'Query trace data in Promscale'
          },
        ]
      },
      {
        title: 'Visualize data in Promscale',
        href: 'visualize-data',
        tags: ['promscale', 'visualization', 'analytics', 'grafana', 'jaeger'],
        keywords: ['Promscale', 'analytics', 'Grafana'],
        excerpt: 'Learn about data visualization tools you can use with Promscale',
        children: [
          {
            title: 'Grafana',
            href: 'grafana',
            tags: ['promscale', 'configure', 'prometheus', 'metrics'],
            keywords: ['Promscale', 'Grafana'],
            excerpt: 'Grafana to visualize data in Promscale',
          },
          {
            title: 'Jaeger',
            href: 'jaeger',
            tags: ['promscale', 'configure', 'jaeger', 'opentelemetry', 'traces'],
            keywords: ['Promscale', 'Jaeger'],
            excerpt: 'Jaeger to visualize data in Promscale',
          },
          {
           title: 'Application Performance Monitoring (APM)',
           href: 'apm-experience',
           tags: ['promscale', 'configure', 'jaeger', 'opentelemetry', 'traces', 'apm'],
           keywords: ['Promscale', 'Jaeger', 'APM'],
           excerpt: 'APM experience within Grafana using dashboards with SQL queries on traces',
         },
        ],
      },
      {
        title: "Alert in Promscale",
        href: "alert",
        tags: ["promscale", "prometheus", "alert"],
        keywords: ["Promscale", "Prometheus", "alert", "Alert Manager"],
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
            tags: ["tobs", "install", "k8s", "monitor", "timescaledb"],
            keywords: [
              "tobs",
              "Kubernetes",
              "install",
              "timescaleDB",
              "Promscale",
            ],
            excerpt: "Install the observability stack for Kubernetes (tobs)",
          },
          {
            title: "Use tobs",
            href: "use",
            tags: ["tobs", "monitor", "k8s", "timescaledb"],
            keywords: ["tobs", "Kubernetes", "timescaleDB", "Promscale"],
            excerpt: "Using the observability suite for Kubernetes (tobs)",
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
            tags: ["promscale", "ha", "timescaledb"],
            keywords: ["promscale", "HA", "prometheus", "timescaledb"],
            excerpt: "Configure Promscale and Prometheus high availability",
          },
          {
            title: "Multi-node",
            href: "multi-node",
            tags: ["promscale", "multi-node", "scale", "timescaledb"],
            keywords: ["promscale", "multinode", "scale", "timescaledb"],
            excerpt: "Scale Promscale with a TimescaleDB multinode database",
          },
          {
            title: "Prometheus multi-tenancy",
            href: "prometheus-multi-tenancy",
            tags: [
              "promscale",
              "multi-tenancy",
              "scale",
              "prometheus",
              "timescaledb",
            ],
            keywords: [
              "promscale",
              "multi-tenancy",
              "scale",
              "prometheus",
              "timescaledb",
            ],
            excerpt: "Configure Promscale multi-tenancy for Prometheus",
          },
        ],
      },
      {
        title: "Monitor Promscale",
        href: "monitor",
        tags: ["promscale", "prometheus", "alert"],
        keywords: ["Promscale", "Prometheus", "alert", "Alert Manager"],
        excerpt: "Monitor Promscale with out-of-the-box alerts, runbooks and dashboards",
      },
      {
        title: 'Manage data in Promscale',
        href: 'manage-data',
        excerpt: 'Manage the data stored in Promscale',
        children: [
          {
            title: 'Retention',
            href: 'retention',
            tags: ['promscale', 'configure', 'retention', 'metrics', 'storage'],
            keywords: ['Promscale', 'retention'],
            excerpt: 'Configure data retention policies in Promscale',
          },
          {
            title: 'Compression',
            href: 'compression',
            tags: ['promscale', 'configure', 'compression', 'metrics', 'storage'],
            keywords: ['Promscale', 'compression'],
            excerpt: 'Configure data compression in Promscale',
          },
          {
            title: 'Delete data',
            href: 'delete-data',
            tags: ['promscale', 'delete', 'metrics'],
            keywords: ['Promscale', 'Prometheus', 'delete'],
            excerpt: 'Delete data in Promscale',
          },
          {
            title: 'Maintenance jobs',
            href: 'maintenance-jobs',
            tags: ['promscale', 'maintenance', 'data'],
            keywords: ['Promscale', 'maintenance', 'data'],
            excerpt: 'Understand and manage maintenance jobs',
          },
        ],
      },
      {
        title: 'Downsample data',
        href: 'downsample-data',
        tags: ['promscale', 'downsample', 'continuous aggregates', 'metrics', 'recording rules'],
        keywords: ['Promscale', 'Prometheus', 'downsampling'],
        excerpt: 'Configure downsampling in Promscale',
        children: [
          {
            title: 'Continuous Aggregates',
            href: 'caggs',
            tags: ['promscale', 'downsampling', 'recording', 'caggs'],
            keywords: ['Promscale', 'caggs', 'downsampling'],
            excerpt: 'Continuous aggregates in Promscale',
          },
          {
            title: 'Recording Rules',
            href: 'recording',
            tags: ['promscale', 'downsampling', 'recording rules'],
            keywords: ['Promscale', 'Prometheus', 'downsampling'],
            excerpt: 'Configure recording rules in Promscale',
          },
        ],
      },
      {
        title: "Database roles and permissions",
        href: "roles-and-permissions",
        tags: ["promscale", "roles", "permissions", "database"],
        keywords: ["Promscale", "analytics", "permissions", "roles"],
        excerpt:
          "Learn about the different database roles and permissions Promscale defines",
      },
      {
        title: "Troubleshooting Promscale",
        href: "troubleshooting",
        tags: ["promscale", "learn", "troubleshooting", "prometheus"],
        keywords: ["Promscale", "troubleshooting"],
        excerpt: "Troubleshooting Promscale",
      },
      {
        title: 'Promscale CLI reference',
        href: 'cli',
        tags: ['promscale', 'CLI', 'reference'],
        keywords: ['Promscale', 'CLI'],
        excerpt: 'Learn about all parameters accepted by the Promscale CLI'
      },
      {
        title: 'SQL API functions reference',
        href: 'sql-api',
        tags: ['promscale', 'Structured Query Language', 'API', 'reference', 'functions'],
        keywords: ['Promscale', 'Structured Query Language', 'API','functions'],
        excerpt: 'Learn about all Promscale SQL API functions'
      }
    ]
  }
]

