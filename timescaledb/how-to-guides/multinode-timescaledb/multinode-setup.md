# Set up multi-node on self-hosted TimescaleDB
To set up multi-node on a self-hosted TimescaleDB instance, you need:
*   A PostgreSQL instance to act as an access node (AN)
*   One or more PostgreSQL instances to act as data nodes (DN)
*   TimescaleDB [installed][install] and [set up][setup] on all nodes
*   Access to a superuser role, such as `postgres`, on all nodes

The access and data nodes must begin as individual TimescaleDB instances.
They should be hosts with a running PostgreSQL server and a loaded TimescaleDB
extension. For more information about installing self-hosted TimescaleDB
instances, see the [installation instructions][install].

The multi-node TimescaleDB architecture consists of an access node (AN) which
stores metadata for the distributed hypertable and performs query planning
across the cluster, and a set of data nodes (DNs) which store subsets of the
distributed hypertable dataset and execute queries locally. For more information
about the multi-node architecture, see [about multi-node][about-multi-node].

## Set up multi-node on self-hosted TimescaleDB
When you have installed TimescaleDB on the access node and as many data nodes as
you require, you can set up multi-node and create a distributed hypertable.

<procedure>

### Setting up multi-node on self-hosted TimescaleDB
1.  On the access node (AN), run this command and provide the hostname of the
    first data node (DN1) you want to add:
    ```sql
    SELECT add_data_node(dn1.example.com)
    ```
1.  Repeat for all other data nodes:
    ```sql
    SELECT add_data_node(dn2.example.com)
    SELECT add_data_node(dn3.example.com)
    ```
1.  On the access node, create the distributed hypertable partitioned on time
    and hostname. In this example, the distributed hypertable is called
    `example`:
    ```sql
    SELECT create_distributed_hypertable('example', 'time', 'hostname');
    ```
1.  Insert some data into the hypertable. For example:
    ```sql
    INSERT INTO example VALUES ('2020-12-14 13:45', 1, '1.2.3.4');
    ```

<highlight type="note">
The distributed hypertable spreads data across the data nodes according to the
`hostname` key. The data is then further partitioned by time on each data node.
</highlight>

</procedure>

When you have set up your multi-node installation, you can configure your
cluster. For more information, see the [configuration section][configuration].


[configuration]: /how-to-guides/multinode-timescaledb/multinode-config/
[install]: /how-to-guides/install-timescaledb
[setup]: /how-to-guides/install-timescaledb/post-install-setup
[about-multi-node]: /how-to-guides/multinode-timescaledb/about-multinode/
