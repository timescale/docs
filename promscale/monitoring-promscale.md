# Monitoring Promscale
Promscale includes a set of out-of-the-box alerts, runbooks and a Grafana dashboard that you can use to monitor it.

<highlight type="note">
To monitor Promscale make sure that a Prometheus instance is scraping Promscale
http endpoint i.e. default to `9201` port, `/metrics` API. Use Prometheus to 
evaluate the Promscale alerting rules and also configure Prometheus as data source
in Grafana to visulaize the Promscale dashboard. This helps to troubleshhot the
issues when Promscale isn't working as expected, again you don't want your monitoring
tool monitoring itself.
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
    * To visualize Promscale metrics select the `Prometheus` data source as `Prometheus` query endpoint
      we do not want to query Promsale own dashboard using Promscale query endpoint. With this practice
      we can avoid the single point of failure when Promscale isn't working as expected.

</procedure>

## Alerts

You can configure alerting rules for Promscale to fire alerts 
when something doesn't work as expected in Promscale.

[Here](promscale-alerting-rules) are the alerting rules for Promscale. These 
alerting rules should be configured on Prometheus end to evaluate the alerting rules.

## Runbooks

When an alert is fired, the alert message references the relevant runbook
to troubleshoot and mitigate the issue noticed while running 
Promscale. These runbooks are published and
maintained in [Promscale Github repository](promscale-runbooks).

[grafana-promscale-dashboard]: https://grafana.com/grafana/dashboards/16241
[promscale-alerting-rules]: https://raw.githubusercontent.com/timescale/promscale/master/docs/mixin/alerts/alerts.yaml
[promscale-runbooks]: https://github.com/timescale/promscale/tree/master/docs/runbooks