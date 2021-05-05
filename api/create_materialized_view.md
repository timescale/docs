## CREATE MATERIALIZED VIEW (Continuous Aggregate) <tag type="community">Community</tag> 

`CREATE MATERIALIZED VIEW` statement is used to create continuous aggregates.

The syntax is:
``` sql
CREATE MATERIALIZED VIEW <view_name> [ ( column_name [, ...] ) ]
  WITH ( timescaledb.continuous [, timescaledb.<option> = <value> ] )
  AS
    <select_query>
  [WITH [NO] DATA]
```

`<select_query>` is of the form :

```sql
SELECT <grouping_exprs>, <aggregate_functions>
    FROM <hypertable>
[WHERE ... ]
GROUP BY time_bucket( <const_value>, <partition_col_of_hypertable> ),
         [ optional grouping exprs>]
[HAVING ...]
```
Note that continuous aggregates have some limitations of what types of
queries they can support, described in more length below.  For example,
the `FROM` clause must provide only one hypertable, i.e., no joins, CTEs, views or 
subqueries are supported. The `GROUP BY` clause must include a time bucket on 
the hypertable's time column, and all aggregates must be parallelizable.

### Parameters
|Name|Type|Description|
|---|---|---|
| `<view_name>` | TEXT | Name (optionally schema-qualified) of continuous aggregate view to be created.|
| `<column_name>`| TEXT | Optional list of names to be used for columns of the view. If not given, the column names are deduced from the query.|
| `WITH` clause | TEXT | This clause specifies [options](/continuous-aggregates/create_materialized_view/#parameters) for the continuous aggregate view.|
| `<select_query>`| TEXT | A `SELECT` query that uses the specified syntax. |

#### Required `WITH` clause options 

|**Name**|||
|---|---|---|---|
|`timescaledb.continuous`|||
|**Description**|**Type**|**Default**|
|If timescaledb.continuous is not specified, then this is a regular PostgresSQL materialized view. | `BOOLEAN` ||

#### Optional `WITH` clause options 

|**Name**|||
|---|---|---|---|
|`timescaledb.materialized_only`|||
|**Description**|**Type**|**Default**|
| Return only materialized data when querying the continuous aggregate view. See more in section on [real-time aggregates][real-time-aggregates]. | `BOOLEAN` | false |
|   |   |   |
|`timescaledb.create_group_indexes`|||
|**Description**|**Type**|**Default**|
| Create indexes on the materialization table for the group by columns (specified by the `GROUP BY` clause of the `SELECT` query). | `BOOLEAN` | Indexes are created by default for every group by expression + time_bucket expression pair.|

#### Notes

- The view will be automatically refreshed (as outlined under
  [`refresh_continuous_aggregate`](/continuous-aggregates/refresh_continuous_aggregate/))
  unless `WITH NO DATA` is given (`WITH DATA` is the default).
- The `SELECT` query should be of the form specified in the syntax above, which is discussed in
  the following items.
- Only a single hypertable can be specified in the `FROM` clause of the 
  `SELECT` query. This means that including more hypertables, joins, tables, views, subqueries
  is not supported.
- The hypertable used in the `SELECT` may not have [row-level-security
  policies][postgres-rls] enabled.
-  The `GROUP BY` clause must include a time_bucket expression. The
   [`time_bucket`](/analytics/time_bucket/) expression must use the time
   dimension column of the hypertable.
- [`time_bucket_gapfill`](/analytics/time_bucket_gapfill/) is not allowed in continuous
  aggs, but may be run in a `SELECT` from the continuous aggregate view.
- In general, aggregates which can be [parallelized by
  PostgreSQL][postgres-parallel-agg] are allowed in the view
  definition, this includes most aggregates distributed with
  PostgreSQL. Aggregates with `ORDER BY`, `DISTINCT` and `FILTER`
  clauses are not permitted.
- All functions and their arguments included in `SELECT`, `GROUP BY`
  and `HAVING` clauses must be [immutable][postgres-immutable].
- The view is not allowed to be a [security barrier view][postgres-security-barrier].
- Window functions cannot be used in conjunction with continuous aggregates.

[postgres-immutable]:https://www.postgresql.org/docs/current/xfunc-volatility.html
[postgres-parallel-agg]:https://www.postgresql.org/docs/current/parallel-plans.html#PARALLEL-AGGREGATION
[postgres-rls]:https://www.postgresql.org/docs/current/ddl-rowsecurity.html
[postgres-security-barrier]:https://www.postgresql.org/docs/current/rules-privileges.html

<highlight type="tip">
 You can find the [settings for continuous aggregates](/api/latest/informational-views/continuous_aggregates/) and
[statistics](/api/latest/informational-views/job_stats/) in `timescaledb_information` views.
</highlight>

### Sample Usage 
Create a continuous aggregate view.
```sql
CREATE MATERIALIZED VIEW continuous_aggregate_view( timec, minl, sumt, sumh )
WITH (timescaledb.continuous) AS
  SELECT time_bucket('1day', timec), min(location), sum(temperature), sum(humidity)
    FROM conditions
    GROUP BY time_bucket('1day', timec)
```

Add additional continuous aggregates on top of the same raw hypertable.
```sql
CREATE MATERIALIZED VIEW continuous_aggregate_view( timec, minl, sumt, sumh )
WITH (timescaledb.continuous) AS
  SELECT time_bucket('30day', timec), min(location), sum(temperature), sum(humidity)
    FROM conditions
    GROUP BY time_bucket('30day', timec);
```

```sql
CREATE MATERIALIZED VIEW continuous_aggregate_view( timec, minl, sumt, sumh )
WITH (timescaledb.continuous) AS
  SELECT time_bucket('1h', timec), min(location), sum(temperature), sum(humidity)
    FROM conditions
    GROUP BY time_bucket('1h', timec);
```
