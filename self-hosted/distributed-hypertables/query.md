---
title: Query data in distributed hypertables
excerpt: Sunsetted v2.14.x. Query data in distributed hypertables in your self-hosted TimescaleDB installation
keywords: [distributed hypertables, multi-node, queries]
seo:
  robots: noindex
---

import MultiNodeDeprecation from "versionContent/partials/_multi-node-deprecation.mdx";

<MultiNodeDeprecation />

# Query data in distributed hypertables

You can query a distributed hypertable just as you would query a standard
hypertable or PostgreSQL table. For more information, see the section on
[writing data][write].

Queries perform best when the access node can push transactions down to the data
nodes. To ensure that the access node can push down transactions, check that the
[`enable_partitionwise_aggregate`][enable_partitionwise_aggregate] setting is
set to `on` for the access node. By default, it is `off`.

If you want to use continuous aggregates on your distributed hypertable, see the
[continuous aggregates][caggs] section for more information.

[caggs]: /use-timescale/:currentVersion:/continuous-aggregates/
[enable_partitionwise_aggregate]: https://www.postgresql.org/docs/current/runtime-config-query.html
[write]: /use-timescale/:currentVersion:/write-data/
