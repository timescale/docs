module.exports = [
    {
        href: "overview",
        children: [
          {
            title: "What is time-series data?",
            href: "what-is-time-series-data",
            pageComponents: ['featured-cards'],
            tags: ['data', 'timescaledb'],
            keywords: ['TimescaleDB', 'data'],
            excerpt: "Learn about time-series data"
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
                keywords: ['hypertables', 'chunks', 'timescaledb'],
                excerpt: ['Understanding hypertables and chunks']
              },
              {
                title: "Scaling",
                href: "scaling",
                tags: ['hypertables', 'chunks', 'timescaledb'],
                keywords: ['hypertables', 'chunks', 'timescaledb'],
                excerpt: ['Understanding hypertables and chunks']
              },
              {
                title: "Distributed hypertables",
                href: "distributed-hypertables"
              },
              {
                title: "Compression",
                href: "compression"
              },
              {
                title: "Continuous aggregates",
                href: "continuous-aggregates"
              },
              {
                title: "Data retention",
                href: "data-retention"
              },
              {
                title: "User-defined actions",
                href: "user-defined-actions"
              },
              {
                title: "Backup and restore",
                href: "backup-restore"
              }
            ]
          },
          {
            href: "deployment-options",
            excerpt: "Deployment options for TimescaleDB"
          },
          {
            title: "Data model flexibility",
            href: "data-model-flexibility",
            excerpt: "Learn about TimescaleDB's flexible data models",
            children: [
              {
                title: "Wide data model",
                href: "wide-data-model",
                excerpt: "Learn about TimescaleDB's support of wide data models"
              },
              {
                title: "Narrow data model",
                href: "narrow-data-model",
                excerpt: "Learn about TimescaleDB's support of narrow data models"
              }
            ]
          },
          {
            title: "How does it compare?",
            href: "how-does-it-compare",
            excerpt: "How does TimescaleDB compare to other technologies?",
            children: [
              {
                title: "Comparison with PostgreSQL"
                href: "timescaledb-vs-postgres",
                excerpt: "Learn about the differences between TimescaleDB and PostgreSQL"
              },
              {
                title: "Comparison with NoSQL",
                href: "timescaledb-vs-nosql",
                excerpt: "Learn about the differences between TimescaleDB and NoSQL databases"
              },
            ]
          },
          {
            title: "Release notes",
            href: "release-notes",
            children: [
              {
                title: "Changes in TimescaleDB 2.0",
                href: "changes-in-timescaledb-2"
              }
            ]
          },
          {
            title: "Limitations",
            href: "limitations"
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
