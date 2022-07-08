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
You can manually create and drop indexes. To do so, you need to know the name of
your materialized hypertable. To find the name, see the instructions in the
[managing materialized hypertables][materialized-hypertable-name] section.

<highlight type="note">
The name you give when you run `CREATE MATERIALIZED VIEW` is the view name. The
continuous aggregate's data is stored in a materialized hypertable, which is
automatically created and named.
</highlight>

You can then use a regular PostgreSQL statement to create or drop an index on
the hypertable. For example, to create an index on `avg_temp` for a materialized
hypertable named `_timescaledb_internal._materialized_hypertable_2`:
```sql
CREATE INDEX avg_temp_idx ON _timescaledb_internal._materialized_hypertable_2 (avg_temp);
```

### Limitations on created indexes
In TimescaleDB 2.7 and above, you can create an index on any column in the
materialized view. This includes aggregated columns, such as those storing sums
and averages. In earlier versions of TimescaleDB, you can't create an index on
an aggregated column.

[materialized-hypertable-name]: /how-to-guides/continuous-aggregates/materialized-hypertables/#discover-the-name-of-a-materialized-hypertable
