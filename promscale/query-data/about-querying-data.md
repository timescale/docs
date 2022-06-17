# Query data in Promscale
You can query the data stored in Promscale using SQL (metrics and traces)
and PromQL (only metrics).

PromQL queries have to be directed to the Promscale Connector.
Alternatively, you can direct PromQL queries to the Prometheus instance,
which reads data from the Connector using the `remote_read`
interface. The Connector, in turn, fetches data from TimescaleDB. You would
typically use a [visualization tool][visualize-data] to run PromQL queries.
Learn more about PromQL in the [Prometheus documentation][promql-docs].

SQL queries are handled directly by TimescaleDB. You can query the data
in Promscale with your preferred SQL tool. In this section, we use `psql`.
For more information about installing and using `psql`, see the
[installing psql section][install-psql].

[install-psql]: /timescaledb/:currentVersion:/how-to-guides/connecting/psql/
[visualize-data]: /promscale/:currentVersion:/visualize-data/
[promql-docs]: https://prometheus.io/docs/prometheus/latest/querying/basics/
