# Run Promscale with a multi-node deployment of TimescaleDB

Using Promscale to write and read data to a multi-node deployment of
TimescaleDB is straightforward. To get started, you have to follow 
[these instructions](https://docs.timescale.com/latest/getting-started/setup-multi-node-basic)
to set up a multi-node TimescaleDB cluster. Then, you point Promscale
to connect to the access node of the cluster. That's it!

Promscale will automatically connect to the cluster and set up any
table/objecte/roles that it needs. When querying Promscale data from
SQL, simply connect to the access node as well.

## Expanding the cluster

When adding nodes to a TimescaleDB cluster that is already being written to by
Promscale, you should run the `add_prom_node(node_name)` function
after running the standard `add_data_node()` function. For example:

```sql
SELECT add_data_node('example_node_name', host => 'example_host_address')
SELECT add_prom_node('example_node_name');
```

<highlight type="note">
`add_prom_node` should be run by the same database user, as the
one writing data from Promscale.
</highlight>