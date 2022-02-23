module.exports = [
  {
    title: 'Promscale',
    filePath: 'index.md',
    href: 'promscale',
    name: 'Promscale',
    pageComponents: ['featured-cards'],
    excerpt: 'Promscale is the open source observability backend for metrics and traces powered by SQL, built on top of TimescaleDB.',
    children: [
      {
        title: 'About Promscale',
        href: 'about-promscale',
        tags: ['promscale', 'learn', 'analytics', 'prometheus'],
        keywords: ['Promscale', 'analytics'],
        excerpt: 'Learn about Promscale and how it works'
      },
      {
        title: 'Promscale benefits',
        href: 'promscale-benefits',
        tags: ['promscale', 'learn', 'analytics', 'prometheus'],
        keywords: ['Promscale', 'analytics'],
        excerpt: 'Learn about the benefits of Promscale',
      },
      {
        title: 'Install Promscale',
        href: 'installation',
        tags: ['promscale', 'learn', 'analytics', 'prometheus'],
        keywords: ['Promscale', 'analytics'],
        excerpt: 'Install Promscale on Kubernetes, Docker, virtual machine, or bare metal',
        children: [
          {
            title: 'Install Promscale on Kubernetes',
            href: 'kubernetes',
            tags: ['promscale', 'install', 'kubernetes', 'analytics', 'helm'],
            keywords: ['Promscale', 'Kubernetes', 'analytics', 'Helm'],
            excerpt: 'Install Promscale on a Kubernetes cluster',
          },
          {
            title: 'Install Promscale with Docker',
            href: 'docker',
            tags: ['promscale', 'install', 'analytics', 'docker'],
            keywords: ['Promscale', 'analytics', 'Docker'],
            excerpt: 'Install Docker for Promscale',
          },
          {
            title: 'Install Promscale from source',
            href: 'source',
            tags: ['promscale', 'install', 'analytics'],
            keywords: ['Promscale', 'analytics'],
            excerpt: 'Install Promscale on bare metal',
          },
          {
            title: 'Migrate existing data',
            href: 'prom-migrator',
            tags: ['promscale', 'install', 'data', 'migration', 'prometheus'],
            keywords: ['Promscale', 'analytics'],
            excerpt: 'Use Prom-migrator to send existing Prometheus data to Promscale',
          },
          {
            title: 'Install Promscale with tobs',
            href: 'tobs',
            tags: ['promscale', 'install', 'analytics', 'k8s'],
            keywords: ['Promscale', 'analytics', 'Kubernetes,'],
            excerpt: "Install tobs",
          },
        ],
      },
      {
        title: 'tobs',
        href: 'tobs',
        excerpt: 'Install a complete observability stack in Kubernetes with tobs',
        children: [
          {
            title: 'About tobs',
            href: 'about',
            tags: ['tobs', 'install', 'k8s', 'monitor', 'timescaledb'],
            keywords: ['tobs', 'Kubernetes', 'install', 'timescaleDB', 'Promscale'],
            excerpt: 'Install the observability stack for Kubernetes (tobs)',
          },
          {
            title: 'Use tobs',
            href: 'use',
            tags: ['tobs', 'monitor', 'k8s', 'timescaledb'],
            keywords: ['tobs', 'Kubernetes', 'timescaleDB', 'Promscale'],
            excerpt: 'Using the observability suite for Kubernetes (tobs)',
          },
        ],
      },
      {
        title: 'Scale Promscale',
        href: 'scale-ha',
        excerpt: 'Configure Promscale for scaling and high availability',
        children: [
          {
            title: 'High availability',
            href: 'high-availability',
            tags: ['promscale', 'ha', 'timescaledb'],
            keywords: ['promscale', 'HA', 'prometheus', 'timescaledb'],
            excerpt: 'Configure Promscale for high availability',
          },
          {
            title: 'Multi-node',
            href: 'multi-node',
            tags: ['promscale', 'multi-node', 'scale', 'timescaledb'],
            keywords: ['promscale', 'multinode', 'scale', 'timescaledb'],
            excerpt: 'Scale Promscale with a TimescaleDB multinode database',
          },
          {
            title: 'Prometheus multi-tenancy',
            href: 'prometheus-multi-tenancy',
            tags: ['promscale', 'multi-tenancy', 'scale', 'prometheus', 'timescaledb'],
            keywords: ['promscale', 'multi-tenancy', 'scale', 'prometheus', 'timescaledb'],
            excerpt: 'Configure Promscale multi-tenancy for Prometheus',
          },
        ],
      },
      {
        title: 'Send data to Promscale',
        href: 'send-data',
        excerpt: 'Send data to Promscale from Prometheus, OpenTelemetry and other tools',
        children: [
          {
            title: 'Prometheus',
            href: 'prometheus',
            tags: ['promscale', 'configure', 'prometheus', 'metrics'],
            keywords: ['Promscale', 'Prometheus'],
            excerpt: 'Send Prometheus metrics to Promscale',
          },
          {
            title: 'OpenTelemetry',
            href: 'opentelemetry',
            tags: ['promscale', 'configure', 'opentelemetry', 'traces'],
            keywords: ['Promscale', 'OpenTelemetry'],
            excerpt: 'Send OpenTelemetry data to Promscale',
          },
        ],
      },
      {
        title: 'Query data in Promscale',
        href: 'query-data',
        tags: ['promscale', 'analytics', 'sql', 'promql', 'prometheus'],
        keywords: ['Promscale', 'analytics'],
        excerpt: 'Learn how to query data in Promscale'
      },
      {
        title: 'Visualize data in Promscale',
        href: 'visualize-data',
        tags: ['promscale', 'visualization', 'analytics', 'grafana', 'prometheus'],
        keywords: ['Promscale', 'analytics', 'Grafana'],
        excerpt: 'Learn about data visualization tools you can use with Promscale'
      },
      {
        title: 'Distributed tracing with Promscale',
        href: 'distributed-tracing',
        tags: ['promscale', 'tracing', 'opentelemetry', 'jaeger', 'grafana'],
        keywords: ['Promscale', 'opentelemetry', 'tracing', 'jaeger'],
        excerpt: 'Use Promscale for troubleshooting applications with distributed tracing'
      },
      {
        title: 'Alert in Promscale',
        href: 'alert',
        tags: ['promscale', 'prometheus', 'alert'],
        keywords: ['Promscale', 'Prometheus', 'alert', 'Alert Manager'],
        excerpt: 'Learn about configuring alerts on Promscale data'
      },
      {
        title: 'Database roles and permissions',
        href: 'roles-and-permissions',
        tags: ['promscale', 'roles', 'permissions', 'database'],
        keywords: ['Promscale', 'analytics', 'permissions', 'roles'],
        excerpt: 'Learn about the different database roles and permissions Promscale defines'
      },
      {
        title: 'Troubleshooting Promscale',
        href: 'troubleshooting',
        tags: ['promscale', 'learn', 'troubleshooting', 'prometheus'],
        keywords: ['Promscale', 'troubleshooting'],
        excerpt: 'Troubleshooting Promscale'
      }
    ]
  }
]
