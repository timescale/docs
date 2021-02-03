# Limitations [](limitations)

While TimescaleDB generally offers capabilities that go beyond what
PostgreSQL offers, there are some limitations to using hypertables,
and, in particular, distributed hypertables. This section documents
the common limitations when using both regular and distributed
hypertables.

## Hypertable Limitations [](hypertable-limitations)

- Foreign key constraints referencing a hypertable are not supported.
- Time dimensions (columns) used for partitioning cannot have NULL
  values.
- Unique indexes must include all columns that are partitioning
  dimensions.
- `UPDATE` statements that move values between partitions (chunks) are
  not supported. This includes upserts (`INSERT ... ON CONFLICT
  UPDATE`).

## Distributed Hypertable Limitations [](distributed-hypertable-limitations)

All the limitations of regular hypertables also apply to distributed
hypertables. In addition, the following limitations apply specifically
to distributed hypertables:

- Distributed scheduling of background jobs is not supported. Background jobs 
  created on an access node are scheduled and executed on this access node 
  without distributing the jobs to data nodes.
- Continuous aggregates are not supported.
- Compression policies are not supported. However, you can enable 
  compression on the distributed hypertable and manually 
  execute `compress_chunk`.
- Reordering chunks is not supported.
- Tablespaces cannot be attached to a distributed hypertable on the
  access node. It is still possible attach tablespaces on data nodes.
- Roles and permissions are assumed to be consistent across the nodes
  of a distributed database, but consistency is not enforced.
- Joins on data nodes are not supported. Joining a distributed
  hypertable with another table requires the other table to reside on
  the access node. This also limits the performance of joins on
  distributed hypertables.
- Tables referenced by foreign key constraints in a distributed
  hypertable must be present on the access node and all data
  nodes. This applies also to referenced values.
- Parallel-aware scans and appends are not supported.
- A consistent restore point for backup/restore across nodes is not 
  natively provided; care must be taken when restoring individual 
  backups to access and data nodes.
- Native replication limitations are described [here][native-replication].
- User defined functions have to be manually installed on the data nodes 
  so that the function definition is available on both access and data
  nodes. This is particularly relevant for functions that are
  registered with `set_integer_now_func`.

Note that these limitations concern usage from the access node. Some
currently unsupported features (like compression policy or
continuous aggregates) might still work on individual data nodes, but
such usage is neither tested nor officially supported. Future versions
of TimescaleDB might remove some of these limitations.

[native-replication]: /using-timescaledb/distributed-hypertables#native-replication
