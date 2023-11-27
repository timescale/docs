---
title: Grow and shrink multi-node
excerpt: Add and remove data nodes from a multi-node cluster
products: [self_hosted]
keywords: [multi-node, data nodes]
tags: [add, remove]
---

import MultiNodeDeprecation from "versionContent/_partials/_multi-node-deprecation.mdx";

<MultiNodeDeprecation />

# Grow and shrink multi-node

When you are working within a multi-node environment, you might discover that
you need more or fewer data nodes in your cluster over time. You can choose how
many of the available nodes to use when creating a distributed hypertable. You
can also add and remove data nodes from your cluster, and move data between
chunks on data nodes as required to free up storage.

## See which data nodes are in use

You can check which data nodes are in use by a distributed hypertable, using
this query. In this example, our distributed hypertable is called
`conditions`:

```sql
SELECT hypertable_name, data_nodes
FROM timescaledb_information.hypertables
WHERE hypertable_name = 'conditions';
```

The result of this query looks like this:

```sql
hypertable_name |              data_nodes
-----------------+---------------------------------------
conditions      | {data_node_1,data_node_2,data_node_3}
```

## Choose how many nodes to use for a distributed hypertable

By default, when you create a distributed hypertable, it uses all available
data nodes. To restrict it to specific nodes, pass the `data_nodes` argument to
[`create_distributed_hypertable`][create_distributed_hypertable].

## Attach a new data node

When you add additional data nodes to a database, you need to add them to the
distributed hypertable so that your database can use them.

<Procedure>

### Attaching a new data node to a distributed hypertable

1.  On the access node, at the `psql` prompt, add the data node:

    ```sql
    SELECT add_data_node('node3', host => 'dn3.example.com');
    ```

1.  Attach the new data node to the distributed hypertable:

    ```sql
    SELECT attach_data_node('node3', hypertable => 'hypertable_name');
    ```

<Highlight type="important">
When you attach a new data node, the partitioning configuration of the
distributed hypertable is updated to account for the additional data node, and
the number of space partitions are automatically increased to match. You can
prevent this happening by setting the function parameter `repartition` to
`FALSE`.
</Highlight>

</Procedure>

## Move data between chunks <Tag type="experimental">Experimental</Tag>

When you attach a new data node to a distributed hypertable, you can move
existing data in your hypertable to the new node to free up storage on the
existing nodes and make better use of the added capacity.

<Highlight type="warning">
The ability to move chunks between data nodes is an experimental feature that is
under active development. We recommend that you do not use this feature in a
production environment.
</Highlight>

Move data using this query:

```sql
CALL timescaledb_experimental.move_chunk('_timescaledb_internal._dist_hyper_1_1_chunk', 'data_node_3', 'data_node_2');
```

The move operation uses a number of transactions, which means that you cannot
roll the transaction back automatically if something goes wrong. If a move
operation fails, the failure is logged with an operation ID that you can use to
clean up any state left on the involved nodes.

Clean up after a failed move using this query. In this example, the operation ID
of the failed move is `ts_copy_1_31`:

```sql
CALL timescaledb_experimental.cleanup_copy_chunk_operation('ts_copy_1_31');
```

## Remove a data node

You can also remove data nodes from an existing distributed hypertable.

<Highlight type="warning">
You cannot remove a data node that still contains data for the distributed
hypertable. Before you remove the data node, check that is has had all of its
data deleted or moved, or that you have replicated the data on to other data
nodes.
</Highlight>

Remove a data node using this query. In this example, our distributed hypertable
is called `conditions`:

```sql
SELECT detach_data_node('node1', hypertable => 'conditions');
```

[create_distributed_hypertable]: /api/:currentVersion:/distributed-hypertables/create_distributed_hypertable/
