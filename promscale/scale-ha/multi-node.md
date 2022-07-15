---
title: Run Promscale in a multi-node environment
excerpt: Scale promscale with a TimescaleDB multi-node database
product: promscale
keywords: [multi-node, scale]
---

# Run Promscale in a multi-node environment
You can use Promscale to write and read data within a TimescaleDB multi-node
environment.

To start, set up a multi-node TimescaleDB cluster, following the instructions in
the [TimescaleDB multi-node section][db-multinode]. When your multi-node cluster
is running, you can connect Promscale to the access node of the cluster.
Promscale then creates the tables, objects, and roles that it needs. You can
connect to the access node to  query Promscale SQL data.

## Expanding the cluster
When you have a TimescaleDB multi-node cluster that is being written to by
Promscale, you can add nodes to the cluster using the `add_data_node()`
function. These commands add the data node and uses the
`add_prom_node(node_name)` function to add Promscale functionality. For example:
```sql
SELECT add_data_node('example_node_name', host => 'example_host_address')
SELECT add_prom_node('example_node_name');
```

<highlight type="note">
Make sure that you run the `add_prom_node` command as the same database user as
the one writing data from Promscale.
</highlight>

[db-multinode]: /timescaledb/:currentVersion:/how-to-guides/multinode-timescaledb/multinode-setup/
