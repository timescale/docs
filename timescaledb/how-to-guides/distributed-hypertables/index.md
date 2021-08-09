# Distributed hypertables

Distributed hypertables extend regular hypertables with the ability to
store data chunks across multiple data nodes for better scale-out
performance. Prior to creating a distributed hypertable, however,
TimescaleDB must be [set up for multi-node
usage][getting-started-multi-node].

In most cases, using a distributed hypertable is similar to using a
regular hypertable, including inserting, querying, and altering
it. Thus, for basic usage, please review the [documentation for regular
hypertables][using-hypertables].

For inserts and queries, however, a distributed hypertable has unique
performance characteristics and there are also additional limitations
due to its distributed nature. For instance, query performance is
heavily dependent on the ability to *push down* work to data nodes,
which in turn ties into how data is partitioned across the nodes. If
it is not possible to push down computations, or the query does not
involve many data nodes, the query performance of a distributed
hypertable will likely be worse than that of a regular hypertable due
to the additional network overhead.

Note, also, that distributed hypertables can live alongside
non-distributed tables and other objects; in fact, no objects are
distributed by default. Interactions between distributed hypertables
and non-distributed objects might not have the expected behavior. For
instance, setting permissions on a distributed hypertable only works
if the roles involved exist identically on all data nodes. Further,
joins between a local table and a distributed hypertable requires
fetching the raw data from data nodes and performing the join locally.

<highlight type="warning">
Distributed hypertables currently have some limitations when
compared to non-distributed hypertables. Before creating a
distributed hypertable for production workloads, please review our
[limitations](/latest/overview/limitations/#distributed-hypertable-limitations)
document to ensure that your use case will work as expected. You can also
[contact us](https://www.timescale.com/contact) or join the #multinode channel
in our [community Slack](https://slack.timescale.com/).
</highlight>

[getting-started-multi-node]: /how-to-guides/multi-node-setup/
[using-hypertables]: /how-to-guides/hypertables/
