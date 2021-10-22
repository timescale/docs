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

## Best practices for partitioning

     Like a regular hypertable, a distributed hypertable needs to be
     partitioned along a "time" dimension (e.g., a `timestamptz`
     column). However, for best performance with most distributed
     workloads, we recommend multi-dimensional partitioning with an
     additional "space" dimension that consistently partitions the data
     over the data nodes, similar to traditional [sharding][sharding].

     If your data set has a column called something similar to
     `customerID`, `deviceID`, or `location` (as in the example above), and
     it figures frequently in the `GROUP BY` clause of queries, then it is
     likely a good candidate column for space partitioning. For instance, a
     query like the following one would work well on the example
     distributed hypertable above:

     ```sql
     SELECT time_bucket('1 hour', time) AS hour, location, avg(temperature)
     FROM conditions
     GROUP BY hour, location
     ORDER BY hour, location
     LIMIT 100;
     ```

     as this query would execute in parallel on all data nodes. A query
     that would not make the best use of space partitioning, however, would
     be:

     ```sql
     SELECT time_bucket('1 hour', time) AS hour, avg(temperature)
     FROM conditions
     WHERE location = 'office_1'
     GROUP BY hour
     ORDER BY hour
     LIMIT 100;
     ```

     as this query would only involve a single data node. Still, there are
     other factors to consider as well. For instance, if the latter example
     query is executed concurrently by many different client sessions, each
     filtering on a different location, then that would also spread the
     load evenly across the distributed hypertable.

     Inserts also benefit from space partitioning; the additional space
     dimension makes it more likely that a multi-row insert uniformly
     spreads across the data nodes, leading to increased insert
     performance. In contrast, with a single time dimension it is likely
     that in-order inserts write to only one data node and chunk at a
     time. Chunks would then be created on data nodes in round-robin
     fashion.



[configuration]: /how-to-guides/multinode-timescaledb/multinode-config/
[install]: /how-to-guides/install-timescaledb
[setup]: /how-to-guides/install-timescaledb/post-install-setup
[about-multi-node]: /how-to-guides/multinode-timescaledb/about-multinode/
