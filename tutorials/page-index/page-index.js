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
          {
            title: "Time-series tutorial - advanced queries",
            href: "advanced-nyc",
            excerpt: "Advanced queries NYC data",
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
        title: "Grafana",
        href: "grafana",
        excerpt: "Getting Started with Grafana and Timescale",
        children: [
          {
            title: "Connect Timescale and Grafana",
            href: "grafana-timescalecloud",
            excerpt: "Learn how to connect Timescale and Grafana",
          },
          {
            title: "Setup Grafana on Managed Service for Timescale",
            href: "installation",
            excerpt:
              "Learn how to setup Grafana and Timescale on Managed Service for TimescaleDB",
          },
          {
            title: "Create a dashboard and panel",
            href: "create-dashboard-and-panel",
            excerpt:
              "Create a dashboard and panel with Grafana and Timescale",
          },
          {
            title: "Build Geospatial dashboards",
            href: "geospatial-dashboards",
            excerpt: "Build Geospatial dashboards with Grafana and Timescale",
          },
          {
            title: "Use Grafana variables",
            href: "grafana-variables",
            excerpt: "Use Grafana variables with Timescale",
          },
          {
            title: "Visualize missing data",
            href: "visualize-missing-data",
            excerpt: "Visualize missing data in Grafana with Timescale",
          },
          {
            title: "Setup alerts",
            href: "setup-alerts",
            excerpt: "Setup alerts in Grafana with Timescale",
          },
          {
            title: "Visualizations",
            href: "visualizations",
            excerpt: "Grafana visualizations",
            children: [
              {
                title: "Time-series",
                href: "time-series",
                tags: [
                  "grafana",
                  "visualize",
                  "time-series",
                  "learn",
                  "timescaledb",
                ],
                excerpt: "Graph time-series data in Grafana",
              },
              {
                title: "Histograms",
                href: "histograms",
                excerpt: "How to build a histogram in Grafana",
              },
              {
                title: "Candlestick",
                href: "candlestick",
                excerpt: "How to build a candlestick chart in Grafana",
              },
              {
                title: "Bar chart",
                href: "bar-chart",
                excerpt: "How to build a bar chart in Grafana",
              },
              {
                title: "Pie chart",
                href: "pie-chart",
                excerpt: "How to build a pie chart in Grafana",
              },
            ],
          },
        ],
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
