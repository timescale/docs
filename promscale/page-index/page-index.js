module.exports = [
  {
    title: 'Promscale',
    filePath: 'index.md',
    href: 'promscale',
    name: 'Promscale',
    pageComponents: ['featured-cards'],
    excerpt: 'Promscale is an open source long-term store for Prometheus data designed for analytics, built on top of TimescaleDB.',
    children: [
      {
        title: 'About Promscale',
        href: 'about-promscale',
        tags: ['promscale', 'learn', 'analytics', 'prometheus'],
        keywords: ['Promscale', 'analytics'],
        excerpt: 'Learn how Promscale extracts metrics from your TimescaleDB instance'
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
        excerpt: 'Learn about installing Promscale',
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
            title: 'Configure Prometheus',
            href: 'configure-prometheus',
            tags: ['promscale', 'configure', 'prometheus'],
            keywords: ['Promscale', 'Prometheus'],
            excerpt: 'Configure Prometheus to send metrics to Promscale',
          },
          {
            title: 'Configure OpenTelemetry Collector',
            href: 'configure-otel-collector',
            tags: ['promscale', 'configure', 'opentelemetry'],
            keywords: ['Promscale', 'OpenTelemetry'],
            excerpt: 'Configure OpenTelemetry to send metrics, traces to Promscale',
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
        title: 'Tobs',
        href: 'tobs',
        tags: ['tobs', 'k8s', 'monitor', 'learn', 'timescaledb'],
        keywords: ['tobs', 'Kubernetes', 'timescaleDB', 'Promscale'],
        excerpt: 'Learn about the observability stack for Kubernetes (tobs)',
        children: [
          {
            title: 'About',
            href: 'about',
            tags: ['tobs', 'install', 'k8s', 'monitor', 'timescaledb'],
            keywords: ['tobs', 'Kubernetes', 'install', 'timescaleDB', 'Promscale'],
            excerpt: 'Install the observability stack for Kubernetes (tobs)',
          },
          {
            title: 'Usage guide',
            href: 'usage-guide',
            tags: ['tobs', 'monitor', 'k8s', 'timescaledb'],
            keywords: ['tobs', 'Kubernetes', 'timescaleDB', 'Promscale'],
            excerpt: 'Using the observability suite for Kubernetes (tobs)',
          },
        ],
      },
      {
        title: 'Run Queries in Promscale',
        href: 'promscale-run-queries',
        tags: ['promscale', 'analytics', 'prometheus'],
        keywords: ['Promscale', 'analytics'],
        excerpt: 'Learn about running queries in Promscale'
      },
      {
        title: 'Promscale and visualization',
        href: 'promscale-visualization',
        tags: ['promscale', 'visualization', 'analytics', 'grafana', 'prometheus'],
        keywords: ['Promscale', 'analytics', 'Grafana'],
        excerpt: 'Learn about visualizing queries in Promscale'
      }
    ]
  }
]
