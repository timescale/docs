module.exports = [
  {
    title: "Implement engineering user cases",
    href: "tutorials",
    excerpt: "Learn about common scenarios and use cases for Timescale",
    children: [
      {
        title: "Use Timescale hyperfunctions to analyze Bitcoin transactions",
        href: "analyse-bitcoin-transactions",
        excerpt: "Analyze Bitcoing transactions using Hyperfunctions",
        children: [
          {
            title: "Set up",
            href: "blockchain-dataset",
            excerpt:
              "Set up a dataset so you can query the Bitcoin blockchain",
          },
          {
            title: "Query data",
            href: "analyze-blockchain-query",
            excerpt: "Query the Bitcoin blockchain dataset",
          },
          {
            title: "Set up compression",
            href: "blockchain-compress",
            excerpt:
              "Compress the dataset so you can store the Bitcoin blockchain more efficiently",
          },
        ],
      },
      {
        title: "Analyze energy consumption data",
        href: "energy-data",
        excerpt: "Learn how to analyze energy consumption data",
        children: [
          {
            title: "Set up",
            href: "dataset-energy",
            excerpt: "Set up a dataset so you can analyze energy consumption data",
          },
          {
            title: "Query data",
            href: "query-energy",
            excerpt: "Queries energy consumption data",
          },
          {
            title: "Bonus: set up compression",
            href: "compress-energy",
            excerpt:
              "Compress the dataset so you can store the data more efficiently",
          },
        ]
      },
      {
        title: "Ingest real-time financial websocket data",
        href: "financial-ingest-real-time",
        excerpt: "Ingest real-time financial data with websocket",
        children: [
          {
            title: "Set up",
            href: "financial-ingest-dataset",
            excerpt: "Set up a dataset so you can query the real-time data",
          },
          {
            title: "Query data",
            href: "financial-ingest-query",
            excerpt: "Query and visualize real-time data",
          },
        ],
      },
      {
        title: "Plot geospatial NYC taxi cab data",
        href: "nyc-taxi-geospatial",
        excerpt: "Learn how to plot geospatial time-series data with NYC taxi cabs",
        children: [
          {
            title: "Set up",
            href: "dataset-nyc",
            excerpt: "Set up a dataset so you can plot geospatial NYC taxi data",
          },
          {
            title: "Query data",
            href: "plot-nyc",
            excerpt: "Plot geospatial NYC taxi data",
          },
        ],
      },
    ],
  },
];
