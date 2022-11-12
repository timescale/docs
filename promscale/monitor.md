---
title: Monitor Promscale
excerpt: Monitor Promscale with out-of-the-box alerts, runbooks, and dashboards
product: promscale
keywords: [Promtheus, alert, Alert Manager]
---

# Monitor Promscale

Promscale includes a set of out-of-the-box alerts, runbooks, and a Grafana
dashboard that you can use to monitor it.

<highlight type="note">
To monitor Promscale, make sure that a Prometheus instance is scraping the
Promscale HTTP metrics endpoint, which defaults to port `9201` port in the
`/metrics` API. Use Prometheus to evaluate the Promscale alerting rules, and
configure Prometheus as a data source in Grafana to visualize the Promscale
dashboard. This helps to troubleshoot issues when Promscale isn't working as
expected. You should be using a separate Prometheus instance and not Promscale.
You don't want your monitoring tool monitoring itself.
</highlight>

## Dashboard

The Grafana dashboard consists of Promscale metrics grouped in several rows:

*   Overview
*   Ingest
*   Query
*   Database
*   Cache

<procedure>

### Importing the Promscale Grafana dashboard

Import the Promscale Grafana dashboard by following the instructions below

1.  In the [Grafana community dashboards][grafana-promscale-dashboard], click
    the `Details` button to open the `Promscale metrics` dashboard published by
    Promscale
1.  Click `Copy ID to Clipboard` to copy the dashboard UID.
1.  In the Grafana UI, select `Import` from the `+` Create icon on the side
    menu.
1.  Paste the dashboard UID in the `Import via grafana.com` textbox, and click
    `Load`. The `Importing dashboard from Grafana.com` page appears.
1.  In  the `Folder` drop-down menu, choose the folder to which you want to add
    the dashboard..
1.  Select the data source that corresponds to the Prometheus instance that you
    are using to monitor Promcsale in the `Prometheus` drop-down.
1.  Click `Import`.

</procedure>

## Alerts

You can configure alerting rules for Promscale to send alerts when something
doesn't work as expected in Promscale.

[Here][promscale-alerting-rules] are the alerting rules for Promscale. These
alerting rules should be configured on the Prometheus instance that you
are using to monitor Promscale.

## Runbooks

When an alert is sent, the alert message references the relevant runbook to
troubleshoot and mitigate the issue. These runbooks are published and maintained
in the [Promscale Github repository][promscale-runbooks].

[grafana-promscale-dashboard]: https://grafana.com/grafana/dashboards/16241
[promscale-alerting-rules]: https://raw.githubusercontent.com/timescale/promscale/master/docs/mixin/alerts/alerts.yaml
[promscale-runbooks]: https://github.com/timescale/promscale/tree/master/docs/runbooks
