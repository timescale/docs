# Recording rules in Promscale
Promscale supports Prometheus recording rules. These rules
are used to calculate frequently used or computationally expensive queries
before they are required. A recording rule is a PromQL expression that
Prometheus evaluates at a predefined frequency to generate a new metric series.
The new metric series is stored in Promscale, and you can query it in the same
way as any other Prometheus metric. In Promscale, you can set the recording 
rules similar to Prometheus rules configuration.

<procedure>

## Set recording rules

Promscale recording rules are built on top of Prometheus recording rules capabilities.
Recording rules are written in a `YAML` file and specified in the Promscale configuration
file.
* `recording rules` are used for computationally expensive expressions and save
their result as a new set of time series data. These help in visualisation of
data over a long period of time. 

### Setting example recording rules
1.  Create a `YAML` file that contains the configuration for each record,
    similar to:
    ```yaml
     groups:
     - name: daily_stats
       interval: 1h
       rules:
       - record: customer:api_requests:rate1day
         expr: sum by (customer) (rate(api_requests_total[1d]))
    ```
1.  Load the rules `YAML` file to Promscale by specifying this file in
    Prometheus configuration format along with `global evaluation interval` 
    , and `rules files` configuration:
    ```yaml
     global:
       evaluation_interval: 10s

    rule_files:
      - "<rules-file>"
    ```
1.  Pass this configuration file to Promscale using the `-metrics.rules.config`
    flag at start.
    
</procedure>

To query the recorded metric with PromQL use metric name as:
```promql
customer:api_requests:rate1day
```

To query the metric with SQL:
```sql
SELECT time, jsonb(labels) as metric, value
FROM "customer:api_requests:rate1day"
ORDER BY time ASC
```

For more information about recording,
see [Prometheus recording][prometheus-recording]. 

For specific information about
recording rules, see [Prometheus recording rules][prometheus-recording-rules].

[prometheus-recording]: https://prometheus.io/docs/practices/rules/
[prometheus-recording-rules]:
    https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/
