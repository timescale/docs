---
title: Create distributed hypertables
excerpt: Sunsetted v2.14.x. Create a distributed hypertable in a self-hosted multi-node TimescaleDB instance
keywords: [distributed hypertables, multi-node, create]
seo:
  robots: noindex
---

import MultiNodeDeprecation from "versionContent/_partials/_multi-node-deprecation.mdx";

<MultiNodeDeprecation />

# Create distributed hypertables

If you have a [multi-node environment][multi-node], you can create a distributed
hypertable across your data nodes. First create a standard $PG table, and
then convert it into a distributed hypertable.

<Highlight type="important">

You need to set up your multi-node cluster before creating a distributed
hypertable. To set up multi-node, see the
[multi-node section][multi-node-section].

</Highlight>

<Procedure>

### Creating a distributed hypertable

1.  On the access node of your multi-node cluster, create a standard
    [$PG table][postgres-createtable]:

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
    space-partitioning parameter.

     ```sql
     SELECT create_distributed_hypertable('conditions', 'time', 'location');
     ```

</Procedure>

[multi-node-section]: /self-hosted/:currentVersion:/multinode-timescaledb/
[multi-node]: /self-hosted/:currentVersion:/multinode-timescaledb/
[postgres-createtable]: https://www.postgresql.org/docs/current/sql-createtable.html
