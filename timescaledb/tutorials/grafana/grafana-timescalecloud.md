# Connect TimescaleDB and Grafana
Grafana ships with built-in Prometheus, PostgreSQL, Jaeger, and other data
source plugins that allow you to query and visualize data from a compatible
database. To add a data source in Grafana you must be signed as a user with
organization administration role privileges.

To connect Grafana with TimescaleCloud database instance, install Grafana. For
information about installing Grafana, see the [Grafana installation documentation][grafana-install].

This section shows you how to connect TimescaleCloud database instance as data
source in [Grafana][grafana-homepage].

## Configure TimscaleDB as a data source
To configure TimscaleCloud database as data source you need the create a
TimescaleDB service and then configure TimescaleDB as the data source in
Grafana.

<procedure>

### Creating a TimescaleDB service

1.  Sign in to the [Timescale Cloud portal][tsc-portal].
1.  Click `Create service`.
1.  You can choose to build your service with or without demo data. 
1.  Click `Download the cheatsheet`. This `.sql` file contains the credentials
    that you require to configure TimescaleDB as a data source on Grafana.

<highlight type="important">
Your Timescale Cloud trial is completely free for you to use for the first
thirty days. This gives you enough time to complete all our tutorials and run a
few test projects of your own.
</highlight>
</procedure>

<procedure>

### Configuring TimescaleDB as data source

1.  Navigate to `Configuration` → `Data sources`. The data sources page lists
    previously configured data sources for the Grafana instance.
1.  Click `Add data source` to see a list of all supported data sources.
1.  Type `PostgreSQL` in the search field and click `Select`.
1.  Configure the data source:
    *   In the `Name` field, type name that you would like for dataset on TimescaleDB.
    *   In the `PostgreSQL Connection` section, type the  `Database`, `User`,
        and `Password` fields using the `.sql` file that you downloaded when
        creating the TimescaleDB service. 
    *   In the `Host` type `<HOST>:<PORT>` from the `.sql` file that you downloaded.
    *   Set `TLS/SSL Mode` as `require`.
    *   In `PostgreSQL details` enable `TimescaleDB`
1.  Click `Save & test` button. If the connection is successful
    `Database Connection OK` appears. 

</procedure>

When you have configured TimescaleDB as a data source in Grafana, you can create panels that are populated with data using SQL.

[grafana-install]: https://grafana.com/docs/grafana/latest/installation/
[grafana-homepage]: https://grafana.com/
[tsc-portal]: https://console.cloud.timescale.com/