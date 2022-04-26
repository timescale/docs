# Connect Promscale and Grafana
This section shows you how to connect Promscale as a Prometheus, Jaeger, 
or PostgreSQL data source in [Grafana][grafana-homepage].

To connect Grafana with Promscale, you must have Grafana running. If you 
do not have Grafana installed, follow the 
[Grafana installation documentation][grafana-install].



<procedure>

## Promscale as Prometheus datasource

1.  Navigate to `Configuration → Data Sources → Add data source → Prometheus`.
1.  Configure the data source settings:
    *   In the `Name` field, type `Promscale-metrics`.
    *   In the `URL` field, type `http://<PROMSCALE-IP-ADDR>:9201`, using the IP
        address of your Promscale instance.
    *   Use the default values for all other settings.

</procedure>

When you have configured Promscale as a Prometheus data source in 
Grafana, you can create panels that are populated with data using PromQL:

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/images/misc/getting-started-with-promscale-grafana-dashboard.png" alt="Sample output for PromQl query"/>

<procedure>

## Using Promscale as a Jaeger data source

1.  Navigate to `Configuration → Data Sources → Add data source → Jaeger`.
1.  Configure the data source settings:
    *   In the `Name` field, type `Promscale-traces`.
    *   In the `URL` field, type `http://<PROMSCALE-IP-ADDR>:9201`, using the IP
        address of your Promscale instance.
    *   Use the default values for all other settings.

</procedure>

You can now filter and view traces stored in Promscale using Grafana. To visualize your traces, go to the “Explore” section of Grafana. You will be taken to the traces filtering panel.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/images/misc/grafana-jaeger-query-results.png" alt="Sample output for Jaeger query filter in Grafana"/>

<procedure>

## Configuring Promscale as a PostgreSQL data source

1.  Navigate to `Configuration → Data Sources → Add data source → PostgreSQL`.
1.  Configure the data source settings:
    *   In the `Name` field, type `Promscale-SQL`.
    *   In the Host field, type `<host>:<port>`, where host and port need to be 
        obtained from the service url you copied when you created the Timescale cloud service. The format of that url is `postgresql://[user[:password]@][host][:port][/dbname][?param1=value1&...]`
    *   In the `Database` field, type the dbname from the service url.
    *   In the `User` and `Password` fields, type the user and password from the service.
    *   Change the `TLS/SSL Mode` to `require`. By default, the service URL requires TLS mode.
    *   Change the `TLS/SSL Method` file system path.
    *   Use the default values for all other settings.
    *   In the PostgreSQL details section, enable the TimescaleDB option.

</procedure>

You can now create panels that use Promscale as a PostgreSQL data source, using SQL queries to feed the chart

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/images/misc/grafana-sql-query-results.png" alt="Sample output for SQL query in Grafana"/>

[grafana-homepage]: https://grafana.com/
[grafana-docker]: https://grafana.com/docs/grafana/latest/installation/docker/#install-official-and-community-grafana-plugins
[grafana-install]: https://grafana.com/docs/grafana/latest/installation/