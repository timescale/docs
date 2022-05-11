# APM Experience with traces

With Promscale you can get the APM like experience on top of traces data using SQL.
This can be done by importing the Grafana dashboads published by the Promscale team.

<highlight type="note">
Before you import the APM dashboards in Grafana, you need to add below data sources
    * [Jaeger data source][promscale-as-jaeger].
    * [PostgreSQL data source][promscale-as-postgresql].
</highlight>
 
You can import APM dashboards in one of the following ways:

1. Importing APM dashboards from Grafana community dashboards published by Promscale org.
2. Importing as JSON files from Promscale Github repo.
3. Mounting dashboards as snapshot while installing Grafana.

## Importaing APM dashboards from Grafana community

All the dashboards are published [here](promscale-grafana-dashboards)

<procedure>

1.  Open the dashboard published by Promscale org from the above reference URL. Select 
    `Copy ID to Clipboard` to copy the dashboard UID.
1.  In Grafana UI select `Create` from left side menu bar, navigate to `Import`.
1.  Now paste the dashbaord UID in `Import via grafana.com` textbox and click 
    on `Load` to import the dashbaord into Grafana instance.
1.  On importing the dashboard select the `folder` to which you want to add the imported
    dashboard.
1.  If requested, select the data sources from which you want the dashboard to query the data.
    * For APM dashboards select the `TimescaleDB / PostgreSQL` data source 
      as `Promscale-SQL`.
    * For APM dashboards select the `Promscale Jaeger Tracing` data source 
      as `Promscale-Tracing`.

</procedure>

## Importing dashbaords as JSON files.

All the Promscale dashboards are available at [Promscale dashboards](promscle-github-dashboards). 

<procedure>

1.  Download all the `.json` files from the above referenced Promscale dashboards URL.
1.  In Grafana UI select `Create` from left side menu bar, navigate to `Import`.
1.  Select `Upload JSON file` option and select the downloaded `json` dashboard file
    to import into Grafana instance.
1.  On importing the dashboard select the `folder` to which you want to add the imported
    dashboard.
1.  If requested, select the data sources from which you want the dashboard to query the data.
    * For APM dashboards select the `TimescaleDB / PostgreSQL` data source
      as `Promscale-SQL`.
    * For APM dashboards select the `Promscale Jaeger Tracing` data source 
      as `Promscale-Tracing`.

</procedure>

## Mounting dashboards as snapshots

You can mount the dashboards in Grafana on startup by using the configuration options
offered by Grafana as shared in [Grafana docs](grafana-dashboard-mounting) add
all the dashboards with APM as prefix from [Promscale Github repo](promscale-github-dashboards) to
the directory thats mounted in Grafana configuration. 

[promscale-grafana-dashboards]: https://grafana.com/orgs/promscale/dashboards
[promscale-github-dashboards]: https://github.com/timescale/promscale/tree/master/docs/mixin/dashboards
[grafana-dashboard-mounting]: https://grafana.com/docs/grafana/latest/administration/provisioning/#dashboards
[promscale-as-prometheus]:
    /visualize-data/grafana/#promscale-as-prometheus-datasource
[promscale-as-jaeger]: /visualize-data/grafana/#promscale-as-jaeger-datasource
[promscale-as-postgresql]:
    /visualize-data/grafana/#promscale-as-postgresql-datasource