# Run Promscale in a multi-node environment
You can use Promscale to write and read data within a TimescaleDB multi-node environment.

To get started, follow
[the multi-node instructions](https://docs.timescale.com/latest/getting-started/setup-multi-node-basic) to set up a multi-node TimescaleDB cluster. When you have your
multi-node environment set up, you can point Promscale to connect to the access
node of the cluster.  Promscale automatically connects to the cluster and sets
up any tables, objects, and roles that it needs. To query Promscale data from
SQL, make sure you connect to the access node.

## Expanding the cluster
You can add nodes to a TimescaleDB cluster that is being written to by
Promscale. Do this by running the `add_data_node()` function to add the data
node, then use the `add_prom_node(node_name)` function to add the Promscale
functionality. For example:
```sql
SELECT add_data_node('example_node_name', host => 'example_host_address')
SELECT add_prom_node('example_node_name');
```

<highlight type="note">
Make sure that you run the `add_prom_node` command as the same database user as
the one writing data from Promscale.
</highlight>
