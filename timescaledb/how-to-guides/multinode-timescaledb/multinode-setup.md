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

If you intend to use continuous aggregates in your multi-node environment, check
the additional considerations in the [continuous aggregates][caggs] section.

## Set up multi-node on self-hosted TimescaleDB
When you have installed TimescaleDB on the access node and as many data nodes as
you require, you can set up multi-node and create a distributed hypertable.

<highlight type="note">
Before you begin, make sure you have considered what partitioning method you
want to use for your multi-node cluster. For more information about multi-node
and architecture, see the
[About multi-node section](/timescaledb/latest/how-to-guides/multinode-timescaledb/about-multinode/).
</highlight>

<procedure>

### Setting up multi-node on self-hosted TimescaleDB
1.  On the access node (AN), run this command and provide the hostname of the
    first data node (DN1) you want to add:
    ```sql
    SELECT add_data_node('dn1', 'dn1.example.com')
    ```
1.  Repeat for all other data nodes:
    ```sql
    SELECT add_data_node('dn2', 'dn2.example.com')
    SELECT add_data_node('dn3', 'dn3.example.com')
    ```
1.  On the access node, create the distributed hypertable with your chosen
    partitioning. In this example, the distributed hypertable is called
    `example`, and it is partitioned on `time` and `location`:
    ```sql
    SELECT create_distributed_hypertable('example', 'time', 'location');
    ```
1.  Insert some data into the hypertable. For example:
    ```sql
    INSERT INTO example VALUES ('2020-12-14 13:45', 1, '1.2.3.4');
    ```

</procedure>

When you have set up your multi-node installation, you can configure your
cluster. For more information, see the [configuration section][configuration].

[configuration]: /how-to-guides/multinode-timescaledb/multinode-config/
[install]: /install/latest/
[setup]: /install/latest/
[about-multi-node]: /how-to-guides/multinode-timescaledb/about-multinode/
[caggs]: timescaledb/how-to-guides/continuous-aggregates/about-continuous-aggregates#using-continuous-aggregates-in-multi-node-environment/
