module.exports = [
  {
    title: "Tutorials",
    href: "tutorials",
    tags: ["timescaledb", "overview", "get started", "learn"],
    excerpt: "Learn about common scenarios and use cases for TimescaleDB",
    children: [
      {
        title: "Introduction to IoT",
        href: "nyc-taxi-cab",
        tags: ["iot", "query", "learn", "tsc"],
        excerpt: "An introduction to IoT using NYC taxi data",
        children: [
          {
            title: "IoT tutorial - set up",
            href: "dataset-iot",
            tags: ["tutorials", "create", "dataset", "iot"],
            excerpt: "Set up a dataset so you can query IoT data]",
          },
          {
            title: "IoT tutorial - query data",
            href: "query-iot",
            tags: ["tutorials", "query", "iot"],
            excerpt: "Query IoT data]",
          },
      },
      {
        title: "Introduction to time-series forecasting",
        href: "time-series-forecast",
        tags: ["r", "analyze", "learn", "timescaledb"],
        excerpt:
          "An introduction to time-series forecasting using NYC taxi data",
      },
      {
        title: "Analyze cryptocurrency data",
        href: "analyze-cryptocurrency-data",
        tags: ["cryptocurrency", "finance", "analyze", "learn", "timescaledb"],
        excerpt: "Use TimescaleDB to analyze cryptocurrency data",
      },
      {
        title: "Analyze the Bitcoin blockchain",
        href: "analyze-bitcoin-blockchain",
        tags: ["blockchain", "bitcoin", "analyze", "learn", "timescaledb"],
        excerpt: "Store and query blockchain transactions",
        children: [
          {
            title: "Ingest and query Bitcoin transactions",
            href: "ingest-query-btc-transactions",
            tags: ["bitcoin", "blockchain", "analyze", "learn", "timescaledb"],
            excerpt:
              "Design schema and ingest Bitcoin blockchain data with TimescaleDB",
          },
          {
            title: "Analyze the blockchain with hyperfunctions",
            href: "analyze-blockchain",
            tags: [
              "bitcoin",
              "blockchain",
              "hyperfunctions",
              "learn",
              "timescaledb",
            ],
            excerpt: "Use TimescaleDB hyperfunctions for blockchain insights",
          },
        ],
      },
      {
        title: "Store financial tick data in TimescaleDB",
        href: "financial-candlestick-tick-data",
        tags: ["candlestick", "finance", "analyze", "ohlcv", "timescaledb"],
        excerpt: "Use TimescaleDB to store financial tick data",
        children: [
          {
            title: "Design schema and ingest tick data",
            href: "design-tick-schema",
            tags: ["tick", "schema", "candlestick", "timescaledb"],
            excerpt: "Design a relational schema for real-time tick data",
          },
          {
            title: "Create candlestick aggregates",
            href: "create-candlestick-aggregates",
            tags: ["candlestick", "finance", "analyze", "ohlcv", "timescaledb"],
            excerpt: "Use continuous aggregates to create candlestick views",
          },
          {
            title: "Query the candlestick views",
            href: "query-candlestick-views",
            tags: ["candlestick", "finance", "analyze", "ohlcv", "timescaledb"],
            excerpt: "Query the continuous aggregates for candlestick data",
          },
          {
            title: "Advanced data management",
            href: "advanced-data-management",
            tags: ["candlestick", "finance", "analyze", "ohlcv", "timescaledb"],
            excerpt: "Advanced data management techniques",
          },
        ],
      },
      {
        title: "Ingest real-time financial websocket data",
        href: "ingest-real-time-websocket-data",
        tags: ["websocket", "finance", "real-time", "ingest", "timescaledb"],
        excerpt: "Ingest real-time financial data with websocket",
      },
      {
        title: "Analyze NFT sales data",
        href: "analyze-nft-data",
        tags: ["nft", "finance", "analyze", "learn", "timescaledb"],
        excerpt: "Analyze NFT sales data with TimescaleDB",
        children: [
          {
            title: "NFT schema design and ingestion",
            href: "nft-schema-ingestion",
            tags: ["nft", "finance", "analyze", "learn", "timescaledb"],
            excerpt: "Design schema and ingest NFT data with TimescaleDB",
          },
          {
            title: "Analyzing NFT transactions",
            href: "analyzing-nft-transactions",
            tags: ["nft", "finance", "analyze", "learn", "timescaledb"],
            excerpt:
              "Analyze NFT data transactions with PostgreSQL and hyperfunctions in TimescaleDB",
          },
        ],
      },
      {
        title: "Analyze intraday stock data",
        href: "analyze-intraday-stocks",
        tags: ["finance", "analyze", "learn", "timescaledb"],
        excerpt: "Analyze intraday stock data with TimescaleDB",
        children: [
          {
            title: "Design database schema",
            href: "design-schema",
            tags: ["finance", "create", "learn", "timescaledb"],
            excerpt:
              "Design a database schema for intraday stock data analysis",
          },
          {
            title: "Fetch and ingest stock data",
            href: "fetch-and-ingest",
            tags: ["finance", "ingest", "learn", "timescaledb"],
            excerpt: "Fetch and ingest stock data using TimescaleDB",
          },
          {
            title: "Explore stock market data",
            href: "explore-stocks-data",
            tags: ["finance", "analyze", "learn", "timescaledb"],
            excerpt: "Explore stock market data with TimescaleDB",
          },
        ],
      },
      {
        title: "Analyze data using hyperfunctions",
        href: "nfl-analytics",
        tags: ["hyperfunctions", "analyze", "learn", "timescaledb"],
        excerpt: "Analyze NFL data using TimescaleDB",
        children: [
          {
            title: "Ingest and query data",
            href: "ingest-and-query",
            tags: ["hyperfunctions", "ingest", "query", "learn", "timescaledb"],
            excerpt: "Ingest and query NFL data with TimescaleDB",
          },
          {
            title: "Analyze data using SQL and hyperfunctions",
            href: "advanced-analysis",
            tags: ["hyperfunctions", "analyze", "learn", "timescaledb"],
            excerpt:
              "Analyze NFL data using SQL and hyperfunctions in TimescaleDB",
          },
          {
            title: "Join time-series and relational data",
            href: "join-with-relational",
            tags: ["hyperfunctions", "analyze", "learn", "timescaledb"],
            excerpt: "Join time-series and relational NFL data in TimescaleDB",
          },
          {
            title: "Visualize time-series data",
            href: "play-visualization",
            tags: ["hyperfunctions", "visualize", "learn", "timescaledb"],
            excerpt: "Visualize NFL data with TimescaleDB",
          },
        ],
      },
      {
        title: "Monitor MST with Prometheus",
        href: "monitor-mst-with-prometheus",
        tags: ["prometheus", "monitor", "learn", "timescaledb"],
        excerpt: "Monitor MST with Prometheus",
      },
      {
        title: "Monitor a Django application with Prometheus",
        href: "monitor-django-with-prometheus",
        tags: ["prometheus", "django", "monitor", "learn", "timescaledb"],
        excerpt: "Monitor a Django application with Prometheus",
      },
      {
        title: "Collect metrics with Telegraf",
        href: "telegraf-output-plugin",
        tags: ["telegraf", "monitor", "learn", "timescaledb"],
        excerpt: "Collect metrics with Telegraf",
      },
      {
        title: "Grafana",
        href: "grafana",
        tags: ["grafana", "visualize", "learn", "timescaledb"],
        excerpt: "Getting Started with Grafana and TimescaleDB",
        children: [
          {
            title: "Connect TimescaleDB and Grafana",
            href: "grafana-timescalecloud",
            tags: ["grafana", "visualize", "install", "learn", "timescaledb"],
            excerpt: "Learn how to connect TimescaleDB and Grafana",
          },
          {
            title: "Setup Grafana on Managed Service for TimescaleDB",
            href: "installation",
            tags: ["grafana", "visualize", "install", "learn", "timescaledb"],
            excerpt:
              "Learn how to setup Grafana and TimescaleDB on Managed Service for TimescaleDB",
          },
          {
            title: "Create a dashboard and panel",
            href: "create-dashboard-and-panel",
            tags: ["grafana", "visualize", "create", "learn", "timescaledb"],
            excerpt:
              "Create a dashboard and panel with Grafana and TimescaleDB",
          },
          {
            title: "Build Geospatial dashboards",
            href: "geospatial-dashboards",
            tags: ["grafana", "visualize", "create", "learn", "timescaledb"],
            excerpt: "Build Geospatial dashboards with Grafana and TimescaleDB",
          },
          {
            title: "Use Grafana variables",
            href: "grafana-variables",
            tags: ["grafana", "visualize", "manage", "learn", "timescaledb"],
            excerpt: "Use Grafana variables with TimescaleDB",
          },
          {
            title: "Visualize missing data",
            href: "visualize-missing-data",
            tags: ["grafana", "visualize", "manage", "learn", "timescaledb"],
            excerpt: "Visualize missing data in Grafana with TimescaleDB",
          },
          {
            title: "Setup alerts",
            href: "setup-alerts",
            tags: ["grafana", "visualize", "alert", "learn", "timescaledb"],
            excerpt: "Setup alerts in Grafana with TimescaleDB",
          },
          {
            title: "Visualizations",
            href: "visualizations",
            tags: ["grafana", "visualize", "learn", "timescaledb"],
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
                tags: [
                  "grafana",
                  "visualize",
                  "histograms",
                  "learn",
                  "timescaledb",
                ],
                excerpt: "How to build a histogram in Grafana",
              },
              {
                title: "Candlestick",
                href: "candlestick",
                tags: [
                  "grafana",
                  "visualize",
                  "candlestick",
                  "learn",
                  "timescaledb",
                ],
                excerpt: "How to build a candlestick chart in Grafana",
              },
              {
                title: "Bar chart",
                href: "bar-chart",
                tags: [
                  "grafana",
                  "visualize",
                  "bar chart",
                  "learn",
                  "timescaledb",
                ],
                excerpt: "How to build a bar chart in Grafana",
              },
              {
                title: "Pie chart",
                href: "pie-chart",
                tags: [
                  "grafana",
                  "visualize",
                  "pie chart",
                  "learn",
                  "timescaledb",
                ],
                excerpt: "How to build a pie chart in Grafana",
              },
            ],
          },
        ],
      },
      {
        title: "Visualize data in Tableau",
        href: "visualize-with-tableau",
        tags: ["tableau", "visualize", "learn", "timescaledb"],
        excerpt: "Visualize data in Tableau with TimescaleDB",
      },
      {
        title: "Custom TimescaleDB dashboards",
        href: "custom-timescaledb-dashboards",
        tags: ["tableau", "visualize", "create", "timescaledb"],
        excerpt: "Custom TimescaleDB dashboards in Tableau",
      },
      {
        title: "Simulate IoT sensor data",
        href: "simulate-iot-sensor-data",
        tags: ["tableau", "iot", "visualize", "learn", "timescaledb"],
        excerpt: "Simulate IoT Sensor Data with TimescaleDB",
      },
      {
        title: "TimescaleDB with AWS Lambda",
        href: "aws-lambda",
        tags: ["lambda", "learn", "timescaledb"],
        excerpt: "Tutorial for using TimescaleDB with AWS Lambda",
        children: [
          {
            title: "Create a data API for TimescaleDB",
            href: "create-data-api",
            tags: ["lambda", "data", "learn", "timescaledb"],
            excerpt:
              "Create a data API for TimescaleDB with AWS Lambda and API Gateway",
          },
          {
            title: "Pull and ingest data from a third party API",
            href: "3rd-party-api-ingest",
            tags: ["lambda", "data", "ingest", "learn", "timescaledb"],
            excerpt:
              "Pull and ingest data from a third party into TimescaleDB with AWS Lambda",
          },
          {
            title: "Continuous deployment with GitHub actions",
            href: "continuous-deployment",
            tags: ["lambda", "cd", "github", "timescaledb"],
            excerpt:
              "Create a continuous deployment between GitHub and AWS Lambda",
          },
        ],
      },
      {
        title: "Sample datasets",
        href: "sample-datasets",
        tags: ["data", "learn", "timescaledb"],
        excerpt: "Sample datasets for Tableau and TimescaleDB",
      },
    ],
  },
];
