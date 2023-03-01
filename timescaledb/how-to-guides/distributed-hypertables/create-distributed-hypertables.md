---
title: Create distributed hypertables
excerpt: Create a distributed hypertable in a multi-node TimescaleDB instance
products: [cloud, mst, self_hosted]
keywords: [distributed hypertables, multi-node, create]
---

# Create distributed hypertables

If you have a [multi-node environment][multi-node], you can create a distributed
hypertable across your data nodes. First create a standard PostgreSQL table, and
then convert it into a distributed hypertable.

<Highlight type="important">
You need to set up your multi-node cluster before creating a distributed
hypertable. To set up multi-node, see the [multi-node
section](/timescaledb/latest/how-to-guides/multinode-timescaledb/).
</Highlight>

<Procedure>

### Creating a distributed hypertable

1.  On the access node of your multi-node cluster, create a standard
    [PostgreSQL table][postgres-createtable]:

    ```sql
    CREATE TABLE conditions (
      time        TIMESTAMPTZ       NOT NULL,
      location    TEXT              NOT NULL,
      temperature DOUBLE PRECISION  NULL,
      humidity    DOUBLE PRECISION  NULL
    );
    ```

1.  Convert the table to a distributed hypertable. Specify the name of the table
    you want to convert, the column that holds its time values, and a
    space-partitioning parameter. For more information about space partitions,
    see the [space-partitioning section][space-partitions].

     ```sql
     SELECT create_distributed_hypertable('conditions', 'time', 'location');
     ```

</Procedure>

[multi-node]: /timescaledb/:currentVersion:/how-to-guides/multinode-timescaledb/
[postgres-createtable]: https://www.postgresql.org/docs/current/sql-createtable.html
[space-partitions]: /timescaledb/:currentVersion:/how-to-guides/hypertables/about-hypertables#space-partitions-for-distributed-hypertables
