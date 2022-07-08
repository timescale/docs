# Prometheus
Prometheus is used to monitor infrastructure metrics. It scrapes any endpoints
that expose metrics in a compatible format. The metrics are stored in
Prometheus, and you can query them using PromQL (Prometheus Query Language).
Prometheus is not intended for long-term metrics storage, but it supports a
variety of remote storage solutions for that purpose.

TimescaleDB can use Prometheus as a remote store for long-term metrics, by using
[Promscale][promscale]. Promscale supports both PromQL and SQL queries. PromQL
queries are directed to the Promscale endpoint or the Prometheus instance. SQL
queries are handled directly by TimescaleDB. Promscale also offers other native
time-series capabilities, such as automatically
[compressing your data][timescale-compression], retention policies, continuous
aggregate views, downsampling, data gap-filling, and interpolation.
Additionally, Promscale supports Grafana using [Prometheus][prometheus-grafana]
and [PostgreSQL][postgres-grafana] data sources.

[promscale]: /promscale/:currentVersion:/
[timescale-compression]: https://blog.timescale.com/blog/building-columnar-compression-in-a-row-oriented-database/
[prometheus-grafana]: https://grafana.com/docs/grafana/latest/datasources/prometheus/
[postgres-grafana]: https://grafana.com/docs/grafana/latest/datasources/postgres/
