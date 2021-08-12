module.exports = [
    {
        href: "overview",
        children: [
          {
            title: "What is time-series data?",
            href: "what-is-time-series-data"
          },
          {
            title: "Core concepts",
            href: "core-concepts",
            children : [
              {
                title: "Hypertables and chunks",
                href: "hypertables-and-chunks"
              },
              {
                title: "Scaling",
                href: "scaling"
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
            href: "deployment-options"
          },
          {
            title: "Data model flexibility",
            href: "data-model-flexibility",
            children: [
              {
                title: "Wide data model",
                href: "wide-data-model"
              },
              {
                title: "Narrow data model",
                href: "narrow-data-model"
              }
            ]
          },
          {
            title: "How does it compare?",
            href: "how-does-it-compare",
            children: [
              {
                title: "Comparison with PostgreSQL"
                href: "timescaledb-vs-postgres"
              },
              {
                title: "Comparison with NoSQL",
                href: "timescaledb-vs-nosql"
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
                title: "FAQs: PostgreSQL",
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
