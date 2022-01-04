## CREATE MATERIALIZED VIEW (Continuous Aggregate) <tag type="community">Community</tag>
The `CREATE MATERIALIZED VIEW` statement is used to create continuous \
aggregates.

The syntax is:
``` sql
CREATE MATERIALIZED VIEW <view_name> [ ( column_name [, ...] ) ]
  WITH ( timescaledb.continuous [, timescaledb.<option> = <value> ] )
  AS
    <select_query>
  [WITH [NO] DATA]
```

`<select_query>` is of the form:

```sql
SELECT <grouping_exprs>, <aggregate_functions>
    FROM <hypertable>
[WHERE ... ]
GROUP BY time_bucket( <const_value>, <partition_col_of_hypertable> ),
         [ optional grouping exprs>]
[HAVING ...]
```

Continuous aggregates have some limitations of what types of queries they can
support, described in more length below.  For example, the `FROM` clause must
provide only one hypertable, and joins, CTEs, views or subqueries are not
supported. The `GROUP BY` clause must include a time bucket on the hypertable
time column, and all aggregates must be parallelizable.

The continuous aggregate view is automatically refreshed unless `WITH NO DATA` is given. This setting defaults to `WITH DATA`. For more information, see [`refresh_continuous_aggregate`][refresh-cagg].

Some important things to remember when constructing your `SELECT` query:
*   Only a single hypertable can be specified in the `FROM` clause of
    the `SELECT` query. You cannot include more hypertables, joins, tables,
    views, or subqueries.
*   The hypertable used in the `SELECT` query might not have
    [row-level-security policies][postgres-rls] enabled.
*   The `GROUP BY` clause must include a `time_bucket` expression that uses the
    time dimension of the hypertable. For more information, see the
    [`time_bucket`][time-bucket] section.
*   You cannot use [`time_bucket_gapfill`][time-bucket-gapfill] in continuous
    aggregates, but you can run them in a `SELECT` query from the continuous
    aggregate view.
*   You can usually use aggregates that are
    [parallelized by PostgreSQL][postgres-parallel-agg] in the view definition, i
    ncluding most aggregates distributed by PostgreSQL. However, the `ORDER BY`,
    `DISTINCT` and `FILTER` clauses are not supported.
*   All functions and their arguments included in `SELECT`, `GROUP BY` and
    `HAVING` clauses must be [immutable][postgres-immutable].
*   The view cannot be a [security barrier view][postgres-security-barrier].
*   You cannot use Window functions with continuous aggregates.

The settings for continuous aggregates are in the
[informational views][info-views].


### Parameters
|Name|Type|Description|
|-|-|-|
|`<view_name>`|TEXT|Name (optionally schema-qualified) of continuous aggregate view to create|
|`<column_name>`|TEXT|Optional list of names to be used for columns of the view. If not given, the column names are calculated from the query|
|`WITH` clause|TEXT|Specifies options for the continuous aggregate view|
|`<select_query>`|TEXT|A `SELECT` query that uses the specified syntax|

Required `WITH` clause options:

|Name|Type|Description|
|-|-|-|
|`timescaledb.continuous`|BOOLEAN|If `timescaledb.continuous` is not specified, this is a regular PostgresSQL materialized view|

Optional `WITH` clause options:

|Name|Type|Description|Default value|
|-|-|-|
|`timescaledb.materialized_only`|BOOLEAN|Return only materialized data when querying the continuous aggregate view.|`FALSE`|
|`timescaledb.create_group_indexes`|BOOLEAN|Create indexes on the materialization table for the group by columns specified by the `GROUP BY` clause of the `SELECT` query|Created by default for every group by expression/time_bucket expression pair|

For more information, see the [real-time aggregates][real-time-aggregates] section.

### Sample use
Create a daily continuous aggregate view:
```sql
CREATE MATERIALIZED VIEW continuous_aggregate_daily( timec, minl, sumt, sumh )
WITH (timescaledb.continuous) AS
  SELECT time_bucket('1day', timec), min(location), sum(temperature), sum(humidity)
    FROM conditions
    GROUP BY time_bucket('1day', timec)
```

Add a thirty day continuous aggregate on top of the same raw hypertable:
```sql
CREATE MATERIALIZED VIEW continuous_aggregate_thirty_day( timec, minl, sumt, sumh )
WITH (timescaledb.continuous) AS
  SELECT time_bucket('30day', timec), min(location), sum(temperature), sum(humidity)
    FROM conditions
    GROUP BY time_bucket('30day', timec);
```

Add an hourly continuous aggregate on top of the same raw hypertable:
```sql
CREATE MATERIALIZED VIEW continuous_aggregate_hourly( timec, minl, sumt, sumh )
WITH (timescaledb.continuous) AS
  SELECT time_bucket('1h', timec), min(location), sum(temperature), sum(humidity)
    FROM conditions
    GROUP BY time_bucket('1h', timec);
```

[postgres-immutable]: https://www.postgresql.org/docs/current/xfunc-volatility.html
[postgres-parallel-agg]: https://www.postgresql.org/docs/current/parallel-plans.html#PARALLEL-AGGREGATION
[postgres-rls]: https://www.postgresql.org/docs/current/ddl-rowsecurity.html
[postgres-security-barrier]: https://www.postgresql.org/docs/current/rules-privileges.html
[real-time-aggregates]: /timescaledb/:currentVersion:/how-to-guides/continuous-aggregates/real-time-aggregates/
[refresh-cagg]: /continuous-aggregates/refresh_continuous_aggregate/
[time-bucket]: /hyperfunctions/time_bucket/
[time-bucket-gapfill]: /hyperfunctions/gapfilling-interpolation/time_bucket_gapfill/
[info-views]: /informational-views/
