# Alerting in Promscale
To configure alerts in Promscale, use the alerting capabilities provided by
Prometheus.

Prometheus alerting rules are used to trigger alerts based on the violation of
conditions. Alerts can be configured to send to external services such as Slack
or email. Alerting rules are written in a YAML file and specified in the
Prometheus configuration file. These conditional rules are evaluated by
Prometheus, not by Promscale.

Set up alerting by creating a YAML file containing configuration like
this for each alert you want to add:
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

Load the newly created alert rule file to Prometheus by adding this to the
Prometheus configuration file:
```yaml
rule_files:
  - "<alert-rules-file>"
```

Configure the alert manager by adding this to the Prometheus configuration file:
```yaml
alerting:
  alertmanagers:
  - static_configs:
    - targets:
      - localhost:9093
```

For more information about Prometheus alerting, see
[the Prometheus alerting documentation][prometheus-alerting]. For specific
information about alerting rules in Prometheus, see
[the Prometheus alerting rules documentation][prometheus-alert-rules].


[prometheus-alerting]: https://prometheus.io/docs/alerting/latest/overview/
[prometheus-alert-rules]: https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/
