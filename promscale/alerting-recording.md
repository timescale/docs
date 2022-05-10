# Alerting, Recording in Promscale
Alerting, Recording is natively supported in Promscale. The Promscale connector
works as a ruler by default while ingesting and querying the data. To use alerting,
recoridng rules capabilities in Promscale you can use the same Prometheus rules
configuration with Promscale.

Promscale alerting, recording offering is built on top of Prometheus alerting, 
recording rules capabilities. Promscale alerting rules are used to trigger 
alerts based on the violation of conditions, Promscale recording rules are used
for computationally expensive expressions and save their result as a new set
of time series.s for easy visualisation of data over a period. Alerts can be 
configured to send to external services such as Slack or email. Alerting, Recording 
rules are written in a YAML file and specified in the Promscale configuration 
file. These  conditional rules are evaluated by Promscale.

Set up alerting, recording by creating a YAML file containing configuration like
this for each alert, record you want to add:
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
  - name: <record-group-name>
    rules:
    - record: <record-name>
      expr: <promql_expression>
```

Load the newly created rules file to Promscale by adding this in
Prometheus configuration format along with global evaluation interval and
alert manager client configuration:
```yaml
global:
  evaluation_interval: 10s

rule_files:
  - "<alert-rules-file>"

alerting:
  alertmanagers:
  - static_configs:
    - targets:
      - localhost:9093
```

Now pass the above configuration file to Promscale
using `-metrics.rules.config` flag.

For more information about Promscale alerting, recording, refer to
Prometheus docs, as Promscale alerting and recording rules are built inline to
Prometheus alerting, recording offerings.
For sepcifc information on alerting, see [the Prometheus alerting documentation][prometheus-alerting]. 
For specific information about alerting rules, see
[the Prometheus alerting rules documentation][prometheus-alert-rules].
For specifc information about recording, see
[the Prometheus recording documentation][prometheus-recording].
For specifc information about recording, see
[the Prometheus recording rules documentation][prometheus-recording-rules].

[prometheus-alerting]: https://prometheus.io/docs/alerting/latest/overview/
[prometheus-alert-rules]: https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/
[prometheus-recording]: https://prometheus.io/docs/practices/rules/
[prometheus-recording-rules]: https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/