module.exports = [
  {
    title: "Tutorials",
    href: "tutorials",
    excerpt: "Learn about common scenarios and use cases for Timescale",
    children: [
      {
        title: "Analytics on transport and geospatial data",
        href: "real-time-analytics-transport",
        excerpt: "Analyse your data in real-time",
      },
      {
        title: "Analytics on energy consumption",
        href: "real-time-analytics-energy-consumption",
        excerpt: "Analyse your data in real-time",
      },
      {
        title: "Simulate an IoT sensor dataset",
        href: "simulate-iot-sensor-data",
        excerpt: "Simulate and query an IoT sensor dataset",
      },
      {
        title: "Tiger community cookbook",
        href: "cookbook",
        excerpt: "Code examples from the community that help you with loads of common conundrums.",
      },
      {
        title: "Query the Bitcoin blockchain",
        href: "blockchain-query",
        excerpt: "Query the Bitcoin blockchain",
        children: [
          {
            title: "Ingest data into a service",
            href: "blockchain-dataset",
            excerpt:
              "Set up a dataset so you can query the Bitcoin blockchain",
          },
          {
            title: "Query the data",
            href: "beginner-blockchain-query",
            excerpt: "Query the Bitcoin blockchain dataset",
          },
          {
            title: "Compress your data using hypercore",
            href: "blockchain-compress",
            excerpt:
              "Compress the dataset so you can store the Bitcoin blockchain more efficiently",
          },
        ],
      },
      {
        title: "Analyze the Bitcoin blockchain",
        href: "blockchain-analyze",
        excerpt: "Analyze the Bitcoin blockchain with TimescaleDB hyperfunctions",
        children: [
          {
            title: "Ingest data into a service",
            href: "blockchain-dataset",
            excerpt:
              "Set up a dataset so you can analyze the Bitcoin blockchain",
          },
          {
            title: "Analyse the data",
            href: "analyze-blockchain-query",
            excerpt: "Analyze the Bitcoin blockchain dataset with TimescaleDB hyperfunctions",
          },
        ],
      },
      {
        title: "Analyze financial tick data ",
        href: "financial-tick-data",
        excerpt: "Use Tiger Cloud to store financial tick data",
        children: [
          {
            title: "Ingest data into a service",
            href: "financial-tick-dataset",
            excerpt: "Set up a dataset so you can query financial tick data",
          },
          {
            title: "Query the data",
            href: "financial-tick-query",
            excerpt: "Query and visualize financial tick data",
          },
          {
            title: "Compress your data using hypercore",
            href: "financial-tick-compress",
            excerpt:
              "Compress the dataset so you can store the data more efficiently",
          },
        ],
      },
      {
        title: "Ingest real-time financial data",
        href: "financial-ingest-real-time",
        excerpt: "Ingest real-time financial data with websocket",
        children: [
          {
            title: "Ingest data into a service",
            href: "financial-ingest-dataset",
            excerpt: "Set up a dataset so you can query the real-time data",
          },
          {
            title: "Query the data",
            href: "financial-ingest-query",
            excerpt: "Query and visualize real-time data",
          },
        ],
      },
    ],
  },
];
