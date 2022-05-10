# Alerts, Dashboards and Runbooks

This sections describes how one can monitor Promscale using dashboards, alerts and
runbooks to troubleshoot Promscale.

<highlight type="note">
To use Promscale dashboard make sure to configure Promscale as Prometheus data source 
as mentioned [here](/visualize-data/grafana/#promscale-as-prometheus-datasource) to 
query the Promscale metrics from promscale.
</highlight>

## Dashboards

The dashboard consists of Promscale metrics like
    1. Overview
    2. Ingest
    3. Query
    4. Database
    5. Cache

<img class="main-content__illustration"
src="https://s3.amazonaws.com/assets.timescale.com/images/misc/grafana-promscale.jpeg"
alt="Promscale metrics dashboard"/>

<procedure>

## Import Promscale dashboard

Import Promscale dashboard by following below instructions

1.  Open the dashboard published by Promscale org from the [Grafana 
    community dashboards](grafana-promscale-dashboard), select `Copy ID to Clipboard` to copy the dashboard UID.
1.  In Grafana UI select `Create` from left side menu bar, navigate to `Import`.
1.  Now paste the dashbaord UID in `Import via grafana.com` textbox and click 
    on `Load` to import the dashbaord into Grafana instance.
1.  On importing the dashboard select the `folder` to which you want to add the imported
    dashboard.
1.  Select the data source from which you want the dashboard to query the data.
    * For Promscale metrics select the `Prometheus` data source as `Promscale-PromQL`.

</procedure>

## Alerts

You can configure alerting rules for Promscale to fire alerts 
when something doesn't work as expected in Promscale.

[Here](promscale-alerting-rules) are the alerting rules for Promscale. These 
alerting rules can be configured on Prometheus end or on Promscale end to evaluate
the alerting rules.

## Runbooks

The runbooks are to troubleshoot the most common issues noticed while running 
Promscale at scale. The runbooks are published and
maintained in [Promscale Github repository](promscale-runbooks).

[grafana-promscale-dashboard]: https://grafana.com/grafana/dashboards/16241
[promscale-alerting-rules]: https://raw.githubusercontent.com/timescale/promscale/master/docs/mixin/alerts/alerts.yaml
[promscale-runbooks]: https://github.com/timescale/promscale/tree/master/docs/runbooks