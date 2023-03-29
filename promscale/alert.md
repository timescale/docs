---
title: Alert in Promscale
excerpt: Configure alerting rules in Promscale
products: [promscale]
keywords: [Prometheus, alert, Alert Manager]
---

import PromscaleDeprecation from "versionContent/_partials/_deprecated-promscale.mdx";

# Alert in Promscale

<PromscaleDeprecation />

Promscale supports alerting rules. It evaluates these rules at regular
intervals. The Promscale connector can be used as the ruler while ingesting and
querying the data. In Promscale, you can set the alerting rules similar to
Prometheus rules configuration and publish the alerts to alertmanager.

## Alert manager

The alert manager manages alerts, including silencing, inhibition,
and aggregation. It also sends out notifications using email,
on-call notification systems, and chat platforms. The labels,
summary, and description described in the alerting rules file is forwarded
to the alert manager on meeting the PromQL alert expression.

To set up alerting and notifications, you need to:

1.  Setup and configure the alert manager
1.  Configure Promscale to talk to the alert manager
1.  Create alerting rules in Promscale

For more details about the `alertmanager` tool, see the [alert manager documentation][am-docs].

## Set alerting rules

Promscale alerting rules are compatible with Prometheus
alerting rules capabilities. Alerting rules are written in one or multiple
`YAML` files. Promscale evaluates these conditional rules. The alerting rules
are used to trigger alerts when there is a violation of pre-defined conditions.
Alert notifications can be sent through different communication channels like Slack
or email can receive these alerts.

<Procedure>

### Setting alerting rules

1.  Create a `YAML` file that contains the configuration for each alert
    similar to:

    ```yaml
     groups:
     - name: <alert-group-name>
       rules:
       - alert: <alert-name>
         expr: <promql_expression>
         for: <time-interval for how long this to happen to happen to fire an alert>
         labels:
           <key>:<value>
         annotations:
         summary: <text>
         description: <description on alert>
    ```

1.  Create another file that lists all rules `YAML` files as well as global configuration
    parameters:

    ```yaml
     global:
       evaluation_interval: 10s

    rule_files:
      - "<alert-rules-file>"

    #AlertManager client configuration to publish alerts
    alerting:
      alertmanagers:
      - static_configs:
        - targets:
        - localhost:9093
    ```

1.  Pass this configuration file to Promscale when you start the service,
    using the `-metrics.rules.config` flag.

</Procedure>

For more information about alerting, see [Prometheus alerting][prometheus-alerting].
For specific information about alerting rules, see [Prometheus alerting
rules][prometheus-alert-rules].

[am-docs]: https://prometheus.io/docs/alerting/latest/alertmanager/
[prometheus-alert-rules]: https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/
[prometheus-alerting]: https://prometheus.io/docs/alerting/latest/overview/
