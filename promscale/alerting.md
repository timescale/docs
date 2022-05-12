# Alerting rules in Promscale
Promscale supports alerting rules. It evaluates these rules
at regular intervals. The Promscale connector can be used as the ruler while
ingesting and querying the data. In Promscale, you can set the alerting rules
similar to Prometheus rules configuration and publish the alerts to alertmanager. 

## Alert manager
Alertmanager manages alerts, including silencing, inhibition,
aggregation and sending out notifications via methods such as email, 
on-call notification systems, and chat platforms. The labels, 
summary and description described in alerting rules file is forwarded
to the alertmanager on meeting the promQL alert expression.

Setting up alerting and notifications are:

1. Setup and configure the Alertmanager
2. Configure Promscale to talk to the Alertmanager
3. Create alerting rules in Promscale

For more details on alertmanager, follow this [docs](am-docs).

<procedure>

## Set alerting rules

Promscale alerting rules are built on top of Prometheus
alerting rules capabilities. Alerting rules are written in a `YAML` file
and specified in the Promscale configuration
file. Promscale evaluates these conditional rules.
* `alerting rules` are used to trigger alerts when there is a violation of
pre-defined conditions. External services such as Slack or email can receive
these alerts. 

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
1.  Load the rules `YAML` file to Promscale by specifying this file in
    Prometheus configuration format along with `global evaluation interval` 
    , `rules files`, and `alerting` configuration:
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
1.  Pass this configuration file to Promscale using the `-metrics.rules.config`
    flag at start.
    
</procedure>

For information about alerting, see [Prometheus alerting][prometheus-alerting].
For specific information about alerting rules, see [Prometheus alerting
rules][prometheus-alert-rules].

[am-docs]: https://prometheus.io/docs/alerting/latest/alertmanager/
[prometheus-alerting]: https://prometheus.io/docs/alerting/latest/overview/
[prometheus-alert-rules]:
    https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/
