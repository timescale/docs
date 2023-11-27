---
title: Use triggers on distributed hypertables
excerpt: How to set up triggers on a distributed hypertable
products: [self_hosted]
keywords: [distributed hypertables, triggers, multi-node]
---

import MultiNodeDeprecation from "versionContent/_partials/_multi-node-deprecation.mdx";

<MultiNodeDeprecation />

# Use triggers on distributed hypertables

Triggers on distributed hypertables work in much the same way as triggers on
standard hypertables, and have the same limitations. But there are some
differences due to the data being distributed across multiple nodes:

*   Row-level triggers fire on the data node where the row is inserted. The
    triggers must fire where the data is stored, because `BEFORE` and `AFTER`
    row triggers need access to the stored data. The chunks on the access node
    do not contain any data, so they have no triggers.
*   Statement-level triggers fire once on each affected node, including the
    access node. For example, if a distributed hypertable includes 3 data nodes,
    inserting 2 rows of data executes a statement-level trigger on the access
    node and either 1 or 2 data nodes, depending on whether the rows go to the
    same or different nodes.
*   A replication factor greater than 1 further causes
    the trigger to fire on multiple nodes. Each replica node fires the trigger.

## Create a trigger on a distributed hypertable

Create a trigger on a distributed hypertable by using [`CREATE
TRIGGER`][create-trigger] as usual. The trigger, and the function it executes,
is automatically created on each data node. If the trigger function references
any other functions or objects, they need to be present on all nodes before you
create the trigger.

<Procedure>

### Creating a trigger on a distributed hypertable

1.  If your trigger needs to reference another function or object, use
    [`distributed_exec`][distributed_exec] to create the function or object on
    all nodes.
1.  Create the trigger function on the access node. This example creates a dummy
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

1.  Create the trigger itself on the access node. This example causes the
    trigger to fire whenever a row is inserted into the hypertable `hyper`. Note
    that you don't need to manually create the trigger on the data nodes. This is
    done automatically for you.

    ```sql
    CREATE TRIGGER my_trigger
    AFTER INSERT ON hyper
    FOR EACH ROW
    EXECUTE FUNCTION my_trigger_func();
    ```

</Procedure>

## Avoid processing a trigger multiple times

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

[create-trigger]: https://www.postgresql.org/docs/current/sql-createtrigger.html
[distributed_exec]: /api/:currentVersion:/distributed-hypertables/distributed_exec/
