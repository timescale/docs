# Tutorials
We've created a host of code-focused tutorials that will help you get
started with *TimescaleDB*.

Most of these tutorials require a working [installation of TimescaleDB][install-timescale].

### Common scenarios for using TimescaleDB

- **[Introduction to TimescaleDB][nyc-taxi]**: The tried and true tutorial for learning TimescaleDB.
- **[Time-series forecasting][Forecasting]**: Use R, Apache MADlib and Python to perform
data analysis and make forecasts on your data.
- **[Analyze cryptocurrency data][Crypto]**: Use TimescaleDB to analyze historic cryptocurrency data. Learn how to build your own schema, ingest data, and analyze information in TimescaleDB.
- **[Analyze intraday stock data][Stocks]**: One of the most common uses for time-series data is to collect intraday securities information. Learn how to collect stock data, store it in TimescaleDB, and perform the most common queries.
- **[Build custom TimescaleDB dashboards][custom-dashboards]**: Learn how to obtain metrics data from TimescaleDB and visualize it using a basic React app.

### Observability scenarios

- **[Getting started with Promscale][promscale]**: Promscale is the long‑term store for Prometheus data, designed for analytics
- **[Setup a Prometheus endpoint for Timescale Cloud][prometheus-tsc-endpoint]**: Learn how to create a monitoring system to ingest and analyze Prometheus metrics from your Timescale Cloud instance.
- **[Monitor a Django application with Prometheus][monitor-django-prometheus]**: Use how to use Prometheus to monitor your Django application.

### Integrating with Grafana

- **[Creating a Grafana dashboard and panel][tutorial-grafana-dashboards]**: Basic tutorial on using Grafana to visualize data in TimescaleDB.
- **[Visualize Geospatial data in Grafana][tutorial-grafana-geospatial]**: Use the Grafana WorldMap visualization to view your TimescaleDB data.
- **[Use Grafana variables][tutorial-grafana-variables]**: Filter and customize your Grafana visualizations.
- **[Visualizing Missing Data with Grafana][tutorial-grafana-missing-data]**: Learn how to visualize and aggregate missing time-series data in Grafana.
- **[Setting up Grafana alerts][tutorial-grafana-alerts]**: Configure Grafana to alert you in Slack, PagerDuty, and more.

### Other integrations

- **[Collect metrics with Telegraf][telegraf]**: Telegraf is an extensible plug-in for collecting and outputting data.
- **[Visualize data in Tableau][tableau]**: Tableau is a widely used business intelligence tool used to visualize data.

### Additional resources

- **[Sample data sets][sample-data-sets]**: And if you want to explore on your own
with some sample data, we have some ready-made data sets for you to explore.
- **[Simulate IoT Sensor Data][simul-iot-data]**: Simulate a basic IoT sensor dataset
on PostgreSQL or TimescaleDB.
- **[psql installation][psql]**: `psql` is a terminal-based front-end for PostgreSQL.
Learn how to install `psql` on Mac, Ubuntu, Debian, Windows, 
and pick up some valuable `psql` tips and tricks along the way.

[Forecasting]: /tutorials/time-series-forecast
[Replication]: /tutorials/replication
[Clustering]: /tutorials/clustering
[Continuous Aggregates]: /tutorials/continuous-aggs-tutorial
[Outflux]: /tutorials/outflux
[Grafana]: /tutorials/grafana
[telegraf]: /tutorials/telegraf-output-plugin
[sample-data-sets]: /tutorials/sample-datasets
[install-timescale]: /how-to-guides/install-timescaledb/
[promscale]: /tutorials/promscale/
[psql]: /how-to-guides/connecting/psql/
[Crypto]: /tutorials/analyze-cryptocurrency-data
[Stocks]: /tutorials/analyze-intraday-stocks/
[custom-dashboards]: /tutorials/custom-timescaledb-dashboards/
[tableau]: /tutorials/visualize-with-tableau
[prometheus-tsc-endpoint]: /tutorials/setting-up-timescale-cloud-endpoint-for-prometheus
[monitor-django-prometheus]: /tutorials/monitor-django-prometheus
[tutorial-grafana-dashboards]: /tutorials/grafana/create-dashboard-and-panel
[tutorial-grafana-geospatial]: /tutorials/grafana/geospatial-dashboards
[tutorial-grafana-variables]: /tutorials/grafana/grafana-variables
[tutorial-grafana-missing-data]: /tutorials/grafana/visualize-missing-data
[tutorial-grafana-alerts]: /tutorials/grafana/setup-alerts
[simul-iot-data]: /tutorials/simulate-iot-sensor-data
[nyc-taxi]: /tutorials/nyc-taxi-cab/
