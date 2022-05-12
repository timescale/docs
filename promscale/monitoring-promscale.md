# Monitoring Promscale
Promscale includes a set of out-of-the-box alerts, runbooks, and a Grafana dashboard that you can use to monitor it.

<highlight type="note">
To monitor Promscale, make sure that a Prometheus instance is scraping the Promscale
HTTP endpoint, which defaults to port `9201` port in the `/metrics` API. Use Prometheus to 
to evaluate the Promscale alerting rules, and configure Prometheus as a data source
in Grafana to visualize the Promscale dashboard. This helps to troubleshoot the
issues when Promscale isn't working as expected. You don't want your monitoring
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
1.  In Grafana UI select `Create` from left side menu bar, igate to `Import`.
1.  Now paste the dashbaord UID in `Import via grafana.com` textbox and click 
    on `Load` to import the dashbaord into Grafana instance.
1.  On importing the dashboard select the `folder` to which you want to add the imported
    dashboard.
1.  Select the data source from which you want the dashboard to query the data.
    * To visualize Promscale metrics select the `Prometheus` data source as `Prometheus` query endpoint
      You do not want to query Promsale's own dashboard using the Promscale query endpoint. With this practice
      this avoids a single point of failure if Promscale isn't working as expected.

</procedure>

## Alerts

You can configure alerting rules for Promscale to fire alerts 
when something doesn't work as expected in Promscale.

[Here](promscale-alerting-rules) are the alerting rules for Promscale. These 
alerting rules should be configured on the Prometheus end to evaluate the alerting rules.

## Runbooks

When an alert is fired, the alert message references the relevant runbook
to troubleshoot and mitigate the issue.
These runbooks are published and
maintained in the [Promscale Github repository](promscale-runbooks).

[grafana-promscale-dashboard]: https://grafana.com/grafana/dashboards/16241
[promscale-alerting-rules]: https://raw.githubusercontent.com/timescale/promscale/master/docs/mixin/alerts/alerts.yaml
[promscale-runbooks]: https://github.com/timescale/promscale/tree/master/docs/runbooks