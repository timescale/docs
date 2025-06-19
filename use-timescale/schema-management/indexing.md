---
title: Indexing data
excerpt: Adding an index can significantly speed up queries on your service. Learn which database indexes are created by default in TimescaleDB, and best practice for creating them manually
products: [cloud, mst, self_hosted]
keywords: [hypertables, indexes]
---

# Indexing data

You can use an index on your database to speed up read operations. You can
create an index on any combination of columns. $TIMESCALE_DB supports all table objects supported
within $PG, including data types, indexes, and triggers.

You can create an index using the `CREATE INDEX` command. For example, to create
an index that sorts first by `location`, then by `time`, in descending order:

```sql
CREATE INDEX ON conditions (location, time DESC);
```

You can run this command before or after you convert a regular $PG table
to a hypertable.

## Default indexes

Some indexes are created by default when you perform certain actions on your
database.

When you create a hypertable with a call to [`CREATE TABLE`][hypertable-create-table], a time index
is created on your data. If you want to manually create a time index, you can use this command:

```sql
CREATE INDEX ON conditions (time DESC);
```

After you create a hypertable, you can specify an optional hash partition in addition to time. For example,
`add_dimension('conditions', by_hash('location', 4))`. An additional index is created on the optional column 
and time. For example:

```sql
CREATE INDEX ON conditions (location, time DESC);
```

For more information about the order to use when declaring indexes, see the
[about indexing][about-index] section.

If you do not want to create these default indexes, you can set
`create_default_indexes` to `false` when you create a hypertable. For example:

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
  tsdb.create_default_indexes=false
);
```

<OldCreateHypertable />


## Best practices for indexing

If you have sparse data, with columns that are often NULL, you can add a clause
to the index, saying `WHERE column IS NOT NULL`. This prevents the index from
indexing NULL data, which can lead to a more compact and efficient index. For
example:

```sql
CREATE INDEX ON conditions (time DESC, humidity)
  WHERE humidity IS NOT NULL;
```

To define an index as a `UNIQUE` or `PRIMARY KEY` index, the index must include
the time column and the partitioning column, if you are using one. For example,
a unique index must include at least the `(time, location)` columns, in addition
to any other columns you want to use. Generally,
time-series data uses `UNIQUE` indexes more rarely than relational data.

If you do not want to create an index in a single transaction, you can use the
[`CREATE_INDEX`][create-index]
function. This uses a separate function to create an index on each chunk,
instead of a single transaction for the entire hypertable. This means that you
can perform other actions on the table while the index is being created, rather
than having to wait until index creation is complete.

<Highlight type="note">

You can also use the
[$PG `WITH` clause](https://www.postgresql.org/docs/current/queries-with.html)
to perform indexing transactions on an individual chunk.

</Highlight>

[create_hypertable]: /api/:currentVersion:/hypertable/create_hypertable/
[about-index]: /use-timescale/:currentVersion:/schema-management/about-indexing/
[create-index]: https://docs.tigerdata.com/api/latest/hypertable/create_index/
[hypertable-create-table]: /api/:currentVersion:/hypertable/create_table/
