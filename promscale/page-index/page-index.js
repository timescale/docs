const tutorialPageIndex = require('../tutorials/page-index/page-index')
const installPageIndex = require('../installation/page-index/page-index')

module.exports = [
  {
    title: 'Promscale',
    filePath: 'index.md',
    href: 'promscale',
    name: 'Promscale',
    pageComponents: ['featured-cards'],
    excerpt:
      'Promscale is an open source long-term store for Prometheus data designed for analytics, built on top of TimescaleDB.',
      {
        title: 'About Promscale',
        href: 'about-promscale',
        tags: ['learn', 'promscale', 'timescaledb'],
        keywords: ['Promscale'],
        excerpt: "Learn how Promscale extracts metrics from your TimescaleDB instance"
      },
      {
        title: 'Install Promscale',
        href: 'installation',
        children: [
          {
            title: 'Install Promscale on bare metal',
            href: 'bare-metal',
            tags: ['promscale'],
            keywords: ['observability', 'tutorial'],
            excerpt: 'Bare metal installation',
          },
          {
            title: 'Install Docker',
            href: 'docker',
            tags: ['promscale'],
            keywords: ['observability', 'tutorial'],
            excerpt: 'Docker installation',
          },
          {
            title: 'Install Helm',
            href: 'helm',
            tags: ['promscale'],
            keywords: ['observability', 'tutorial'],
            excerpt: 'Helm installation',
          },
          {
            title: 'Install Kubernetes',
            href: 'kubernetes',
            tags: ['promscale'],
            keywords: ['observability', 'tutorial'],
            excerpt: "Kubernetes installation"
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
            tags: ['promscale'],
            keywords: ['observability', 'tutorial'],
            excerpt: 'Benefits of Promscale',
          },
          {
            title: 'How Promscale works tutorial',
            href: 'promscale-how-it-works',
            tags: ['promscale'],
            keywords: ['observability', 'tutorial'],
            excerpt: 'How Promscale works',
          },
          {
            title: 'Run Queries in Promscale tutorial',
            href: 'promscale-run-queries',
            tags: ['promscale'],
            keywords: ['observability', 'tutorial'],
            excerpt: "Running Queries in Promscale"
          },
        ],
      },
    ],
  },
];
