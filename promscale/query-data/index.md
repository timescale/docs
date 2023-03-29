---
title: Query data in Promscale
excerpt: Learn how to query data in Promscale
products: [promscale]
---

import PromscaleDeprecation from "versionContent/_partials/_deprecated-promscale.mdx";

# Query data in Promscale

<PromscaleDeprecation />

You can query the data such as metrics and traces stored in Promscale. You can
use SQL to query both metrics and traces. SQL queries are handled directly by
TimescaleDB. You can query the data in Promscale with your preferred SQL tool.

You can use PromQL to only query metrics. PromQL queries have to be directed to
the Promscale Connector. Alternatively, you can direct PromQL queries to the
Prometheus instance, which reads data from the Connector using the `remote_read`
interface. The Connector, in turn, fetches data from TimescaleDB. You would
typically use a [visualization tool][visualize-data] to run PromQL queries.
Learn more about PromQL in the [Prometheus documentation][promql-docs].

*   [Query metrics][query-metrics] using SQL
*   [Query traces][query-traces] using SQL

[promql-docs]: https://prometheus.io/docs/prometheus/latest/querying/basics/
[query-metrics]: /promscale/:currentVersion:/query-data/query-metrics/
[query-traces]: /promscale/:currentVersion:/query-data/query-traces/
[visualize-data]: /promscale/:currentVersion:/visualize-data/
