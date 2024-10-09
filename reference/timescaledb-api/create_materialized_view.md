---
api_name: CREATE MATERIALIZED VIEW (Continuous Aggregate)
excerpt: Create a continuous aggregate on a hypertable or another continuous aggregate
topics: [continuous aggregates]
keywords: [continuous aggregates, create]
tags: [materialized view, hypertables]
api:
  license: community
  type: command
---

# CREATE MATERIALIZED VIEW (Continuous Aggregate) <Tag type="community">Community</Tag>

The `CREATE MATERIALIZED VIEW` statement is used to create continuous
aggregates. To learn more, see the
[continuous aggregate how-to guides][cagg-how-tos].

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
    FROM <hypertable or another continuous aggregate>
[WHERE ... ]
GROUP BY time_bucket( <const_value>, <partition_col_of_hypertable> ),
         [ optional grouping exprs>]
[HAVING ...]
```

The continuous aggregate view defaults to `WITH DATA`. This means that when the
view is created, it refreshes using all the current data in the underlying
hypertable or continuous aggregate. This occurs once when the view is created.
If you want the view to be refreshed regularly, you can use a refresh policy. If
you do not want the view to update when it is first created, use the
`WITH NO DATA` parameter. For more information, see
[`refresh_continuous_aggregate`][refresh-cagg].

Continuous aggregates have some limitations of what types of queries they can
support. For more information, see the
[continuous aggregates section][cagg-how-tos].

The settings for continuous aggregates are in the
[informational views][info-views].

## Parameters

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
|-|-|-|-|
|`timescaledb.materialized_only`|BOOLEAN|Return only materialized data when querying the continuous aggregate view|`TRUE`|
|`timescaledb.create_group_indexes`|BOOLEAN|Create indexes on the continuous aggregate for columns in its `GROUP BY` clause. Indexes are in the form `(<GROUP_BY_COLUMN>, time_bucket)`|`TRUE`|
|`timescaledb.finalized`|BOOLEAN|In TimescaleDB 2.7 and above, use the new version of continuous aggregates, which stores finalized results for aggregate functions. Supports all aggregate functions, including ones that use `FILTER`, `ORDER BY`, and `DISTINCT` clauses.|`TRUE`|

For more information, see the [real-time aggregates][real-time-aggregates] section.

## Sample usage

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

[cagg-how-tos]: /use-timescale/:currentVersion:/continuous-aggregates/
[real-time-aggregates]: /use-timescale/:currentVersion:/continuous-aggregates/real-time-aggregates/
[refresh-cagg]: /api/:currentVersion:/continuous-aggregates/refresh_continuous_aggregate/
[info-views]: /api/:currentVersion:/informational-views/
