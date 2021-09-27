module.exports = [
  {
    title: 'Promscale',
    filePath: 'index.md',
    href: 'promscale',
    name: 'Promscale',
    pageComponents: ['featured-cards'],
    excerpt:
      'Promscale is an open source long-term store for Prometheus data designed for analytics, built on top of TimescaleDB.',
    children: [
      {
        title: 'About Promscale',
        href: 'about-promscale',
        tags: ['learn', 'promscale', 'timescaledb'],
        keywords: ['Promscale'],
        excerpt: "Learn how Promscale extracts metrics from your TimescaleDB instance"
      },
      {
        title: 'Install Promscale',
        href: 'install-promscale',
        tags: ['install', 'promscale', 'timescaledb'],
        keywords: ['install', 'Promscale'],
        excerpt: "Install Promscale on TimescaleDB"
      },
    ],
  },
];
