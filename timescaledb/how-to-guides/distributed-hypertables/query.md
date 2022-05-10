# Query data in distributed hypertables
You can query a distributed hypertable just as you would query a regular
hypertable or PostgreSQL table. For more information, see the section on
[writing data][write].

Queries perform best when the access node can push transactions down to the data
nodes. To ensure that the access node can push down transactions, check that the
[`enable_partitionwise_aggregate`][enable_partitionwise_aggregate] setting is
set to `on` for the access node. By default, it is `off`.

If you want to use continuous aggregates on your distributed hypertable, see the
[continuous aggregates][caggs] section for more information.

[caggs]: /how-to-guides/continuous-aggregates/
[enable_partitionwise_aggregate]: https://www.postgresql.org/docs/current/runtime-config-query.html
[write]: /how-to-guides/write-data/
