module.exports = [
    {
        title: "Tutorials",
        href: "tutorials",
        children: [
          {
            title: "Introduction to IoT",
            href: "nyc-taxi-cab"
          },
          {
            title: "Introduction to time-series forecasting",
            href: "time-series-forecast"
          },
          {
            title: "Analyze cryptocurrency data",
            href: "analyze-cryptocurrency-data"
          },
          {
            title: "Analyze intraday stock data",
            href: "analyze-intraday-stocks",
            children: [
              {
                title: "Design database schema",
                href: "design-schema"
              },
              {
                title: "Fetch and ingest stock data",
                href: "fetch-and-ingest"
              },
              {
                title: "Explore stock market data",
                href: "explore-stocks-data"
              }
            ]
          },
          {
            title: "Getting started with Promscale",
            href: "promscale",
            children: [
              {
                title: "The Benefits of using Promscale",
                href: "promscale-benefits"
              },
              {
                title: "How Promscale works",
                href: "promscale-how-it-works"
              },
              {
                title: "Installing Promscale",
                href: "promscale-install"
              },
              {
                title: "Run queries with PromQL and SQL",
                href: "promscale-run-queries"
              }
            ]
          },
          {
            title: "Monitor Timescale Cloud with Prometheus",
            href: "setting-up-timescale-cloud-endpoint-for-prometheus"
          },
          {
            title: "Monitor a Django application with Prometheus",
            href: "monitor-django-with-prometheus"
          },
          {
            title: "Collect metrics with Telegraf",
            href: "telegraf-output-plugin"
          },
          {
            title: "Grafana",
            href: "grafana",
            children: [
              {
                href: "installation"
              },
              {
                title: "Create a dashboard and panel",
                href: "create-dashboard-and-panel"
              },
              {
                title: "Build Geospatial dashboards",
                href: "geospatial-dashboards"
              },
              {
                title: "Use Grafana variables",
                href: "grafana-variables"
              },
              {
                title: "Visualize missing data",
                href: "visualize-missing-data"
              },
              {
                title: "Setup alerts",
                href: "setup-alerts"
              }
            ]
          },
          {
            title: "Visualize data in Tableau",
            href: "visualize-with-tableau"
          },
          {
            title: "Custom TimescaleDB dashboards",
            href: "custom-timescaledb-dashboards"
          },
          {
            title: "Simulate IoT Sensor Data",
            href: "simulate-iot-sensor-data"
          },
          {
            href: "sample-datasets"
          }
        ]
      }
]
