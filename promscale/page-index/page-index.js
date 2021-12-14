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
        children: [
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
            tags: ['promscale', 'install', 'analytics', 'prometheus'],
            keywords: ['Promscale', 'analytics'],
            excerpt: 'Install Promscale on bare metal',
          },
          {
            title: 'Install Prom-migrator',
            href: 'prom-migrator',
            tags: ['promscale', 'install', 'analytics', 'prometheus'],
            keywords: ['Promscale', 'analytics'],
            excerpt: 'Install Prom-migrator',
          },
          {
            title: 'Install Promscale with tobs',
            href: 'tobs',
            tags: ['promscale', 'install', 'analytics', 'k8s'],
            keywords: ['Promscale', 'analytics', 'Kubernetes,'],
            excerpt: "Install tobs",
            children: [
              {
                title: 'About tobs',
                href: 'about-tobs',
                tags: ['tobs', 'k8s', 'monitor', 'learn', 'timescaledb'],
                keywords: ['tobs', 'Kubernetes', 'timescaleDB'],
                excerpt: 'Learn about the observability stack for Kubernetes (tobs)',
              },
              {
                title: 'Install tobs',
                href: 'install-tobs',
                tags: ['tobs', 'install', 'k8s', 'monitor', 'timescaledb'],
                keywords: ['tobs', 'Kubernetes', 'install', 'timescaleDB'],
                excerpt: 'Install the observability stack for Kubernetes (tobs)',
              },
              {
                title: 'Use tobs',
                href: 'using-tobs',
                tags: ['tobs', 'monitor', 'k8s', 'timescaledb'],
                keywords: ['tobs', 'Kubernetes', 'timescaleDB'],
                excerpt: 'Using the tobs',
              },
            ],
          },
          {
            title: 'Install Promscale with Helm',
            href: 'helm',
            tags: ['promscale', 'install', 'analytics', 'helm'],
            keywords: ['Promscale', 'analytics', 'Helm,'],
            excerpt: 'Install Helm for Promscale',
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
        excerpt: 'Learn about visualising queries in Promscale'
      }
    ]
  }
]
