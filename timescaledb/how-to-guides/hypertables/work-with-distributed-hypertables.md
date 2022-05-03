# Work with distributed hypertables
In many ways, you work with distributed hypertables just as you'd work with
regular hypertables. But the architecture of distributed hypertables, where the
access node pushes work down to the data nodes, introduces some nuances.

This section covers:
*   [Inserting data into a distributed hypertable][insert]
*   [Querying a distributed hpyertable][query]
*   [Altering a distributed hypertable][privileges]
*   [Handling foreign keys in a distributed hypertable][foreign-key]
*   [Creating triggers on a distributed hypertable][triggers]
*   [Replicating a distributed hypertable][replicate]

## Insert data into a distributed hypertable
You can insert data into a distributed hypertable with an `INSERT` statement.
The syntax looks the same as for a regular hypertable or PostgreSQL table. For
example:
```sql
INSERT INTO conditions(time, location, temperature, humidity)
  VALUES (NOW(), 'office', 70.0, 50.0);
```

### Optimize data insertion
You can optimize data insertion for the architecture of distributed hypertables.

#### Insert data in batches
Distributed hypertables have higher network load, since they must push inserted
data down to the data nodes. Reduce load by batching your `INSERT` statements
over many rows of data, instead of performing each insertion as a separate
transaction.

The access node first splits the batched data into smaller batches by
determining which data node each row should belong to. It then writes each batch
to the correct data node.

#### Optimize insert batch size
When inserting to a distributed hypertable, the access node tries to convert
`INSERT` statements into more efficient [`COPY`][postgresql-copy] operations
between the access and data nodes. But this doesn't work if:
*   The `INSERT` statement has a `RETURNING` clause _and_
*   The hypertable has triggers that could alter the returned data

In this case, the planner uses a multi-row prepared statement to insert into
each data node. It splits the original insert statement across these
sub-statements. You can view the plan by running an
[`EXPLAIN`][postgresql-explain] on your `INSERT` statement.

In the prepared statement, the access node can buffer a number of rows before
flushing them to the data node. By default, the number is 1000. You can optimize
this by changing the `timescaledb.max_insert_batch_size` setting, for example to
reduce the number of separate batches that must be sent.

The maximum batch size has a ceiling. This is equal to the maximum number of
parameters allowed in a prepared statement (currently 32,767) divided by the
number of columns in each row. For example, if you have a distributed hypertable
with 10 columns, the highest you can set the batch size is 3276.

For more information on changing `timescaledb.max_insert_batch_size`, see the
section on [TimescaleDB configuration][config].

#### Use a copy statement instead
[`COPY`][postgresql-copy] can perform better than `INSERT` on a distributed
hypertable. But it doesn't support some features, such as conflict handling
using the `ON CONFLICT` clause.

To copy from a file to your hypertable, run:
```sql
COPY <HYPERTABLE> FROM '<FILE_PATH>';
```

When doing a [`COPY`][postgresql-copy], the access node switches each data node
to copy mode. It then streams each row to the correct data node.

## Query a distributed hypertable
You can query a distributed hypertable just as you would query a regular
hypertable or PostgreSQL table. Queries perform best when the access node can
push transactions down to the data nodes.

To ensure that the access node can push down transactions, check that the
[`enable_partitionwise_aggregate`][enable_partitionwise_aggregate] setting is
set to `on` for the access node. By default, it is `off`.

If you want to use continuous aggregates on your distributed hypertable, see the
[continuous aggregates][caggs] section for more information.

## Alter a distributed hypertable
When you alter a distributed hypertable, or set privileges on it, the commands
are applied across all data nodes. For more information, see the section on
[multi-node administration][multi-node-admin].

## Handle foreign keys in a distributed hypertable
Tables and values referenced by a distributed hypertable must be present on the
access node and all data nodes. To create a foreign key from a distributed
hypertable to another table, first create the table on the access node. Then use
[`distributed_exec`][distributed_exec] to create the table on all data nodes and
update it with the correct data. You can then reference the table in a foreign
key from a distributed hypertable.

## Use triggers on distributed hypertables
Triggers on distributed hypertables work in much the same way as triggers on
regular hypertables. They have the same limitations. But there are some
differences due to the data being distributed across multiple nodes:

*	Row-level triggers fire on the data node where the row is inserted. The
	triggers must fire where the data is stored, because `BEFORE` and `AFTER`
	row triggers need access to the stored data. The chunks on the access node
	do not contain any data, so they have no triggers.

*	Statement-level triggers fire once on each affected node, including the
    access node. For example, if a distributed hypertable includes 3 data nodes,
    inserting 2 rows of data executes a statement-level trigger on the access
    node and either 1 or 2 data nodes, depending on whether the rows go to the
    same or different nodes.
	
*	A replication factor greater than 1 further causes
    the trigger to fire on multiple nodes. Each replica node fires the trigger.

### Create a trigger on a distributed hypertable
Create a trigger on a distributed hypertable by using [`CREATE
TRIGGER`][create-trigger] as usual. The trigger, and the function it executes,
is automatically created on each data node. If the trigger function references
any other functions or objects, they need to be present on all nodes before you
create the trigger.

<procedure>

#### Creating a trigger on a distributed hypertable

1.	If your trigger needs to reference another function or object, use
	[`distributed_exec`][distributed_exec] to create the function or object on
	all nodes.
1.	Create the trigger function on the access node. This example creates a dummy
	trigger that raises the notice 'trigger fired':
	```sql
	CREATE OR REPLACE FUNCTION my_trigger_func()
		RETURNS TRIGGER LANGUAGE PLPGSQL AS
	$BODY$
	BEGIN
		RAISE NOTICE 'trigger fired';
		RETURN NEW;
	END
	$BODY$;
	```
1.	Create the trigger itself on the access node. This example causes the
	trigger to fire whenever a row is inserted into the hypertable `hyper`. Note
	that you don't need to manually create the trigger on the data nodes. This is
	done automatically for you.
	```sql
	CREATE TRIGGER my_trigger
		AFTER INSERT ON hyper
		FOR EACH ROW
		EXECUTE FUNCTION my_trigger_func();
	```

</procedure>

### Avoid processing a trigger multiple times
If you have a statement-level trigger, or a replication factor greater than 1,
the trigger fires multiple times. To avoid repetitive firing, you can set the
trigger function to check which data node it is executing on.

For example, write a trigger function that raises a different notice on the
access node compared to a data node:
```sql
CREATE OR REPLACE FUNCTION my_trigger_func()
    RETURNS TRIGGER LANGUAGE PLPGSQL AS
$BODY$
DECLARE
    is_access_node boolean;
BEGIN
    SELECT is_distributed INTO is_access_node
    FROM timescaledb_information.hypertables
    WHERE hypertable_name = <TABLE_NAME>
    AND hypertable_schema = <TABLE_SCHEMA>;

    IF is_access_node THEN
       RAISE NOTICE 'trigger fired on the access node';
    ELSE
       RAISE NOTICE 'trigger fired on a data node';
    END IF;

    RETURN NEW;
END
$BODY$;
```

## Replicate a distributed hypertable
Replicate a distributed hypertable by configuring it to write each chunk to
multiple data nodes. This protects the hypertable against data node failures.
You can use it as an alternative to achieve high availability, instead of
replicating data nodes with streaming replication.

To learn more about high availability and set up replication, see the
[high-availability section][multi-node-ha].

[caggs]: /how-to-guides/continuous-aggregates/
[config]: /how-to-guides/configuration/timescaledb-config/#distributed-hypertables
[create-trigger]: https://www.postgresql.org/docs/current/sql-createtrigger.html
[distributed_exec]: /api/:currentVersion:/distributed-hypertables/distributed_exec/#distributed-exec
[enable_partitionwise_aggregate]: https://www.postgresql.org/docs/current/runtime-config-query.html#RUNTIME-CONFIG-QUERY-ENABLE
[insert]: #insert-data-into-a-distributed-hypertable
[foreign-key]: #handle-foreign-keys-in-a-distributed-hypertable
[multi-node-admin]: /how-to-guides/multinode-timescaledb/multinode-administration/
[multi-node-ha]: /how-to-guides/multinode-timescaledb/multinode-ha/
[postgresql-copy]: https://www.postgresql.org/docs/14/sql-copy.html
[postgresql-explain]: https://www.postgresql.org/docs/14/sql-explain.html
[privileges]: #alter-a-distributed-hypertable
[replicate]: #replicate-a-distributed-hypertable
[query]: #query-a-distributed-hypertable
[triggers]: #use-triggers-on-distributed-hypertables 
