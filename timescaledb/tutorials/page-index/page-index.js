module.exports = [
  {
    title: 'Tutorials',
    href: 'tutorials',
    children: [
      {
        title: 'Introduction to IoT',
        href: 'nyc-taxi-cab',
        excerpt: 'An introduction to IoT using NYC taxi data',
      },
      {
        title: 'Introduction to time-series forecasting',
        href: 'time-series-forecast',
        excerpt:
          'An introduction to time-series forecasting using NYC taxi data',
      },
      {
        title: 'Analyze cryptocurrency data',
        href: 'analyze-cryptocurrency-data',
        excerpt: 'Use TimescaleDB to analyze cryptocurrency data',
      },
      {
        title: 'Analyze intraday stock data',
        href: 'analyze-intraday-stocks',
        children: [
          {
            title: 'Design database schema',
            href: 'design-schema',
            excerpt:
              'Design a database schema for intraday stock data analysis',
          },
          {
            title: 'Fetch and ingest stock data',
            href: 'fetch-and-ingest',
            excerpt: 'Fetch and ingest stock data using TimescaleDB',
          },
          {
            title: 'Explore stock market data',
            href: 'explore-stocks-data',
            excerpt: 'Explore stock market data with TimescaleDB',
          },
        ],
      },
      {
        title: 'Analyze data using hyperfunctions',
        href: 'nfl-analytics',
        excerpt: 'Analyze NFL data using TimescaleDB',
        children: [
          {
            title: 'Ingest and query data',
            href: 'ingest-and-query',
            excerpt: 'Ingest and query NFL data with TimescaleDB',
          },
          {
            title: 'Analyze data using SQL and hyperfunctions',
            href: 'advanced-analysis',
            excerpt:
              'Analyze NFL data using SQL and hyperfunctions in TimescaleDB',
          },
          {
            title: 'Join time-series and relational data',
            href: 'join-with-relational',
            excerpt: 'Join time-series and relational NFL data in TimescaleDB',
          },
          {
            title: 'Visualize time-series data',
            href: 'play-visualization',
            excerpt: 'Visualize NFL data with TimescaleDB',
          },
        ],
      },
      {
        title: 'Getting started with Promscale',
        href: 'promscale',
        children: [
          {
            title: 'The Benefits of using Promscale',
            href: 'promscale-benefits',
            excerpt: 'Explore the benefits of using Promscale',
          },
          {
            title: 'How Promscale works',
            href: 'promscale-how-it-works',
            excerpt: 'Learn how Promscale works',
          },
          {
            title: 'Installing Promscale',
            href: 'promscale-install',
            excerpt: 'Install Promscale',
          },
          {
            title: 'Run queries with PromQL and SQL',
            href: 'promscale-run-queries',
            excerpt: 'Query your data using PromQL and SQL in Promscale',
          },
        ],
      },
      {
        title: 'Monitor Timescale Cloud with Prometheus',
        href: 'setting-up-timescale-cloud-endpoint-for-prometheus',
        excerpt: 'Monitor Timescale Cloud with Prometheus',
      },
      {
        title: 'Monitor a Django application with Prometheus',
        href: 'monitor-django-with-prometheus',
        excerpt: 'Monitor a Django application with Prometheus',
      },
      {
        title: 'Collect metrics with Telegraf',
        href: 'telegraf-output-plugin',
        excerpt: 'Collect metrics with Telegraf',
      },
      {
        title: 'Grafana',
        href: 'grafana',
        exceprt: 'Getting Started with Grafana and TimescaleDB',
        children: [
          {
            href: 'installation',
            excerpt: 'Learn how to install Grafana',
          },
          {
            title: 'Create a dashboard and panel',
            href: 'create-dashboard-and-panel',
            excerpt:
              'Create a dashboard and panel with Grafana and TimescaleDB',
          },
          {
            title: 'Build Geospatial dashboards',
            href: 'geospatial-dashboards',
            excerpt: 'Build Geospatial dashboards with Grafana and TimescaleDB',
          },
          {
            title: 'Use Grafana variables',
            href: 'grafana-variables',
            excerpt: 'Use Grafana variables with TimescaleDB',
          },
          {
            title: 'Visualize missing data',
            href: 'visualize-missing-data',
            excerpt: 'Visualize missing data in Grafana with TimescaleDB',
          },
          {
            title: 'Setup alerts',
            href: 'setup-alerts',
            excerpt: 'Setup alerts in Grafana with TimescaleDB',
          },
        ],
      },
      {
        title: 'Visualize data in Tableau',
        href: 'visualize-with-tableau',
        excerpt: 'Visualize data in Tableau with TimescaleDB',
      },
      {
        title: 'Custom TimescaleDB dashboards',
        href: 'custom-timescaledb-dashboards',
        excerpt: 'Custom TimescaleDB dashboards in Tableau',
      },
      {
        title: 'Simulate IoT Sensor Data',
        href: 'simulate-iot-sensor-data',
        excerpt: 'Simulate IoT Sensor Data with TimescaleDB',
      },
      { title: 'TimescaleDB with AWS Lambda',
        href: 'aws-lambda',
        children: [
          {
            title: 'Create a data API for TimescaleDB',
            href: 'create-data-api',
            excerpt: 'Create a data API for TimescaleDB with AWS Lambda and API Gateway',
          },
          {
            title: 'Pull data from 3rd party API and ingest',
            href: '3rd-party-api-ingest',
            excerpt: 'Pull and ingest 3rd party data into TimescaleDB with AWS Lambda',
          }
        ],
      },
      {
        href: 'sample-datasets',
        excerpt: "Sample datasets for Tableau and TimescaleDB"
      },
    ],
  },
];
