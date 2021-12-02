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
        excerpt: "Learn how Promscale extracts metrics from your TimescaleDB instance"
      },
      {
        title: 'Install Promscale',
        href: 'installation',
        children: [
          {
            title: 'Install Promscale on bare metal',
            href: 'source',
            tags: ['promscale', 'install', 'analytics', 'prometheus'],
            keywords: ['Promscale', 'analytics'],
            excerpt: 'Install Promscale on bare metal',
          },
          {
            title: 'Install Docker',
            href: 'docker',
            tags: ['promscale', 'install', 'analytics', 'docker'],
            keywords: ['Promscale', 'analytics', 'Docker'],
            excerpt: 'Install Docker for Promscale',
          },
          {
            title: 'Install Helm',
            href: 'helm',
            tags: ['promscale', 'install', 'analytics', 'helm'],
            keywords: ['Promscale', 'analytics', 'Helm,'],
            excerpt: 'Install Helm for Promscale',
          },
          {
            title: 'Install Kubernetes',
            href: 'kubernetes',
            tags: ['promscale', 'install', 'analytics', 'k8s'],
            keywords: ['Promscale', 'analytics', 'Kubernetes,'],
            excerpt: "Install Kubernetes for Promscale"
          },
        ],
      },
      {
        title: 'Tutorials',
        href: 'tutorials',
        children: [
          {
            title: 'Promscale benefits tutorial',
            href: 'promscale-benefits',
            tags: ['promscale', 'learn', 'analytics', 'prometheus'],
            keywords: ['Promscale', 'analytics', 'tutorial'],
            excerpt: 'Learn about the benefits of Promscale',
          },
          {
            title: 'How Promscale works tutorial',
            href: 'promscale-how-it-works',
            tags: ['promscale', 'learn', 'analytics', 'prometheus'],
            keywords: ['Promscale', 'analytics', 'tutorial'],
            excerpt: 'Learn about how Promscale works',
          },
          {
            title: 'Run Queries in Promscale tutorial',
            href: 'promscale-run-queries',
            tags: ['promscale', 'learn', 'analytics', 'prometheus'],
            keywords: ['Promscale', 'analytics', 'tutorial'],
            excerpt: "Learn about running queries in Promscale"
          }
        ]
      }
    ]
  }
]
