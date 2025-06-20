---
title: Optimize time-series data in hypertables
excerpt: Hypertables are Postgres tables designed for real-time analytics. See how to create, alter, and drop a hypertable. 
products: [cloud, mst, self_hosted]
keywords: [hypertables, create]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";
import OldCreateHypertable from "versionContent/_partials/_old-api-create-hypertable.mdx";

# Optimize time-series data in hypertables

Hypertables are designed for real-time analytics, they are $PG tables that automatically partition your data by
time. Typically, you partition hypertables on columns that hold time values.
[Best practice is to use `timestamptz`][timestamps-best-practice] column type. However, you can also partition on `date`, `integer`
and `timestamp` types.

## Prerequisites

<IntegrationPrereqs />


## Create a hypertable

Create a [$HYPERTABLE][hypertables-section] for your time-series data using [CREATE TABLE][hypertable-create-table]. 
For [efficient queries][secondary-indexes] on data in the columnstore, remember to `segmentby` the column you will use 
most often to filter your data:
 
```sql
CREATE TABLE conditions (
   time        TIMESTAMPTZ       NOT NULL,
   location    TEXT              NOT NULL,
   device      TEXT              NOT NULL,
   temperature DOUBLE PRECISION  NULL,
   humidity    DOUBLE PRECISION  NULL
) WITH (
   tsdb.hypertable,
   tsdb.partition_column='time',
   tsdb.segmentby = 'device',
   tsdb.orderby = 'time DESC'
);

```
<OldCreateHypertable />

To convert an existing table with data in it, call `create_hypertable` on that table with
[`migrate_data` to `true`][api-create-hypertable-arguments]. However, if you have a lot of data, this may take a long time. 

## Optimize cooling data in the $COLUMNSTORE

As the data cools and becomes more suited for analytics, [add a columnstore policy][add_columnstore_policy] so your data
is automatically converted to the $COLUMNSTORE after a specific time interval. This columnar format enables fast
scanning and aggregation, optimizing performance for analytical workloads while also saving significant storage space.
In the $COLUMNSTORE conversion, $HYPERTABLE chunks are compressed by more than 90%, and organized for efficient,
large-scale queries. This columnar format enables fast scanning and aggregation, optimizing performance for analytical
workloads.

To optimize your data, add a $COLUMNSTORE policy:

```sql
CALL add_columnstore_policy('conditions', after => INTERVAL '1d');
```

You can also manually [convert chunks][convert_to_columnstore] in a $HYPERTABLE to the $COLUMNSTORE.

## Alter a hypertable

You can alter a hypertable, for example to add a column, by using the $PG
[`ALTER TABLE`][postgres-altertable] command. This works for both regular and
distributed hypertables.

### Add a column to a hypertable

You add a column to a hypertable using the `ALTER TABLE` command. In this
example, the hypertable is named `conditions` and the new column is named
`humidity`:

```sql
ALTER TABLE conditions
  ADD COLUMN humidity DOUBLE PRECISION NULL;
```

If the column you are adding has the default value set to `NULL`, or has no
default value, then adding a column is relatively fast. If you set the default
to a non-null value, it takes longer, because it needs to fill in this value for
all existing rows of all existing chunks.

### Rename a hypertable

You can change the name of a hypertable using the `ALTER TABLE` command. In this
example, the hypertable is called `conditions`, and is being changed to the new
name, `weather`:

```sql
ALTER TABLE conditions
  RENAME TO weather;
```

## Drop a hypertable

Drop a hypertable using a standard $PG [`DROP TABLE`][postgres-droptable]
command:

```sql
DROP TABLE weather;
```

All data chunks belonging to the hypertable are deleted.

[postgres-droptable]: https://www.postgresql.org/docs/current/sql-droptable.html



[postgres-altertable]: https://www.postgresql.org/docs/current/sql-altertable.html
[hypertable-create-table]: /api/:currentVersion:/hypertable/create_table/
[add_columnstore_policy]: /api/:currentVersion:/hypercore/add_columnstore_policy/
[install]: /getting-started/:currentVersion:/
[postgres-createtable]: https://www.postgresql.org/docs/current/sql-createtable.html
[postgresql-timestamp]: https://wiki.postgresql.org/wiki/Don't_Do_This#Don.27t_use_timestamp_.28without_time_zone.29
[data-migration]: /migrate/:currentVersion:/
[api-create-hypertable]: /api/:currentVersion:/hypertable/create_hypertable/
[api-create-hypertable-arguments]: /api/:currentVersion:/hypertable/create_hypertable/#arguments
[timestamps-best-practice]: https://wiki.postgresql.org/wiki/Don't_Do_This#Don.27t_use_timestamp_.28without_time_zone.29
[hypertables-section]: /use-timescale/:currentVersion:/hypertables/
[hypertable-create-table]: /api/:currentVersion:/hypertable/create_table/
[hypercore]: /use-timescale/:currentVersion:/hypercore/
[secondary-indexes]: /use-timescale/:currentVersion:/hypercore/secondary-indexes/
[convert_to_columnstore]: /api/:currentVersion:/hypercore/convert_to_columnstore/
