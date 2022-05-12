# Application Performance Management (APM) with traces
Promscale provides an APM-like experience with traces data using SQL. Import the 
Grafana dashboards that are published by the Promscale team to get the APM 
with traces.

## Before you begin importing APM dashboards
* Add these data sources in Grafana:
    * [Jaeger data source][promscale-as-jaeger].
    * [PostgreSQL data source][promscale-as-postgresql].   
* Check that the `timescaledb_toolkit` extension is installed.
  To verify if the extension is installed, run this SQL query:
  `SELECT * FROM pg_extension WHERE extname='timescaledb_toolkit';` 
  If the query returns no results the extension is not installed.

## Installing timescaledb_toolkit PostgreSQL extension
<procedure> 
To install the timescaledb_toolkit PostgreSQL extension:
1. Check if the extension is available:
   ```sql
   SELECT * FROM pg_available_extensions WHERE name='timescaledb_toolkit';
   ```
   <highlight type="note"> 
   If the query returns no results, the extension is not available for installation
   in your database. To make it available follow [these
   instructions](install-toolkit). 
   </highlight>
1. Install the extension using:
   ```sql
   CREATE EXTENSION timescaledb_toolkit;
   ```
</procedure>

You can use one of these methods to import APM dashboards:

*  From the Grafana community the dashboards published by Promscale.
*  From Promscale Github repository as JSON files.
*  When installing Grafana, mount APM dashboards as a snapshot.

### Importing APM dashboards from the Grafana community

[Grafana community dashboards](promscale-grafana-dashboards) contains all the
dashboards published by Promscale. 

<procedure>

1.  Click the `Details` button to open a dashboard from [Grafana community
    dashboard](promscale-grafana-dashboards). 
1.  Click `Copy ID to Clipboard` to copy the UID of the dashboard.
1.  In the Grafana UI, select `Import` from the `+` Create icon on the side
    menu.
1.  Paste the dashboard UID in the `Import via grafana.com` textbox, and click
    `Load`. The `Importing dashboard from Grafana.com` page appears.
1.  In  the `Folder` drop-down menu, choose the folder to which you want to add
    the dashboard.
1.  Select the data sources from which you want the dashboard to query the data.
    * For APM dashboards select `TimescaleDB or PostgreSQL data source` as
      `Promscale-SQL`.
    * For APM dashboards select `Promscale Jaeger Tracing data source` as
      `Promscale-Tracing`.
1.  Click `Import`.

</procedure>

### Importing dashboards as JSON files.

[Promscale dashboards](promscale-github-dashboards) repository contains all the
dashboards published by Promscale. 

<procedure>

1.  Download all the `.json` files from the [Promscale
    dashboards](promscle-github-dashboards) repository.
1.  In the Grafana UI, select `Import` from the `+` Create icon on the side
    menu.
1.  Select the `Upload JSON file` button, and select the downloaded `JSON` dashboard
    file. The `Importing dashboard from Grafana.com` page appears.
1.  In  the `Folder` drop-down menu, choose the folder to which you want to add
    the dashboard.
1.  Select the data sources from which you want the dashboard to query the data.
    * For APM dashboards select `TimescaleDB or PostgreSQL data source` as
      `Promscale-SQL`.
    * For APM dashboards select `Promscale Jaeger Tracing data source` as
      `Promscale-Tracing`.
1.  Click `Import`.

</procedure>

### Mounting dashboards as snapshots

You can mount the dashboards in Grafana on startup using the configuration
options in Grafana. For more information, see [Provisioning Grafana](grafana-dashboard-mounting).
In that directory that is mounted to Grafana configuration, prefix `APM` to all
the dashboards with APM as prefix from [Promscale Github repository](promscale-github-dashboards). 

[promscale-grafana-dashboards]: https://grafana.com/orgs/promscale/dashboards
[promscale-github-dashboards]:
    https://github.com/timescale/promscale/tree/master/docs/mixin/dashboards
[grafana-dashboard-mounting]:
    https://grafana.com/docs/grafana/latest/administration/provisioning/#dashboards
[promscale-as-prometheus]:
    /visualize-data/grafana/#promscale-as-prometheus-datasource
[promscale-as-jaeger]: /visualize-data/grafana/#promscale-as-jaeger-datasource
[promscale-as-postgresql]:
    /visualize-data/grafana/#promscale-as-postgresql-datasource
[install-toolkit]:/timescaledb/latest/how-to-guides/hyperfunctions/install-toolkit
