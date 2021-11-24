# About multi-node
If you have a larger workload, you might need more than one TimescaleDB
instance. TimescaleDB multi-node allows you to run and manage multiple
instances, which can give you faster data ingest, and more responsive and
efficient queries for many large workloads.

<highlight type="important">
In some cases, your processing speeds could be slower in a multi-node cluster,
because distributed hypertables need to push operations down to the various data
nodes. It is important that you understand multi-node architecture before you
begin, and plan your database according to your specific environment.
</highlight>

You can use multi-node on a self-managed TimescaleDB instance, or you can use it
on [Timescale Cloud][multinode-cloud] or
[Managed Service for TimescaleDB][multinode-mst].

## Distributed hypertables
Multi-node TimescaleDB allows you to run petabyte-scale workloads across
multiple physical TimescaleDB instances, called data nodes. To do this, we use
distributed hypertables.

A [hypertable][hypertables] is a virtual table in TimescaleDB that automatically
partitions data into chunks on a single machine, continuously creating new ones
as necessary, while acting like a single continuous table across all time. A
distributed hypertable is a hypertable that automatically partitions data into
chunks across multiple machines, while still like a single continuous table
across all time.

## Multi-node architecture
Multi-node clusters consist of an access node that stores metadata
for the distributed hypertable and performs query planning across the cluster,
and any number of data nodes that store subsets of the distributed hypertable
dataset and run queries locally.

You create the nodes by assigning roles to them within TimescaleDB. If you are
using Timescale Cloud to run your multi-node cluster, they are created by
default when you choose to create a multi-node cluster. For more instructions,
see the [multi-node on Timescale Cloud][multinode-cloud] section.

On a self-hosted installation, you create a server that can act as an access
node (AN), then use that access node to create data nodes (DN). Finally, you
create the distributed hypertable in the same way as you create a regular
hypertable.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/multi-node-arch.png" alt="Diagram showing how multi-node access and data nodes interact"/>

### Partitioning methods
Data that is ingested into a distributed hypertable is spread across the data
nodes according to the partitioning method you have chosen. Queries that can be
sent from the access node to multiple data nodes and processed simultaneously
generally run faster than queries that run on a single data node, so it is
important to think about what kind of data you have, and the type of queries you
want to run.

TimescaleDB multi-node currently supports capabilities that make it best suited
for large-volume time-series workloads that are partitioned on `time`, and a
space dimension such as `location`. If you usually run wide queries that
aggregate data across many locations and devices, choose this partitioning
method. For example, a query like this is faster on a database partitioned on
`time,location`, because it spreads the work across all the data nodes in
parallel:
```sql
SELECT time_bucket('1 hour', time) AS hour, location, avg(temperature)
FROM conditions
GROUP BY hour, location
ORDER BY hour, location
LIMIT 100;
```

Partitioning on `time` and a space dimension such as `location`, is also best if
you need faster insert performance. If you partition only on time, and your
inserts are generally occuring in time order, then you are always writing to one
data node at a time. Partitioning on `time` and `location` means your
time-ordered inserts are spread across multiple data nodes, which can lead to
better performance.

If you mostly run deep time queries on a single location, you might see better
performance by partitioning solely on the `time` dimension, or on a space
dimension other than `location`. For example, a query like this is faster on a
database partitioned on `time` only, because the data for a single location is
spread across all the data nodes, rather than being on a single one:
```sql
SELECT time_bucket('1 hour', time) AS hour, avg(temperature)
FROM conditions
WHERE location = 'office_1'
GROUP BY hour
ORDER BY hour
LIMIT 100;
```

### Transactions and consistency model
Transactions that occur on distributed hypertables are atomic, just
like those on regular hypertables. This means that a distributed 
transaction that involves multiple data nodes is guaranteed to 
either succeed on all nodes or on none of them. This guarantee
is provided by the [two-phase commit protocol][2pc], which
is used to implement distributed transactions in TimescaleDB.

However, the read consistency of a distributed hypertable is different
to a regular hypertable. Because a distributed transaction is a set of 
individual transactions across multiple nodes, each node can commit 
its local transaction at a slightly different time due to network 
transmission delays or other small fluctuations. As a consequence, the
access node cannot guarantee a fully consistent snapshot of the
data across all data nodes. For example, a distributed read
transaction might start when another concurrent write transaction is
in its commit phase and has committed on some data nodes but not
others. The read transaction can therefore use a snapshot on one node
that includes the other transaction's modifications, while the
snapshot on another data node might not include them.

If you need stronger read consistency in a distributed transaction, then you
can use consistent snapshots across all data nodes. However, this
requires a lot of coordination and management, which can negatively effect
performance, and it is therefore not implemented by default for distributed 
hypertables.

[hypertables]: /how-to-guides/hypertables/
[multinode-cloud]: /cloud/:currentVersion:/cloud-multi-node/
[multinode-mst]: /mst/:currentVersion:/mst-multi-node/
[2pc]: https://www.postgresql.org/docs/current/sql-prepare-transaction.html
