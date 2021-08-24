module.exports = [
    {
        href: "overview",
        children: [
          {
            title: "What is time-series data?",
            href: "what-is-time-series-data",
            excerpt: "Learn about time-series data"
          },
          {
            href: "core-concepts",
            excerpt: "Why use TimescaleDB?",
            children : [
              {
                title: "Hypertables and chunks",
                href: "hypertables-and-chunks",
                excerpt: "Learn about hypertables and chunks in TimescaleDB"
              },
              {
                href: "scaling",
                excerpt: "Learn about scaling in TimescaleDB"
              },
              {
                href: "distributed-hypertables",
                excerpt: "Learn about distributed hypertables in TimescaleDB"
              },
              {
                href: "compression",
                excerpt: "Learn about compression in TimescaleDB"
              },
              {
                href: "continuous-aggregates",
                excerpt: "Learn about continuous aggregates in TimescaleDB"
              },
              {
                href: "data-retention",
                excerpt: "Learn about data retention in TimescaleDB"
              },
              {
                href: "user-defined-actions",
                excerpt: "Learn about user defined actions in TimescaleDB"
              },
              {
                title: "Backup & Restore",
                href: "backup-restore",
                excerpt: "Learn about backup and restore in TimescaleDB"
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
                href: "wide-data-model",
                excerpt: "Learn about TimescaleDB's support of wide data models"
              },
              {
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
                title: "PostgreSQL",
                href: "timescaledb-vs-postgres",
                excerpt: "Learn about the differences between TimescaleDB and PostgreSQL"
              },
              {
                title: "NoSQL",
                href: "timescaledb-vs-nosql",
                excerpt: "Learn about the differences between TimescaleDB and NoSQL databases"
              },
            ]
          },
          {
            href: "release-notes",
            children: [
              {
                title: "Changes in TimescaleDB 2.0",
                href: "changes-in-timescaledb-2"
              }
            ]
          },
          {
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
