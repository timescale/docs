# Visualizing data

The time-series data stored in TimescaleDB can be easily displayed on graphs.
TimescaleDB is compatible with visualization tools that work with PostgreSQL. This means that
regardless of whether you are creating custom visualizations embedded in your applications or
using off-the-shelf visualization tools to expose data across your business organization, you
can choose from a wide selection of tools.

## Grafana [](grafana)

Grafana is an open-source visualization tool popular in the DevOps monitoring space,
although it can also be used across the organization to visualize time-series metrics.
Getting started with Grafana is simple. Download and install [Grafana][grafana-install].
Then, add a new PostgreSQL data source that points to your TimescaleDB instance.
Queries run through Grafana will continue to benefit from the performance improvements
built into TimescaleDB. In fact, this data source was built by TimescaleDB engineers,
and it is designed to take advantage of the databases' time-series capabilities.

>:WARNING: Grafana expects data received to be ordered by time. When querying
Grafana using SQL, you must include the `ORDER BY time` statement so that
results are guaranteed to be ordered. Grafana draws the points as they appear
in the returned query. If data comes in unordered, you may observe
inconsistencies in both graphs and Grafana functions.

## Other Visualization Tools [](other-viz-tools)

TimescaleDB also works with popular visualization software solutions that allow
users across your organization to analyze and visualize data. Users can use these
platforms to run business intelligence reports, power machine learning models, and
build custom dashboards. Many of these tools also allow you to embed dashboards
into applications, making it quick and easy to offer analytical features to your users.

Some popular visualization tools that work with TimescaleDB include:
- Tableau: get started [here][tableau-install]
- PowerBI: get started [here][powerbi-install]
- Looker: get started [here][looker-install]
- Periscope: get started [here][periscope-install]
- Mode: read more [here][mode-install]
- Chartio: read more [here][chartio-install]

>:TIP: If it works with PostgreSQL, it works with TimescaleDB. TimescaleDB looks
just like PostgreSQL on the outside, but offers optimizations built deep into the
system that speed up time-series queries.

[grafana-install]: https://grafana.com/get
[tableau-install]: https://onlinehelp.tableau.com/current/pro/desktop/en-us/examples_postgresql.html
[powerbi-install]: https://powerbi.microsoft.com/en-us/integrations/postgresql/
[looker-install]: https://docs.looker.com/setup-and-management/database-config/postgresql
[periscope-install]: https://doc.periscopedata.com/article/connecting-to-periscope-menu#whitelisting
[mode-install]: https://about.modeanalytics.com/postgres/
[chartio-install]: https://chartio.com/product/data-sources/postgresql/
