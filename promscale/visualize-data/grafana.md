# Connect Promscale and Grafana

Grafana ships with a built-in Prometheus, PostgreSQL, and other data source plugins that allows you to query and visualize data from a compatible database. To Add a data source in Grafana you need to be a user with oraganization admin role previleges.

To connect Grafana with Promscale, install and run Grafana version 5.3 or later. For information about installing Grafana, see [Grafana installation docs][grafana-install].

This section shows you how to connect Promscale to Prometheus, Jaeger, and PostgreSQL data sources in [Grafana][grafana-homepage].

<procedure>

## Configuring Promscale as Prometheus data source

1.  Navigate to **Configuration** > **Data sources**.
    The data sources page opens showing a list of previously configured data sources for the Grafana instance.
1.  Click **Add data source** to see a list of all supported data sources.
1.  Type *Prometheus* in the search field and click **Select**.
1.  Configure the data source:
    *   In the **Name** field, type *Promscale-metrics*.
    *   In the **URL** field, type *http://<PROMSCALE-IP-ADDR>:9201*, where *<PROMSCALE-IP-ADDR>* is the IP address of the Promscale instance.
    *   Use the default values for all other settings.

</procedure>

When you have configured Promscale as a Prometheus data source in Grafana, you can create panels that are populated with data using PromQL.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/images/misc/getting-started-with-promscale-grafana-dashboard.png" alt="Sample output for PromQl query"/>

<procedure>

## Configuring Promscale as Jaeger data source

Grafana ships with built-in support for Jaeger, which provides open source, end-to-end distributed tracing.

1.  Navigate to **Configuration** > **Data sources**.
    The data sources page opens showing a list of previously configured data sources for the Grafana instance.
1.  Click **Add data source** to see a list of all supported data sources.
1.  Type *Jaeger* in the search field and click **Select**.
1.  Configure the data source settings:
    *   In the **Name** field, type *Promscale-traces*.
    *   In the **URL** field, type *http://<PROMSCALE-IP-ADDR>:9201*, where *<PROMSCALE-IP-ADDR>* is the IP address of the Promscale instance.
    *   Use the default values for all other settings.

</procedure>

You can now filter and view traces stored in Promscale using Grafana. To visualize your traces, click the **Explore** button to see the traces filtering panel.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/images/misc/grafana-jaeger-query-results.png" alt="Sample output for Jaeger query filter in Grafana"/>

<procedure>

## Configuring Promscale as PostgreSQL data source

To configure Promscale as PostgreSQL data source you need details such as host, port, database, user, and password. These are available in the service URL that you copied when you created the Timescale cloud service. The format of that URL is `postgresql://[user[:password]@][host][:port][/dbname][?param1=value1&...]`

1.  Navigate to **Configuration** > **Data sources**.
    The data sources page opens showing a list of previously configured data sources for the Grafana instance.
1.  Click **Add data source** to see a list of all supported data sources.
1.  Type *PostgreSQL* in the search field and click **Select**. 
1.  Configure the data source settings:
    *   In the **Name** field, type *Promscale-SQL*.
    *   In the **Host** field, type the IP address or hostname and optional port of your PostgreSQL instance. 
    *   In the **Database** field, type the name of the PostgreSQL database.
    *   In the **User** and **Password** fields, type the *user name* and the *password for the database*.
    *   In the **TLS/SSL Mode** select *require*. 
        This determines whether or with what priority a secure SSL TCP/IP connection is negotiated with the server.
    *   In the **TLS/SSL Method** select *file system path*.
        This determines whether the SSL Auth details is configured as a file path or file content.
    *   Use the default values for all other settings.
    *   In the **PostgreSQL details** section, enable **TimescaleDB**.
        Grafana uses `time_bucket` in the `$__timeGroup` macro to display TimescaleDB specific aggregate functions in the query builder.

</procedure>

You can now create panels that use Promscale as a PostgreSQL data source, using SQL queries to feed the chart.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/images/misc/grafana-sql-query-results.png" alt="Sample output for SQL query in Grafana"/>

[grafana-homepage]: https://grafana.com/
[grafana-docker]: https://grafana.com/docs/grafana/latest/installation/docker/#install-official-and-community-grafana-plugins
[grafana-install]: https://grafana.com/docs/grafana/latest/installation/