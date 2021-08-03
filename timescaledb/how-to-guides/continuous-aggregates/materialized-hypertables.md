# Materialized hypertables
Continuous aggregates take raw data from the original hypertable, aggregate it,
and store the intermediate state in a materialization hypertable. You can modify
this materialized hypertable in the same way as any other hypertable.

## Discover the name of a materialized hypertable
To change a materialized hypertable, you need to discover the name of it. To do
this, use the
[timescaledb_information.continuous_aggregates view][api-continuous-aggregates-info]).
You can then use the name to modify it in the same way as any other hypertable.

### Procedure: Discovering the name of a materialized hypertable
1.  At the `psql`prompt, query `timescaledb_information.continuous_aggregates`:
    ```sql
    SELECT view_name, <materialization_hypertable_name>
        FROM timescaledb_information.continuous_aggregates;
    ```
1.  Locate the name of the hypertable you want to adjust in the results of the
    query. The results look like this:
    ```
             view_name         |            materialization_hypertable
    ---------------------------+---------------------------------------------------
    conditions_summary_hourly | _timescaledb_internal._materialized_hypertable_30
    conditions_summary_daily  | _timescaledb_internal._materialized_hypertable_31
    (2 rows)
    ```


## Create indexes on the materialized hypertable
Materialized hypertables include composite indexes. By default, these indexes
are created on each column specified as `GROUP BY`, combined with the
`time_bucket` column. For example, if the continuous aggregate view is defined
as `GROUP BY device, bucket`, the composite index is created on `{device,
bucket}`. If you specify grouping by other columns as well, additional indexes
are also created on those columns.

You can turn this behavior off by setting `timescaledb.create_group_indexes` to
`false` when you create the view. If you want to create additional indexes, or
drop some of the default ones, you can do so by creating or dropping the
appropriate indexes on the materialization hypertable directly.


[api-continuous-aggregates-info]: /api/:currentVersion:/informational-views/continuous_aggregates/
