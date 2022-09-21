module.exports = [
  {
    href: "overview",
    tags: ["timescaledb", "get started", "learn", "contribute"],
    excerpt: "Overview of TimescaleDB",
    children: [
      {
        title: "What is time-series data?",
        href: "what-is-time-series-data",
        pageComponents: ["featured-cards"],
        tags: ["data", "timescaledb"],
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
            tags: ["hypertables", "chunks", "timescaledb"],
            excerpt: "Understanding hypertables and chunks",
            children: [
              {
                title: "Benefits of hypertables",
                href: "hypertables-and-chunks-benefits",
                tags: ["hypertables", "chunks", "timescaledb"],
                excerpt:
                  "How hypertables can improve your time-series workflows",
              },
              {
                title: "Hypertable architecture",
                href: "hypertable-architecture",
                tags: ["hypertables", "chunks", "timescaledb"],
                excerpt:
                  "Hypertable architecture, and how chunks and indexes work in hypertables",
              },
            ],
          },
          {
            title: "Scaling",
            href: "scaling",
            tags: ["hypertables", "chunks", "timescaledb"],
            excerpt: "Scaling hypertables",
          },
          {
            title: "Distributed hypertables",
            href: "distributed-hypertables",
            tags: ["hypertables", "distributed", "timescaledb"],
            excerpt: "Using distributed hypertables",
          },
          {
            title: "Compression",
            href: "compression",
            tags: ["compression", "hypertables", "timescaledb"],
            excerpt: "Using compression on hypertables",
            children: [
              {
                title: "Compression architecture",
                href: "architecture",
                tags: ["compression", "hypertables", "timescaledb"],
                excerpt: "Understanding compression architecture",
              },
            ],
          },
          {
            title: "Continuous aggregates",
            href: "continuous-aggregates",
            tags: ["caggs", "query", "hypertables", "timescaledb"],
            excerpt: "Using continuous aggregates",
          },
          {
            title: "Data retention",
            href: "data-retention",
            tags: [
              "data",
              "configure",
              "retention",
              "hypertables",
              "timescaledb",
            ],
            excerpt: "Configure data retention on hypertables",
          },
          {
            title: "User-defined actions",
            href: "user-defined-actions",
            tags: ["action", "configure", "hypertables", "timescaledb"],
            excerpt: "Configure user-defined actions on hypertables",
          },
          {
            title: "Backup and restore",
            href: "backup-restore",
            tags: ["backup", "restore", "hypertables", "timescaledb"],
            excerpt: "Configure backup and restore on hypertables",
          },
        ],
      },
      {
        title: "Deployment options",
        href: "deployment-options",
        tags: ["install", "timescaledb", "tsc", "mst", "self-hosted"],
        excerpt: "Deployment options for TimescaleDB",
      },
      {
        title: "TimescaleDB on Kubernetes",
        href: "timescale-kubernetes",
        tags: [
          "install",
          "timescaledb",
          "self-hosted",
          "Kubernetes",
          "Helm Charts",
        ],
        excerpt: "Deployment options for TimescaleDB",
      },
      {
        title: "Data model flexibility",
        href: "data-model-flexibility",
        tags: ["data", "model", "timescaledb"],
        excerpt: "Learn about TimescaleDB's flexible data models",
      },
      {
        title: "How does it compare?",
        href: "how-does-it-compare",
        tags: ["compare", "timescaledb"],
        excerpt: "How does TimescaleDB compare to other technologies?",
        children: [
          {
            title: "Comparison with PostgreSQL",
            href: "timescaledb-vs-postgres",
            tags: ["compare", "timescaledb", "postgresql"],
            excerpt:
              "Learn about the differences between TimescaleDB and PostgreSQL",
          },
          {
            title: "Comparison with NoSQL",
            href: "timescaledb-vs-nosql",
            tags: ["compare", "timescaledb", "nosql"],
            excerpt:
              "Learn about the differences between TimescaleDB and NoSQL databases",
          },
        ],
      },
      {
        title: "Release notes",
        href: "release-notes",
        tags: ["upgrade", "timescaledb"],
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
        tags: ["limitations", "hypertables", "timescaledb"],
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
