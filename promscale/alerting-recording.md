# Alerting rules and recording reules in Promscale
Promscale supports alerting rules and recording rules. It evaluates these rules
at regular intervals. The Promscale connector can be used as the ruler while
ingesting and querying the data. In Promscale, you can set the alerting rules
and recording rules similar to Prometheus rules configuration.

<procedure>

## Set alerting rules and recording rules

Promscale alerting rules and recording rules are built on top of Prometheus
alerting rules and recording rules capabilities. Alerting rules and recording
rules are written in a `YAML` file and specified in the Promscale configuration
file. Promscale evaluates these conditional rules.
* `alerting rules` are used to trigger alerts when there is a violation of
pre-defined conditions. External services such as Slack or email can receive
these alerts.
* `recording rules` are used for computationally expensive expressions and save
their result as a new set of time series data. These help in visualisation of
data over a period of time. 

### Setting alerting rules and recording rules
1.  Create a `YAML` file that contains the configuration for each alert and record,
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
     - name: <record-group-name>
       rules:
      - record: <record-name>
        expr: <promql_expression>
    ```
1.  Load the rules `YAML` file to Promscale by specifying this file in
    Prometheus configuration format along with `global evaluation interval` 
    , `rules files`, and `alerting` configuration:
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
1.  Pass this configuration file to Promscale using the `-metrics.rules.config`
    flag at start.
    
</procedure>

For information about alerting, see [Prometheus alerting][prometheus-alerting].
For specific information about alerting rules, see [Prometheus alerting
rules][prometheus-alert-rules]. For information about recording,
see [Prometheus recording][prometheus-recording]. For specifc information about
recording rules, see [Prometheus recording rules][prometheus-recording-rules].

[prometheus-alerting]: https://prometheus.io/docs/alerting/latest/overview/
[prometheus-alert-rules]:
    https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/
[prometheus-recording]: https://prometheus.io/docs/practices/rules/
[prometheus-recording-rules]:
    https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/
