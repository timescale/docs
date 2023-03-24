---
title: Create an index on a continuous aggregate
excerpt: How to create and drop indexes on a continuous aggregate
products: [cloud, mst, self_hosted]
keywords: [continuous aggregates, indexes]
---

# Create an index on a continuous aggregate

By default, some indexes are automatically created when you create a continuous
aggregate. You can change this behavior. You can also manually create and drop
indexes.

## Automatically created indexes

When you create a continuous aggregate, an index is automatically created for
each `GROUP BY` column. The index is a composite index, combining the `GROUP BY`
column with the `time_bucket` column.

For example, if you define a continuous aggregate view with `GROUP BY device,
location, bucket`, two composite indexes are created: one on `{device, bucket}`
and one on `{location, bucket}`.

### Turn off automatic index creation

To turn off automatic index creation, set `timescaledb.create_group_indexes` to
`false` when you create the continuous aggregate.

For example:

```sql
CREATE MATERIALIZED VIEW conditions_daily
  WITH (timescaledb.continuous, timescaledb.create_group_indexes=false)
  AS
  ...
```

## Manually create and drop indexes

You can use a regular PostgreSQL statement to create or drop an index on a
continuous aggregate.

For example, to create an index on `avg_temp` for a materialized hypertable
named `weather_daily`:

```sql
CREATE INDEX avg_temp_idx ON weather_daily (avg_temp);
```

Indexes are created under the `_timescaledb_internal` schema, where the
continuous aggregate data is stored. To drop the index, specify the schema. For
example, to drop the index `avg_temp_idx`, run:

```sql
DROP INDEX _timescaledb_internal.avg_temp_idx
```

### Limitations on created indexes

In Timescale&nbsp;2.7 and later, you can create an index on any column in the
materialized view. This includes aggregated columns, such as those storing sums
and averages. In earlier versions of TimescaleDB, you can't create an index on
an aggregated column.

You can't create unique indexes on a continuous aggregate, in any of the
Timescale versions.
