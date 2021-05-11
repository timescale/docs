# Getting Started with Grafana and TimescaleDB

[Grafana][grafana-website] is an open source analytics and monitoring solution
often used to visualize time-series data. In these tutorials, you’ll learn how to:

- Setup Grafana and [TimescaleDB][install-timescale]
- Use Grafana to visualize metrics stored in TimescaleDB
- Visualize geospatial data using Grafana

Follow these tutorials:

- [Creating a Grafana dashboard and panel][tutorial-grafana-dashboards] to visualize data in TimescaleDB.
- [Visualize Geospatial data in Grafana][tutorial-grafana-geospatial].
- [Use Grafana variables][tutorial-grafana-variables] to filter and customize your visualizations.
- [Visualize missing data in Grafana][tutorial-grafana-missing-data] using TimescaleDB features.
- [Setup Grafana alerts][tutorial-grafana-alerts] on time-series data using Slack, PagerDuty, and more.

### Prerequisites for Grafana tutorials

To complete these tutorials, you will need a cursory knowledge of the Structured Query
Language (SQL). Each tutorial will walk you through each SQL command, but it will be
helpful if you've seen SQL before.

* To start, [install TimescaleDB][install-timescale].
* Next [setup Grafana][install-grafana].

[install-timescale]: /how-to-guides/install-timescaledb/
[install-grafana]: /tutorials/grafana/installation
[tutorial-grafana-dashboards]: /tutorials/grafana/create-dashboard-and-panel/
[tutorial-grafana-geospatial]: /tutorials/grafana/geospatial-dashboards/
[tutorial-grafana-variables]: /tutorials/grafana/grafana-variables/
[tutorial-grafana-missing-data]: /tutorials/grafana/visualize-missing-data/
[tutorial-grafana-alerts]: /tutorials/grafana/setup-alerts/
[grafana-website]: https://www.grafana.com
