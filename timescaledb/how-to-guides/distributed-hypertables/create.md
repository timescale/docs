# Creating a Distributed Hypertable

Creating a distributed hypertable is very similar to creating a
regular hypertable. The main difference is that you must use the
function
[`create_distributed_hypertable`][create_distributed_hypertable]
instead of the regular [`create_hypertable`][create_hypertable].

```sql
CREATE TABLE conditions (
  time        TIMESTAMPTZ       NOT NULL,
  location    TEXT              NOT NULL,
  temperature DOUBLE PRECISION  NULL,
  humidity    DOUBLE PRECISION  NULL
);

SELECT create_distributed_hypertable('conditions', 'time', 'location');
```

<highlight type="warning">
If there are no data nodes configured for the database, you
will get an error when executing `create_distributed_hypertable` and
the distributed hypertable will not be created. Please review the
section on [setting up multi-node][getting-started-multi-node]
for information on how to add data nodes.
</highlight>

This creates a multi-dimensional distributed hypertable across all
data nodes, partitioned along `time` and `location`. With the given
partitioning configuration, each data node will be responsible for a
specific subset of the data based on the value of `location`, allowing
concurrent and parallel execution of a query across the data nodes.

You can now insert data into the distributed hypertable and the data
will automatically be routed to the correct data node.


[getting-started-multi-node]: /how-to-guides/multi-node-setup/
[create_distributed_hypertable]: /api/:currentVersion:/distributed-hypertables/create_distributed_hypertable
[create_hypertable]: /api/:currentVersion:/hypertable/create_hypertable
