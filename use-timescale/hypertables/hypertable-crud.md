---
title: Optimize time-series data in hypertables
excerpt: Hypertables are Postgres tables designed for real-time analytics. See how to create, alter, and drop a hypertable. 
products: [cloud, mst, self_hosted]
keywords: [hypertables, create]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";
import HypercoreDirectCompress from "versionContent/_partials/_hypercore-direct-compress.mdx";
import CreateHypertablePolicyNote from "versionContent/_partials/_create-hypertable-columnstore-policy-note.mdx";

# Optimize time-series data in hypertables

$HYPERTABLE_CAP are designed for real-time analytics, they are $PG tables that automatically partition your data by
time. Typically, you partition $HYPERTABLE on columns that hold time values.
[Best practice is to use `timestamptz`][timestamps-best-practice] column type. However, you can also partition on 
`date`, `integer`, `timestamp` and [UUIDv7][uuidv7_functions] types.

## Prerequisites

<IntegrationPrereqs />


## Create a hypertable

Create a [$HYPERTABLE][hypertables-section] for your time-series data using [CREATE TABLE][hypertable-create-table]. 
For [efficient queries][secondary-indexes], remember to `segmentby` the column you will use most often to filter your 
data:
 
```sql
CREATE TABLE conditions (
   time        TIMESTAMPTZ       NOT NULL,
   location    TEXT              NOT NULL,
   device      TEXT              NOT NULL,
   temperature DOUBLE PRECISION  NULL,
   humidity    DOUBLE PRECISION  NULL
) WITH (
   tsdb.hypertable,
   tsdb.segmentby = 'device',
   tsdb.orderby = 'time DESC'
);

```

<CreateHypertablePolicyNote />

To convert an existing table with data in it, call `create_hypertable` on that table with
[`migrate_data` to `true`][api-create-hypertable-arguments]. However, if you have a lot of data, this may take a long time.

## Speed up data ingestion
 
<HypercoreDirectCompress />  

## Alter a hypertable

You can alter a $HYPERTABLE, for example to add a column, by using the $PG
[`ALTER TABLE`][postgres-altertable] command. Some operations are not supported for $HYPERTABLE with $COLUMNSTORE enabled. See [Altering $HYPERTABLEs with $COLUMNSTORE enabled][alter-schema].

### Add a column to a hypertable

You add a column to a $HYPERTABLE using the `ALTER TABLE` command. In this
example, the $HYPERTABLE is named `conditions` and the new column is named
`humidity`:

```sql
ALTER TABLE conditions
  ADD COLUMN humidity DOUBLE PRECISION NULL;
```

If the column you are adding has the default value set to `NULL`, or has no
default value, then adding a column is relatively fast. If you set the default
to a non-null value, it takes longer, because it needs to fill in this value for
all existing rows of all existing $CHUNKs.

### Rename a hypertable

You can change the name of a $HYPERTABLE using the `ALTER TABLE` command. In this
example, the $HYPERTABLE is called `conditions`, and is being changed to the new
name, `weather`:

```sql
ALTER TABLE conditions
  RENAME TO weather;
```

### Change a column data type

You can change the data type of a column in a $HYPERTABLE using the `ALTER TABLE`
command. In this example, the `temperature` column data type is changed from `DOUBLE PRECISION`
to `NUMERIC`:

```sql
ALTER TABLE conditions
  ALTER COLUMN temperature TYPE NUMERIC;
```

The following restrictions apply:

- You cannot change the type of `segmentby` columns.
- For time dimension columns, you can only change to `TIMESTAMPTZ`, `TIMESTAMP`, `DATE`,
  `INTEGER` (smallint, integer, or bigint), or `UUID` (UUIDv7 only).
- You cannot change the type of columns with custom partitioning functions.
- You cannot change the type of columns for $HYPERTABLEs with $COLUMNSTORE enabled. See [Altering $HYPERTABLEs with $COLUMNSTORE enabled][alter-schema] for how to do it instead. 
- For columns with statistics enabled, you can only change to integer or timestamp types.
  To change to other types, first disable statistics using `disable_column_stats`.

### Drop a column

You can drop a column from a $HYPERTABLE using the `ALTER TABLE` command. In this
example, the `humidity` column is dropped from the `conditions` $HYPERTABLE:

```sql
ALTER TABLE conditions
  DROP COLUMN humidity;
```

You cannot drop partitioning columns.

## Drop a hypertable

Drop a $HYPERTABLE using a standard $PG [`DROP TABLE`][postgres-droptable]
command:

```sql
DROP TABLE weather;
```

All data $CHUNKs belonging to the $HYPERTABLE are deleted.

[postgres-droptable]: https://www.postgresql.org/docs/current/sql-droptable.html
[postgres-altertable]: https://www.postgresql.org/docs/current/sql-altertable.html
[hypertable-create-table]: /api/:currentVersion:/hypertable/create_table/
[install]: /getting-started/:currentVersion:/
[postgres-createtable]: https://www.postgresql.org/docs/current/sql-createtable.html
[postgresql-timestamp]: https://wiki.postgresql.org/wiki/Don't_Do_This#Don.27t_use_timestamp_.28without_time_zone.29
[data-migration]: /migrate/:currentVersion:/
[api-create-hypertable]: /api/:currentVersion:/hypertable/create_hypertable/
[api-create-hypertable-arguments]: /api/:currentVersion:/hypertable/create_hypertable/#arguments
[hypertables-section]: /use-timescale/:currentVersion:/hypertables/
[hypercore]: /use-timescale/:currentVersion:/hypercore/
[secondary-indexes]: /use-timescale/:currentVersion:/hypercore/secondary-indexes/
[timestamps-best-practice]: https://wiki.postgresql.org/wiki/Don't_Do_This#Don.27t_use_timestamp_.28without_time_zone.29
[uuidv7_functions]: /api/:currentVersion:/uuid-functions/
[alter-schema]: /use-timescale/:currentVersion:/schema-management/alter/#altering-hypertables-with-columnstore-enabled