---
title: Limitations
excerpt: Current limitations of Timescale features
keywords: [hypertables, distributed hypertables]
---

# Limitations

While Timescale generally offers capabilities that go beyond what
PostgreSQL offers, there are some limitations to using hypertables,
and, in particular, distributed hypertables. This section documents
the common limitations when using both regular and distributed
hypertables.

## Hypertable limitations

*   Time dimensions (columns) used for partitioning cannot have NULL values.
*   Unique indexes must include all columns that are partitioning
  dimensions.
*   `UPDATE` statements that move values between partitions (chunks) are not
    supported. This includes upserts (`INSERT ... ON CONFLICT UPDATE`).
*   Foreign key constraints from a hypertable referencing another hypertable are not supported.

## Distributed hypertable limitations

All the limitations of regular hypertables also apply to distributed
hypertables. In addition, the following limitations apply specifically
to distributed hypertables:

*   Distributed scheduling of background jobs is not supported. Background jobs
    created on an access node are scheduled and executed on this access node
    without distributing the jobs to data nodes.
*   Continuous aggregates can aggregate data distributed across data nodes, but
    the continuous aggregate itself must live on the access node. This could
    create a limitation on how far you can scale your installation, but because
    continuous aggregates are downsamples of the data, this does not usually
    create a problem.
*   Reordering chunks is not supported.
*   Tablespaces cannot be attached to a distributed hypertable on the access
    node. It is still possible to attach tablespaces on data nodes.
*   Roles and permissions are assumed to be consistent across the nodes of a
    distributed database, but consistency is not enforced.
*   Joins on data nodes are not supported. Joining a distributed hypertable with
    another table requires the other table to reside on the access node. This
    also limits the performance of joins on distributed hypertables.
*   Tables referenced by foreign key constraints in a distributed hypertable
    must be present on the access node and all data nodes. This applies also to
    referenced values.
*   Parallel-aware scans and appends are not supported.
*   Distributed hypertables do not natively provide a consistent restore point
    for backup and restore across nodes. Use the
    [`create_distributed_restore_point`][create_distributed_restore_point]
    command, and make sure you take care when you restore individual backups to
    access and data nodes.
*   For native replication limitations, see the
    [native replication section][native-replication].
*   User defined functions have to be manually installed on the data nodes so
    that the function definition is available on both access and data nodes.
    This is particularly relevant for functions that are registered with
    `set_integer_now_func`.

Note that these limitations concern usage from the access node. Some
currently unsupported features might still work on individual data nodes,
but such usage is neither tested nor officially supported. Future versions
of Timescale might remove some of these limitations.

[native-replication]: /self-hosted/:currentVersion:/distributed-hypertables/about-distributed-hypertables/#replicating-distributed-hypertables
[create_distributed_restore_point]: /api/:currentVersion:/distributed-hypertables/create_distributed_restore_point/
