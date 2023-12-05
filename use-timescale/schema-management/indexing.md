---
title: Indexing data
excerpt: How to create indexes on hypertables
products: [cloud, mst, self_hosted]
keywords: [hypertables, indexes]
---

# Indexing data

You can use an index on your database to speed up read operations. You can
create an index on any combination of columns, as long as you include the `time`
column, for time-series data. Timescale supports all table objects supported
within PostgreSQL, including data types, indexes, and triggers.

You can create an index using the `CREATE INDEX` command. For example, to create
an index that sorts first by `location`, then by `time`, in descending order:

```sql
CREATE INDEX ON conditions (location, time DESC);
```

You can run this command before or after you convert a regular PostgreSQL table
to a hypertable.

## Default indexes

Some indexes are created by default when you perform certain actions on your
database.

When you create a hypertable with the
[`create_hypertable`][create_hypertable] command, a time index
is created on your data. If you want to manually create a time index, you can
use this command:

```sql
CREATE INDEX ON conditions (time DESC);
```

When you create a hypertable with the `create_hypertable` command, and you
specify an optional hash partition in addition to time, such as a `location`
column, an additional index is created on the optional column and time. For
example:

```sql
CREATE INDEX ON conditions (location, time DESC);
```

For more information about the order to use when declaring indexes, see the
[about indexing][about-index] section.

If you do not want to create these default indexes, you can set
`create_default_indexes` to `false` when you run the `create_hypertable` command.
For example:

```sql
SELECT create_hypertable('conditions', by_range('time'))
  CREATE_DEFAULT_INDEXES false;
```

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
[PostgreSQL `WITH` clause](https://www.postgresql.org/docs/current/queries-with.html)
to perform indexing transactions on an individual chunk.
</Highlight>

[create_hypertable]: /api/:currentVersion:/hypertable/create_hypertable/
[about-index]: /use-timescale/:currentVersion:/schema-management/about-indexing/
[create-index]: https://docs.timescale.com/api/latest/hypertable/create_index/
