module.exports = [
  {
    href: "overview",
    excerpt: "Overview of TimescaleDB",
    children: [
      {
        title: "What is time-series data?",
        href: "what-is-time-series-data",
        pageComponents: ["featured-cards"],
        excerpt: "Learn about time-series data",
      },
      {
        title: "Core concepts",
        href: "core-concepts",
        excerpt: "Why use TimescaleDB?",
        children: [
          {
            title: "Hypertables and chunks",
            href: "hypertables-and-chunks",
            excerpt: "Understanding hypertables and chunks",
            children: [
              {
                title: "Benefits of hypertables",
                href: "hypertables-and-chunks-benefits",
                excerpt:
                  "How hypertables can improve your time-series workflows",
              },
              {
                title: "Hypertable architecture",
                href: "hypertable-architecture",
                excerpt:
                  "Hypertable architecture, and how chunks and indexes work in hypertables",
              },
            ],
          },
          {
            title: "Distributed hypertables",
            href: "distributed-hypertables",
            excerpt: "Using distributed hypertables",
          },
          {
            title: "Compression",
            href: "compression",
            excerpt: "Using compression on hypertables",
            children: [
              {
                title: "Compression architecture",
                href: "architecture",
                excerpt: "Understanding compression architecture",
              },
            ],
          },
          {
            title: "Continuous aggregates",
            href: "continuous-aggregates",
            excerpt: "Using continuous aggregates",
          },
          {
            title: "Data retention",
            href: "data-retention",
            excerpt: "Configure data retention on hypertables",
          },
          {
            title: "User-defined actions",
            href: "user-defined-actions",
            excerpt: "Configure user-defined actions on hypertables",
          },
        ],
      },
      {
        title: "Deployment options",
        href: "deployment-options",
        excerpt: "Deployment options for TimescaleDB",
      },
      {
        title: "Data model flexibility",
        href: "data-model-flexibility",
        excerpt: "Learn about TimescaleDB's flexible data models",
      },
      {
        title: "How does it compare?",
        href: "how-does-it-compare",
        excerpt: "How does TimescaleDB compare to other technologies?",
        children: [
          {
            title: "Comparison with PostgreSQL",
            href: "timescaledb-vs-postgres",
            excerpt:
              "Learn about the differences between TimescaleDB and PostgreSQL",
          },
          {
            title: "Comparison with NoSQL",
            href: "timescaledb-vs-nosql",
            excerpt:
              "Learn about the differences between TimescaleDB and NoSQL databases",
          },
        ],
      },
      {
        title: "Release notes",
        href: "release-notes",
        excerpt: "Release notes for TimescaleDB",
        children: [
          {
            title: "Changes in TimescaleDB 2.0",
            tags: ["upgrade", "timescaledb", "2-x", "2-0"],
            href: "changes-in-timescaledb-2",
            excerpt: "Release notes for TimescaleDB 2.0",
          },
        ],
      },
      {
        title: "Limitations",
        href: "limitations",
        excerpt: "Product limitations of TimescaleDB",
      },
      {
        title: "FAQs",
        href: "faq",
        children: [
          {
            title: "FAQs: Products",
            href: "faq-products",
            excerpt: "Frequently asked product questions",
          },
          {
            title: "FAQs: Time-series databases",
            href: "faq-timeseries",
            excerpt: "Frequently asked time-series questions",
          },
          {
            title: "FAQs: Using TimescaleDB",
            href: "faq-using-timescaledb",
            excerpt: "Frequently asked TimescaleDB questions",
          },
          {
            title: "FAQs: PostgreSQL",
            href: "faq-postgres",
            excerpt: "Frequently asked PostgreSQL questions",
          },
          {
            title: "FAQs: Community",
            href: "faq-community",
            excerpt: "Frequently asked community questions",
          },
        ],
      },
    ],
  },
];
