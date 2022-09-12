module.exports = [
  {
    title: 'Tutorials',
    href: 'tutorials',
    tags: ["timescaledb", "overview", "get started", "learn"],
    keywords: ["IoT", "analyze data", "monitor", "visualize"],
    excerpt: "Learn about common scenarios and use cases for TimescaleDB",
    children: [
      {
        title: 'Introduction to IoT',
        href: 'nyc-taxi-cab',
        tags: ['iot', 'query', 'learn', 'tsc'],
        keywords: ['IoT', 'tutorial', 'Timescale Cloud'],
        excerpt: 'An introduction to IoT using NYC taxi data',
      },
      {
        title: 'Introduction to time-series forecasting',
        href: 'time-series-forecast',
        tags: ['r', 'analyze', 'learn', 'timescaledb'],
        keywords: ['r', 'tutorial', 'TimescaleDB'],
        excerpt:
          'An introduction to time-series forecasting using NYC taxi data',
      },
      {
        title: 'Analyze cryptocurrency data',
        href: 'analyze-cryptocurrency-data',
        tags: ['cryptocurrency', 'finance', 'analyze', 'learn', 'timescaledb'],
        keywords: ['cryptocurrency', 'finance', 'tutorial', 'TimescaleDB'],
        excerpt: 'Use TimescaleDB to analyze cryptocurrency data',
      },
      {
        title: 'Analyze the Bitcoin blockchain',
        href: 'analyze-bitcoin-blockchain',
        tags: ['blockchain', 'bitcoin', 'analyze', 'learn', 'timescaledb'],
        keywords: ['blockchain', 'bitcoin', 'tutorial', 'TimescaleDB'],
        excerpt: 'Store and query blockchain transactions',
        children: [
          {
            title: 'Ingest and query Bitcoin transactions',
            href: 'ingest-query-btc-transactions',
            tags: ['bitcoin', 'blockchain', 'analyze', 'learn', 'timescaledb'],
            keywords: ['bitcoin', 'blockchain', 'tutorial', 'TimescaleDB'],
            excerpt: 'Design schema and ingest Bitcoin blockchain data with TimescaleDB',
          },
          {
            title: 'Analyze the blockchain with hyperfunctions',
            href: 'analyze-blockchain',
            tags: ['bitcoin', 'blockchain', 'hyperfunctions', 'learn', 'timescaledb'],
            keywords: ['bitcoin', 'blockchain', 'tutorial', 'TimescaleDB'],
            excerpt:
              'Use TimescaleDB hyperfunctions for blockchain insights',
          }
        ],
      },
      {
        title: 'Store financial tick data in TimescaleDB',
        href: 'financial-candlestick-tick-data',
        tags: ['candlestick', 'finance', 'analyze', 'ohlcv', 'timescaledb'],
        keywords: ['candlestick', 'finance', 'tick', 'tutorial', 'TimescaleDB'],
        excerpt: 'Use TimescaleDB to store financial tick data',
        children: [
          {
            title: 'Design schema and ingest tick data',
            href: 'design-tick-schema',
        tags: ['tick', 'schema', 'candlestick', 'timescaledb'],
        keywords: ['candlestick', 'finance', 'tutorial', 'TimescaleDB'],
            excerpt: 'Design a relational schema for real-time tick data',
          },
          {
            title: 'Create candlestick aggregates',
            href: 'create-candlestick-aggregates',
        tags: ['candlestick', 'finance', 'analyze', 'ohlcv', 'timescaledb'],
        keywords: ['candlestick', 'finance', 'tick', 'tutorial', 'TimescaleDB'],
            excerpt: 'Use continuous aggregates to create candlestick views',
          },
          {
            title: 'Query the candlestick views',
            href: 'query-candlestick-views',
        tags: ['candlestick', 'finance', 'analyze', 'ohlcv', 'timescaledb'],
        keywords: ['candlestick', 'finance', 'tick', 'tutorial', 'TimescaleDB'],
            excerpt: 'Query the continuous aggregates for candlestick data',
          },
          {
            title: 'Advanced data management',
            href: 'advanced-data-management',
        tags: ['candlestick', 'finance', 'analyze', 'ohlcv', 'timescaledb'],
        keywords: ['candlestick', 'finance', 'tick', 'tutorial', 'TimescaleDB'],
            excerpt: 'Advanced data management techniques',
          }
        ],
      },
      {
        title: 'Ingest real-time financial websocket data',
        href: 'ingest-real-time-websocket-data',
        tags: ['websocket', 'finance', 'real-time', 'ingest', 'timescaledb'],
        keywords: ['real-time', 'finance', 'websocket', 'tutorial', 'TimescaleDB'],
        excerpt: 'Ingest real-time financial data with websocket',
      },
      {
        title: 'Analyze NFT sales data',
        href: 'analyze-nft-data',
        tags: ['nft', 'finance', 'analyze', 'learn', 'timescaledb'],
        keywords: ['NFT', 'finance', 'tutorial', 'TimescaleDB'],
        excerpt: 'Analyze NFT sales data with TimescaleDB',
        children: [
          {
            title: 'NFT schema design and ingestion',
            href: 'nft-schema-ingestion',
        tags: ['nft', 'finance', 'analyze', 'learn', 'timescaledb'],
        keywords: ['NFT', 'finance', 'tutorial', 'TimescaleDB'],
            excerpt: 'Design schema and ingest NFT data with TimescaleDB',
          },
          {
            title: 'Analyzing NFT transactions',
            href: 'analyzing-nft-transactions',
        tags: ['nft', 'finance', 'analyze', 'learn', 'timescaledb'],
        keywords: ['NFT', 'finance', 'tutorial', 'TimescaleDB'],
            excerpt:
              'Analyze NFT data transactions with PostgreSQL and hyperfunctions in TimescaleDB',
          }
        ],
      },
      {
        title: 'Analyze intraday stock data',
        href: 'analyze-intraday-stocks',
        tags: ['finance', 'analyze', 'learn', 'timescaledb'],
        keywords: ['finance', 'tutorial', 'TimescaleDB'],
        excerpt: 'Analyze intraday stock data with TimescaleDB',
        children: [
          {
            title: 'Design database schema',
            href: 'design-schema',
            tags: ['finance', 'create', 'learn', 'timescaledb'],
            keywords: ['finance', 'tutorial', 'TimescaleDB'],
            excerpt:
              'Design a database schema for intraday stock data analysis',
          },
          {
            title: 'Fetch and ingest stock data',
            href: 'fetch-and-ingest',
            tags: ['finance', 'ingest', 'learn', 'timescaledb'],
            keywords: ['finance', 'tutorial', 'TimescaleDB'],
            excerpt: 'Fetch and ingest stock data using TimescaleDB',
          },
          {
            title: 'Explore stock market data',
            href: 'explore-stocks-data',
            tags: ['finance', 'analyze', 'learn', 'timescaledb'],
            keywords: ['finance', 'tutorial', 'TimescaleDB'],
            excerpt: 'Explore stock market data with TimescaleDB',
          },
        ],
      },
      {
        title: 'Analyze data using hyperfunctions',
        href: 'nfl-analytics',
        tags: ['hyperfunctions', 'analyze', 'learn', 'timescaledb'],
        keywords: ['hyperfunctions', 'tutorial', 'TimescaleDB'],
        excerpt: 'Analyze NFL data using TimescaleDB',
        children: [
          {
            title: 'Ingest and query data',
            href: 'ingest-and-query',
            tags: ['hyperfunctions', 'ingest', 'query', 'learn', 'timescaledb'],
            keywords: ['hyperfunctions', 'tutorial', 'TimescaleDB'],
            excerpt: 'Ingest and query NFL data with TimescaleDB',
          },
          {
            title: 'Analyze data using SQL and hyperfunctions',
            href: 'advanced-analysis',
            tags: ['hyperfunctions', 'analyze', 'learn', 'timescaledb'],
            keywords: ['hyperfunctions', 'tutorial', 'TimescaleDB'],
            excerpt:
              'Analyze NFL data using SQL and hyperfunctions in TimescaleDB',
          },
          {
            title: 'Join time-series and relational data',
            href: 'join-with-relational',
            tags: ['hyperfunctions', 'analyze', 'learn', 'timescaledb'],
            keywords: ['hyperfunctions', 'tutorial', 'TimescaleDB'],
            excerpt: 'Join time-series and relational NFL data in TimescaleDB',
          },
          {
            title: 'Visualize time-series data',
            href: 'play-visualization',
            tags: ['hyperfunctions', 'visualize', 'learn', 'timescaledb'],
            keywords: ['hyperfunctions', 'visualize', 'tutorial', 'TimescaleDB'],
            excerpt: 'Visualize NFL data with TimescaleDB',
          },
        ],
      },
      {
        title: 'Monitor MST with Prometheus',
        href: 'monitor-mst-with-prometheus',
        tags: ['prometheus', 'monitor', 'learn', 'timescaledb'],
        keywords: ['Promscale', 'Prometheus', 'tutorial', 'TimescaleDB'],
        excerpt: 'Monitor MST with Prometheus',
      },
      {
        title: 'Monitor a Django application with Prometheus',
        href: 'monitor-django-with-prometheus',
        tags: ['prometheus', 'django', 'monitor', 'learn', 'timescaledb'],
        keywords: ['Prometheus', 'Django', 'tutorial', 'TimescaleDB'],
        excerpt: 'Monitor a Django application with Prometheus',
      },
      {
        title: 'Collect metrics with Telegraf',
        href: 'telegraf-output-plugin',
        tags: ['telegraf', 'monitor', 'learn', 'timescaledb'],
        keywords: ['Telegraf', 'tutorial', 'TimescaleDB'],
        excerpt: 'Collect metrics with Telegraf',
      },
      {
        title: 'Grafana',
        href: 'grafana',
        tags: ['grafana', 'visualize', 'learn', 'timescaledb'],
        keywords: ['Grafana', 'tutorial', 'TimescaleDB'],
        excerpt: 'Getting Started with Grafana and TimescaleDB',
        children: [
          {
            title: 'Connect TimescaleDB and Grafana',
            href: 'grafana-timescalecloud',
            tags: ['grafana', 'visualize', 'install', 'learn', 'timescaledb'],
            keywords: ['Grafana', 'tutorial', 'TimescaleDB'],
            excerpt: 'Learn how to connect TimescaleDB and Grafana',
          },
          {
            title: 'Setup Grafana on Managed Service for TimescaleDB',
            href: 'installation',
            tags: ['grafana', 'visualize', 'install', 'learn', 'timescaledb'],
            keywords: ['Grafana', 'tutorial', 'TimescaleDB'],
            excerpt: 'Learn how to setup Grafana and TimescaleDB on Managed Service for TimescaleDB',
          },
          {
            title: 'Create a dashboard and panel',
            href: 'create-dashboard-and-panel',
            tags: ['grafana', 'visualize', 'create', 'learn', 'timescaledb'],
            keywords: ['Grafana', 'tutorial', 'TimescaleDB'],
            excerpt:
              'Create a dashboard and panel with Grafana and TimescaleDB',
          },
          {
            title: 'Build Geospatial dashboards',
            href: 'geospatial-dashboards',
            tags: ['grafana', 'visualize', 'create', 'learn', 'timescaledb'],
            keywords: ['Grafana', 'tutorial', 'TimescaleDB'],
            excerpt: 'Build Geospatial dashboards with Grafana and TimescaleDB',
          },
          {
            title: 'Use Grafana variables',
            href: 'grafana-variables',
            tags: ['grafana', 'visualize', 'manage', 'learn', 'timescaledb'],
            keywords: ['Grafana', 'tutorial', 'TimescaleDB'],
            excerpt: 'Use Grafana variables with TimescaleDB',
          },
          {
            title: 'Visualize missing data',
            href: 'visualize-missing-data',
            tags: ['grafana', 'visualize', 'manage', 'learn', 'timescaledb'],
            keywords: ['Grafana', 'tutorial', 'TimescaleDB'],
            excerpt: 'Visualize missing data in Grafana with TimescaleDB',
          },
          {
            title: 'Setup alerts',
            href: 'setup-alerts',
            tags: ['grafana', 'visualize', 'alert', 'learn', 'timescaledb'],
            keywords: ['Grafana', 'tutorial', 'TimescaleDB'],
            excerpt: 'Setup alerts in Grafana with TimescaleDB',
          },
          {
            title: 'Visualizations',
            href: 'visualizations',
            tags: ['grafana', 'visualize', 'learn', 'timescaledb'],
            keywords: ['Grafana', 'tutorial', 'visualization', 'TimescaleDB'],
            excerpt: 'Grafana visualizations',
            children: [
              {
                title: 'Time-series',
                href: 'time-series',
                tags: ['grafana', 'visualize', 'time-series', 'learn', 'timescaledb'],
                keywords: ['Grafana', 'tutorial', 'TimescaleDB', 'time-series'],
                excerpt: 'Graph time-series data in Grafana',
              },
              {
                title: 'Histograms',
                href: 'histograms',
                tags: ['grafana', 'visualize', 'histograms', 'learn', 'timescaledb'],
                keywords: ['Grafana', 'tutorial', 'TimescaleDB', 'histogram'],
                excerpt: 'How to build a histogram in Grafana',
              },
              {
                title: 'Candlestick',
                href: 'candlestick',
                tags: ['grafana', 'visualize', 'candlestick', 'learn', 'timescaledb'],
                keywords: ['Grafana', 'tutorial', 'TimescaleDB', 'candlestick'],
                excerpt: 'How to build a candlestick chart in Grafana',
              },
              {
                title: 'Bar chart',
                href: 'bar-chart',
                tags: ['grafana', 'visualize', 'bar chart', 'learn', 'timescaledb'],
                keywords: ['Grafana', 'tutorial', 'TimescaleDB', 'bar chart'],
                excerpt: 'How to build a bar chart in Grafana',
              },
              {
                title: 'Pie chart',
                href: 'pie-chart',
                tags: ['grafana', 'visualize', 'pie chart', 'learn', 'timescaledb'],
                keywords: ['Grafana', 'tutorial', 'TimescaleDB', 'pie chart'],
                excerpt: 'How to build a pie chart in Grafana',
              }
            ]
          }
        ],
      },
      {
        title: 'Visualize data in Tableau',
        href: 'visualize-with-tableau',
        tags: ['tableau', 'visualize', 'learn', 'timescaledb'],
        keywords: ['Tableau', 'tutorial', 'TimescaleDB'],
        excerpt: 'Visualize data in Tableau with TimescaleDB',
      },
      {
        title: 'Custom TimescaleDB dashboards',
        href: 'custom-timescaledb-dashboards',
        tags: ['tableau', 'visualize', 'create', 'timescaledb'],
        keywords: ['Tableau', 'tutorial', 'TimescaleDB'],
        excerpt: 'Custom TimescaleDB dashboards in Tableau',
      },
      {
        title: 'Simulate IoT sensor data',
        href: 'simulate-iot-sensor-data',
        tags: ['tableau', 'iot', 'visualize', 'learn', 'timescaledb'],
        keywords: ['Tableau', 'tutorial', 'IoT', 'TimescaleDB'],
        excerpt: 'Simulate IoT Sensor Data with TimescaleDB',
      },
      {
        title: 'TimescaleDB with AWS Lambda',
        href: 'aws-lambda',
        tags: ['lambda', 'learn', 'timescaledb'],
        keywords: ['AWS Lambda', 'tutorial', 'TimescaleDB'],
        excerpt: 'Tutorial for using TimescaleDB with AWS Lambda',
        children: [
          {
            title: 'Create a data API for TimescaleDB',
            href: 'create-data-api',
            tags: ['lambda', 'data', 'learn', 'timescaledb'],
            keywords: ['AWS Lambda', 'tutorial', 'TimescaleDB'],
            excerpt: 'Create a data API for TimescaleDB with AWS Lambda and API Gateway',
          },
          {
            title: 'Pull and ingest data from a third party API',
            href: '3rd-party-api-ingest',
            tags: ['lambda', 'data', 'ingest', 'learn', 'timescaledb'],
            keywords: ['AWS Lambda', 'tutorial', 'TimescaleDB'],
            excerpt: 'Pull and ingest data from a third party into TimescaleDB with AWS Lambda',
          },
          {
            title: 'Continuous deployment with GitHub actions',
            href: 'continuous-deployment',
            tags: ['lambda', 'cd', 'github', 'timescaledb'],
            keywords: ['AWS Lambda', 'GitHub', 'tutorial', 'TimescaleDB'],
            excerpt: 'Create a continuous deployment between GitHub and AWS Lambda',
          }
        ],
      },
      {
        title: 'Sample datasets',
        href: 'sample-datasets',
        tags: ['data', 'learn', 'timescaledb'],
        keywords: ['tutorial', 'Tableau', 'TimescaleDB'],
        excerpt: "Sample datasets for Tableau and TimescaleDB"
      },
    ],
  },
];
