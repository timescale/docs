module.exports = [
    {
        href: "overview",
        tags: ["timescaledb", "get started", "learn", "contribute"],
        keywords: ["TimescaleDB", "time-series", "data model", "deployment"],
        excerpt: "Overview of TimescaleDB",
        children: [
          {
            title: "What is time-series data?",
            href: "what-is-time-series-data",
            pageComponents: ['featured-cards'],
            tags: ['data', 'timescaledb'],
            keywords: ['TimescaleDB', 'data'],
            excerpt: "Learn about time-series data",
          },
          {
            title: "Core concepts",
            href: "core-concepts",
            excerpt: "Why use TimescaleDB?",
            children : [
              {
                title: "Hypertables and chunks",
                href: "hypertables-and-chunks",
                tags: ['hypertables', 'chunks', 'timescaledb'],
                keywords: ['hypertables', 'chunks', 'TimescaleDB'],
                excerpt: "Understanding hypertables and chunks"
              },
              {
                title: "Scaling",
                href: "scaling",
                tags: ['hypertables', 'chunks', 'timescaledb'],
                keywords: ['hypertables', 'chunks', 'TimescaleDB'],
                excerpt: "Scaling hypertables"
              },
              {
                title: "Distributed hypertables",
                href: "distributed-hypertables",
                tags: ['hypertables', 'distributed', 'timescaledb'],
                keywords: ['hypertables', 'distributed', 'TimescaleDB'],
                excerpt: "Using distributed hypertables"
              },
              {
                title: "Compression",
                href: "compression",
                tags: ['compression', 'hypertables', 'timescaledb'],
                keywords: ['hypertables', 'compression', 'TimescaleDB'],
                excerpt: "Using compression on hypertables"
              },
              {
                title: "Continuous aggregates",
                href: "continuous-aggregates",
                tags: ['caggs', 'query', 'hypertables', 'timescaledb'],
                keywords: ['Continuous aggregates', 'queries', 'TimescaleDB'],
                excerpt: "Using continuous aggregates"
              },
              {
                title: "Data retention",
                href: "data-retention",
                tags: ['data', 'configure', 'retention', 'hypertables', 'timescaledb'],
                keywords: ['data retention', 'TimescaleDB'],
                excerpt: "Configure data retention on hypertables"
              },
              {
                title: "User-defined actions",
                href: "user-defined-actions",
                tags: ['action', 'configure', 'hypertables', 'timescaledb'],
                keywords: ['actions', 'user-defined', 'TimescaleDB'],
                excerpt: "Configure user-defined actions on hypertables"
              },
              {
                title: "Backup and restore",
                href: "backup-restore",
                tags: ['backup', 'restore', 'hypertables', 'timescaledb'],
                keywords: ['backup', 'restore', 'TimescaleDB'],
                excerpt: "Configure backup and restore on hypertables"
              }
            ]
          },
          {
            title: "Deployment options",
            href: "deployment-options",
            tags: ['install', 'timescaledb', 'tsc', 'mst', 'self-hosted'],
            keywords: ['install', 'TimescaleDB', 'Timescale Forge', 'Timescale Cloud', 'self-hosted'],
            excerpt: "Deployment options for TimescaleDB",
          },
          {
            title: "TimescaleDB on Kubernetes",
            href: "timescale-kubernetes",
            tags: ['install', 'timescaledb', 'self-hosted', 'Kubernetes', 'Helm Charts'],
            keywords: ['install', 'TimescaleDB', 'self-hosted', 'Kubernetes'],
            excerpt: "Deployment options for TimescaleDB",
          },
          {
            title: "Data model flexibility",
            href: "data-model-flexibility",
            tags: ['data', 'model', 'timescaledb'],
            keywords: ['data model', 'TimescaleDB'],
            excerpt: "Learn about TimescaleDB's flexible data models",
            children: [
              {
                title: "Wide data model",
                href: "wide-data-model",
                tags: ['data', 'model', 'timescaledb'],
                keywords: ['data model', 'TimescaleDB'],
                excerpt: "Learn about TimescaleDB's support of wide data models"
              },
              {
                title: "Narrow data model",
                href: "narrow-data-model",
                tags: ['data', 'model', 'timescaledb'],
                keywords: ['data model', 'TimescaleDB'],
                excerpt: "Learn about TimescaleDB's support of narrow data models"
              }
            ]
          },
          {
            title: "How does it compare?",
            href: "how-does-it-compare",
            tags: ['compare', 'timescaledb'],
            keywords: ['compare', 'TimescaleDB'],
            excerpt: "How does TimescaleDB compare to other technologies?",
            children: [
              {
                title: "Comparison with PostgreSQL",
                href: "timescaledb-vs-postgres",
                tags: ['compare', 'timescaledb', 'postgresql'],
                keywords: ['compare', 'TimescaleDB', 'PostgreSQL'],
                excerpt: "Learn about the differences between TimescaleDB and PostgreSQL"
              },
              {
                title: "Comparison with NoSQL",
                href: "timescaledb-vs-nosql",
                tags: ['compare', 'timescaledb', 'nosql'],
                keywords: ['compare', 'TimescaleDB', 'nosql'],
                excerpt: "Learn about the differences between TimescaleDB and NoSQL databases"
              },
            ]
          },
          {
            title: "Release notes",
            href: "release-notes",
            tags: ['upgrade', 'timescaledb'],
            keywords: ['release notes', 'TimescaleDB'],
            excerpt: "Release notes for TimescaleDB",
            children: [
              {
                title: "Changes in TimescaleDB 2.0",
                tags: ['upgrade', 'timescaledb', '2-x', '2-0'],
                keywords: ['release notes', 'TimescaleDB', '2.0'],
                href: "changes-in-timescaledb-2",
                excerpt: "Release notes for TimescaleDB 2.0"
              }
            ]
          },
          {
            title: "Limitations",
            href: "limitations",
            tags: ['limitations', 'hypertables', 'timescaledb'],
            keywords: ['limitations', 'hypertables', 'TimescaleDB'],
            excerpt: "Product limitations of TimescaleDB"
          },
          {
            title: "FAQs",
            href: "faq",
            children: [
              {
                title: "FAQs: Products",
                href: "faq-products",
                excerpt: "Frequently asked product questions"
              },
              {
                title: "FAQs: Time-series databases",
                href: "faq-timeseries",
                excerpt: "Frequently asked time-series questions"
              },
              {
                title: "FAQs: Using TimescaleDB",
                href: "faq-using-timescaledb",
                excerpt: "Frequently asked TimescaleDB questions"
              },
              {
                title: "FAQs: PostgreSQL",
                href: "faq-postgres",
                excerpt: "Frequently asked PostgreSQL questions"
              },
              {
                title: "FAQs: Community",
                href: "faq-community",
                excerpt: "Frequently asked community questions"
              }
            ]
          },
        ]
      }
]
