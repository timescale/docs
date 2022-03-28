# Connect Promscale and Grafana

To connect Grafana with Promscale, you should have Grafana running. If you do not have Grafana installed, follow the [Grafana installation docs][grafana-install].

This section shows you how to connect Promscale to Prometheus, Jaeger, and PostgreSQL data sources in [Grafana][grafana-homepage].

<procedure>

## Configuring Promscale as Prometheus datasource

1.  Navigate to **Configuration** > **Data Sources** > **Add data source** > **Prometheus**.
1.  Configure the data source:
    *   In the **Name** field, type *Promscale-metrics*.
    *   In the **URL** field, type *http://<PROMSCALE-IP-ADDR>:9201*, where *<PROMSCALE-IP-ADDR>* is the IP address of the Promscale instance.
    *   Use the default values for all other settings.

</procedure>

When you have configured Promscale as a Prometheus data source in Grafana, you can create panels that are populated with data using PromQL.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/images/misc/getting-started-with-promscale-grafana-dashboard.png" alt="Sample output for PromQl query"/>

<procedure>

## Configuring Promscale as Jaeger datasource

1.  Navigate to **Configuration** > **Data Sources** > **Add data source** > **Jaeger**.
1.  Configure the data source settings:
    *   In the **Name** field, type *Promscale-traces*.
    *   In the **URL** field, type *http://<PROMSCALE-IP-ADDR>:9201*, where *<PROMSCALE-IP-ADDR>* is the IP address of the Promscale instance.
    *   Use the default values for all other settings.

</procedure>

You can now filter and view traces stored in Promscale using Grafana. To visualize your traces, click the **Explore** button to see the traces filtering panel.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/images/misc/grafana-jaeger-query-results.png" alt="Sample output for Jaeger query filter in Grafana"/>

<procedure>

## Configuring Promscale as PostgreSQL datasource

1.  Navigate to **Configuration** > **Data Sources** > **Add data source** > **PostgreSQL**..
1.  Configure the data source settings:
    *   In the **Name** field, type *Promscale-SQL*.
    *   In the **Host** field, type *<host>:<port>*, where host and port need to be obtained from the service URL that you copied when you created the Timescale cloud service. The format of that URL is `postgresql://[user[:password]@][host][:port][/dbname][?param1=value1&...]`
    *   In the **Database** field, type the name of the database from the service URL.
    *   In the **User** and **Password** fields, type the *user name* and the *password for the database* in the service.
    *   In the **TLS/SSL Mode** select *require*.
    *   In the **TLS/SSL Method** select *file system path*.
    *   Use the default values for all other settings.
    *   In the **PostgreSQL details** section, set **TimescaleDB** to on.

</procedure>

You can now create panels that use Promscale as a PostgreSQL data source, using SQL queries to feed the chart.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/images/misc/grafana-sql-query-results.png" alt="Sample output for SQL query in Grafana"/>

[grafana-homepage]: https://grafana.com/
[grafana-docker]: https://grafana.com/docs/grafana/latest/installation/docker/#install-official-and-community-grafana-plugins
[grafana-install]: https://grafana.com/docs/grafana/latest/installation/