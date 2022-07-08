# Tutorials
We've created a host of code-focused tutorials that help you get
started with *TimescaleDB*.

Most of these tutorials require a working [installation of TimescaleDB][install-timescale].

### Common scenarios for using TimescaleDB

- **[Introduction to TimescaleDB][nyc-taxi]**: The tried and true tutorial for learning TimescaleDB.
- **[Time-series forecasting][Forecasting]**: Use R, Apache MADlib and Python to perform
data analysis and make forecasts on your data.
- **[Analyze cryptocurrency data][Crypto]**: Use TimescaleDB to analyze historic cryptocurrency data. Learn how to build your own schema, ingest data, and analyze information in TimescaleDB.
- **[Analyze intraday stock data][Stocks]**: One of the most common uses for time-series data is to collect intraday securities information. Learn how to collect stock data, store it in TimescaleDB, and perform the most common queries.
- **[Build custom TimescaleDB dashboards][custom-dashboards]**: Learn how to obtain metrics data from TimescaleDB and visualize it using a basic React app.
- **[Analyze NFL play-by-play data][nfl]**: Investigate more than 20 million rows of data from the 2018 NFL season that tracks the movement of all players on the field. For each play, gain insights into player performance and potential strategies to find better fantasy football draft picks.

### Observability scenarios

- **[Getting started with Promscale][promscale]**: Promscale is the long‑term store for Prometheus data, designed for analytics
- **[Setup a Prometheus endpoint for managed TimescaleDB][prometheus-mst-endpoint]**: Learn how to create a monitoring system to ingest and analyze Prometheus metrics from your Timescale Cloud instance.
- **[Monitor a Django application with Prometheus][monitor-django-prometheus]**: Use how to use Prometheus to monitor your Django application.

### Integrating with Grafana

- **[Creating a Grafana dashboard and panel][tutorial-grafana-dashboards]**: Basic tutorial on using Grafana to visualize data in TimescaleDB.
- **[Visualize Geospatial data in Grafana][tutorial-grafana-geospatial]**: Use the Grafana WorldMap visualization to view your TimescaleDB data.
- **[Use Grafana variables][tutorial-grafana-variables]**: Filter and customize your Grafana visualizations.
- **[Visualizing missing data with Grafana][tutorial-grafana-missing-data]**: Learn how to visualize and aggregate missing time-series data in Grafana.
- **[Setting up Grafana alerts][tutorial-grafana-alerts]**: Configure Grafana to alert you in Slack, PagerDuty, and more.

### Other integrations

- **[Collect metrics with Telegraf][telegraf]**: Telegraf is an extensible plug-in for collecting and outputting data.
- **[Visualize data in Tableau][tableau]**: Tableau is a widely used business intelligence tool used to visualize data.

### Additional resources

- **[Sample datasets][sample-data-sets]**: And if you want to explore on your own
with some sample data, we have some ready-made datasets for you to explore.
- **[Simulate IoT sensor data][simul-iot-data]**: Simulate a basic IoT sensor dataset
on PostgreSQL or TimescaleDB.
- **[psql installation][psql]**: `psql` is a terminal-based front-end for PostgreSQL.
Learn how to install `psql` on Mac, Ubuntu, Debian, Windows,
and pick up some valuable `psql` tips and tricks along the way.

[Forecasting]: /timescaledb/:currentVersion:/tutorials/time-series-forecast
[telegraf]: /timescaledb/:currentVersion:/tutorials/telegraf-output-plugin
[sample-data-sets]: /timescaledb/:currentVersion:/tutorials/sample-datasets
[install-timescale]: /install/latest/
[promscale]: /promscale/latest/
[psql]: /timescaledb/:currentVersion:/how-to-guides/connecting/psql/
[Crypto]: /timescaledb/:currentVersion:/tutorials/analyze-cryptocurrency-data
[Stocks]: /timescaledb/:currentVersion:/tutorials/analyze-intraday-stocks/
[custom-dashboards]: /timescaledb/:currentVersion:/tutorials/custom-timescaledb-dashboards/
[tableau]: /timescaledb/:currentVersion:/tutorials/visualize-with-tableau
[prometheus-mst-endpoint]: /timescaledb/:currentVersion:/tutorials/setting-up-mst-endpoint-for-prometheus
[monitor-django-prometheus]: /timescaledb/:currentVersion:/tutorials/monitor-django-with-prometheus
[tutorial-grafana-dashboards]: /timescaledb/:currentVersion:/tutorials/grafana/create-dashboard-and-panel
[tutorial-grafana-geospatial]: /timescaledb/:currentVersion:/tutorials/grafana/geospatial-dashboards
[tutorial-grafana-variables]: /timescaledb/:currentVersion:/tutorials/grafana/grafana-variables
[tutorial-grafana-missing-data]: /timescaledb/:currentVersion:/tutorials/grafana/visualize-missing-data
[tutorial-grafana-alerts]: /timescaledb/:currentVersion:/tutorials/grafana/setup-alerts
[simul-iot-data]: /timescaledb/:currentVersion:/tutorials/simulate-iot-sensor-data
[nyc-taxi]: /timescaledb/:currentVersion:/tutorials/nyc-taxi-cab/
[nfl]: /timescaledb/:currentVersion:/tutorials/nfl-analytics/
