module.exports = [
  {
    title: "Tutorials",
    href: "tutorials",
    excerpt: "Learn about common scenarios and use cases for Timescale",
    children: [
      {
        title: "Introduction to time-series data",
        href: "nyc-taxi-cab",
        excerpt: "An introduction to time-series using NYC taxi data",
        children: [
          {
            title: "Time-series tutorial - set up",
            href: "dataset-nyc",
            excerpt: "Set up a dataset so you can query NYC data",
          },
          {
            title: "Time-series tutorial - query data",
            href: "query-nyc",
            excerpt: "Query NYC data",
          },
        ],
      },
      {
        title: "Plot geospatial NYC taxi cab data",
        href: "nyc-taxi-geospatial",
        excerpt: "Learn how to plot geospatial time-series data with NYC taxi cabs",
        children: [
          {
            title: "Geospatial tutorial - set up",
            href: "dataset-nyc",
            excerpt: "Set up a dataset so you can plot geospatial NYC taxi data",
          },
          {
            title: "Geospatial tutorial - query data",
            href: "plot-nyc",
            excerpt: "Plot geospatial NYC taxi data",
          },
        ],
      },
      {
        title: "Analyze cryptocurrency data",
        href: "analyze-cryptocurrency-data",
        excerpt: "Use Timescale to analyze cryptocurrency data",
      },
      {
        title: "Analyze the Bitcoin blockchain",
        href: "analyze-bitcoin-blockchain",
        excerpt: "Store and query blockchain transactions",
        children: [
          {
            title: "Ingest and query Bitcoin transactions",
            href: "ingest-query-btc-transactions",
            excerpt:
              "Design schema and ingest Bitcoin blockchain data with Timescale",
          },
          {
            title: "Analyze the blockchain with hyperfunctions",
            href: "analyze-blockchain",
            excerpt: "Use Timescale hyperfunctions for blockchain insights",
          },
        ],
      },
      {
        title: "Store financial tick data in Timescale",
        href: "financial-tick-data",
        excerpt: "Use Timescale to store financial tick data",
        children: [
          {
            title: "Financial tick data - set up",
            href: "financial-tick-dataset",
            excerpt: "Set up a dataset so you can query financial tick data",
          },
          {
            title: "Financial tick data - query",
            href: "financial-tick-query",
            excerpt: "Query and visualize financial tick data",
          },
        ],
      },
      {
        title: "Ingest real-time financial websocket data",
        href: "ingest-real-time-websocket-data",
        excerpt: "Ingest real-time financial data with websocket",
      },
      {
        title: "Analyze NFT sales data",
        href: "analyze-nft-data",
        excerpt: "Analyze NFT sales data with Timescale",
        children: [
          {
            title: "NFT schema design and ingestion",
            href: "nft-schema-ingestion",
            excerpt: "Design schema and ingest NFT data with Timescale",
          },
          {
            title: "Analyzing NFT transactions",
            href: "analyzing-nft-transactions",
            excerpt:
              "Analyze NFT data transactions with PostgreSQL and hyperfunctions in Timescale",
          },
        ],
      },
      {
        title: "Monitor a Django application with Prometheus",
        href: "monitor-django-with-prometheus",
        excerpt: "Monitor a Django application with Prometheus",
      },
      {
        title: "Visualize data in Tableau",
        href: "visualize-with-tableau",
        excerpt: "Visualize data in Tableau with Timescale",
      },
      {
        title: "Custom Timescale dashboards",
        href: "custom-timescaledb-dashboards",
        excerpt: "Custom Timescale dashboards in Tableau",
      },
      {
        title: "Simulate IoT sensor data",
        href: "simulate-iot-sensor-data",
        excerpt: "Simulate IoT Sensor Data with Timescale",
      },
    ],
  },
];
