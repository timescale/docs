---
title: Tutorials
excerpt: Learn how to use TimescaleDB in different scenarios with these step-by-step tutorials
products: [cloud, mst, self_hosted]
---

# Tutorials

This section contains a host of tutorials that help you get
started with Timescale.

Most of these tutorials require a working [installation of TimescaleDB][install-timescale].

<!--- Removing these, as they are no longer current, and we'll need to rewrite
this index entirely anyway. LKB 2023-05-10

### Common scenarios for using TimescaleDB

*   **[Introduction to TimescaleDB][nyc-taxi]**: The tried and true tutorial for learning TimescaleDB.
*   **[Time-series forecasting][Forecasting]**: Use R, Apache MADlib and Python to perform
data analysis and make forecasts on your data.
*   **[Analyze cryptocurrency data][Crypto]**: Use TimescaleDB to analyze historic cryptocurrency data. Learn how to build your own schema, ingest data, and analyze information in TimescaleDB.
*   **[Analyze intraday stock data][Stocks]**: One of the most common uses for time-series data is to collect intraday securities information. Learn how to collect stock data, store it in TimescaleDB, and perform the most common queries.
*   **[Build custom TimescaleDB dashboards][custom-dashboards]**: Learn how to obtain metrics data from TimescaleDB and visualize it using a basic React app.
*   **[Analyze NFL play-by-play data][nfl]**: Investigate more than 20 million rows of data from the 2018 NFL season that tracks the movement of all players on the field. For each play, gain insights into player performance and potential strategies to find better fantasy football draft picks.

### Observability scenarios

*   **[Setup a Prometheus endpoint for managed TimescaleDB][prometheus-mst-endpoint]**: Learn how to create a monitoring system to ingest and analyze Prometheus metrics from your Timescale instance.
*   **[Monitor a Django application with Prometheus][monitor-django-prometheus]**: Use how to use Prometheus to monitor your Django application.

### Integrating with Grafana

*   **[Creating a Grafana dashboard and panel][tutorial-grafana-dashboards]**: Basic tutorial on using Grafana to visualize data in TimescaleDB.
*   **[Visualize Geospatial data in Grafana][tutorial-grafana-geospatial]**: Use the Grafana WorldMap visualization to view your TimescaleDB data.
*   **[Use Grafana variables][tutorial-grafana-variables]**: Filter and customize your Grafana visualizations.
*   **[Visualizing missing data with Grafana][tutorial-grafana-missing-data]**: Learn how to visualize and aggregate missing time-series data in Grafana.
*   **[Setting up Grafana alerts][tutorial-grafana-alerts]**: Configure Grafana to alert you in Slack, PagerDuty, and more.

### Other integrations

*   **[Collect metrics with Telegraf][telegraf]**: Telegraf is an extensible plug-in for collecting and outputting data.
*   **[Visualize data in Tableau][tableau]**: Tableau is a widely used business intelligence tool used to visualize data.

### Additional resources

*   **[Sample datasets][sample-data-sets]**: And if you want to explore on your own
with some sample data, we have some ready-made datasets for you to explore.
*   **[Simulate IoT sensor data][simul-iot-data]**: Simulate a basic IoT sensor dataset
on PostgreSQL or TimescaleDB.
*   **[psql installation][psql]**: `psql` is a terminal-based front-end for PostgreSQL.
Learn how to install `psql` on Mac, Ubuntu, Debian, Windows,
and pick up some valuable `psql` tips and tricks along the way.

-->

[Crypto]: /tutorials/:currentVersion:/analyze-cryptocurrency-data
[Forecasting]: /tutorials/:currentVersion:/time-series-forecast
[Stocks]: /tutorials/:currentVersion:/analyze-intraday-stocks/
[custom-dashboards]: /tutorials/:currentVersion:/custom-timescaledb-dashboards/
[install-timescale]: /getting-started/latest/
[monitor-django-prometheus]: /tutorials/:currentVersion:/monitor-django-with-prometheus
[nfl]: /tutorials/:currentVersion:/nfl-analytics/
[nyc-taxi]: /tutorials/:currentVersion:/nyc-taxi-cab/
[prometheus-mst-endpoint]: /tutorials/:currentVersion:/monitor-mst-with-prometheus/
[psql]: /use-timescale/:currentVersion:/connecting/psql/
[sample-data-sets]: /tutorials/:currentVersion:/sample-datasets
[simul-iot-data]: /tutorials/:currentVersion:/simulate-iot-sensor-data
[tableau]: /tutorials/:currentVersion:/visualize-with-tableau
[telegraf]: /tutorials/:currentVersion:/telegraf-output-plugin
[tutorial-grafana-alerts]: /tutorials/:currentVersion:/grafana/setup-alerts
[tutorial-grafana-dashboards]: /tutorials/:currentVersion:/grafana/create-dashboard-and-panel
[tutorial-grafana-geospatial]: /tutorials/:currentVersion:/grafana/geospatial-dashboards
[tutorial-grafana-missing-data]: /tutorials/:currentVersion:/grafana/visualize-missing-data
[tutorial-grafana-variables]: /tutorials/:currentVersion:/grafana/grafana-variables
