module.exports = [
    {
        href: "overview",
        children: [
          {
            title: "What is time-series data?",
            href: "what-is-time-series-data"
          },
          {
            href: "core-concepts",
            children : [
              {
                title: "Hypertables and chunks",
                href: "hypertables-and-chunks"
              },
              {
                href: "scaling"
              },
              {
                href: "distributed-hypertables"
              },
              {
                href: "compression"
              },
              {
                href: "continuous-aggregates"
              },
              {
                href: "data-retention"
              },
              {
                href: "user-defined-actions"
              },
              {
                title: "Backup & Restore",
                href: "backup-restore"
              }
            ]
          },
          {
            href: "deployment-options"
          },
          {
            title: "Data model flexibility",
            href: "data-model-flexibility",
            children: [
              {
                href: "wide-data-model"
              },
              {
                href: "narrow-data-model"
              }
            ]
          },
          {
            title: "How does it compare?",
            href: "how-does-it-compare",
            children: [
              {
                title: "PostgreSQL",
                href: "timescaledb-vs-postgres"
              },
              {
                title: "NoSQL",
                href: "timescaledb-vs-nosql"
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
                href: "faq-products"
              },
              {
                title: "FAQs: Time-series databases",
                href: "faq-timeseries"
              },
              {
                title: "FAQs: Using TimescaleDB",
                href: "faq-using-timescaledb"
              },
              {
                title: "FAQs: Postgres",
                href: "faq-postgres"
              },
              {
                title: "FAQs: Community",
                href: "faq-community"
              }
            ]
          },
        ]
      }
]
