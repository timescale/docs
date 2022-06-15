# Troubleshooting continuous aggregates
This section contains some ideas for troubleshooting common problems experienced
with continuous aggregates.

<!---
* Keep this section in alphabetical order
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
-->

## Retention policies
If you have hypertables that use a different retention policy to your continuous
aggregates, the retention policies are applied separately.  The retention policy
on a hypertable determines how long the raw data is kept for. The retention
policy on a continuous aggregate determines how long the continuous aggregate is
kept for. For  example, if you have a hypertable with a retention policy of a
week and a continuous aggregate with a retention policy of a month, the raw
data is kept for a week, and the continuous aggregate is kept for a month.

## Insert irregular data into a continuous aggregate
Materialized views are generally used with ordered data. If you insert historic
data, or data that is not related to the current time, you need to refresh
policies and reevaluate the values that are dragging from past to present.

You can set up an after insert rule for your hypertable or upsert to trigger
something that can validate what needs to be refreshed as the data is merged.

Let's say you inserted ordered timeframes named A, B, D, and F, and you already
have a continuous aggregation looking for this data. If you now insert E, you
need to refresh E and F.  However, if you insert C we'll need to refresh C, D, E
and F.

For example:
1.  A, B, D, and F are already materialized in a view with all data.
1.  To insert C, split the data into `AB` and `DEF` subsets.
1.  `AB` are consistent and the materialized data is too; you only need to
    reuse it.
1.  Insert C, `DEF`, and refresh policies after C.

This can use a lot of resources to process, especially if you have any important
data in the past that also needs to be brought to the present.

Consider an example where you have 300 columns on a single hypertable and use,
for example, five of them in a continuous aggregation.  In this case, it could
be hard to refresh and would make more sense to isolate these columns in another
hypertable. Alternatively, you might create one hypertable per metric and
refresh them independently.

### Updates to previously materialized regions are not shown in real-time aggregates
If you have a time bucket that has already been materialized, the real-time
aggregate does not show the data that has been inserted, updated, or deleted 
into that bucket until the next `refresh_continuous_aggregate` call is executed.
The continuous aggregate is refreshed either when you manually call 
`refresh_continuous_aggregate` or when a continuous aggregate policy is executed. 
This worked example shows the expected behavior of continuous aggregates, when
real time aggregation is enabled.

Create and fill the hypertable:
```sql
CREATE TABLE conditions(
  day DATE NOT NULL,
  city text NOT NULL,
  temperature INT NOT NULL);

SELECT create_hypertable(
  'conditions', 'day',
  chunk_time_interval => INTERVAL '1 day'
);

INSERT INTO conditions (day, city, temperature) VALUES
  ('2021-06-14', 'Moscow', 26),
  ('2021-06-15', 'Moscow', 22),
  ('2021-06-16', 'Moscow', 24),
  ('2021-06-17', 'Moscow', 24),
  ('2021-06-18', 'Moscow', 27),
  ('2021-06-19', 'Moscow', 28),
  ('2021-06-20', 'Moscow', 30),
  ('2021-06-21', 'Moscow', 31),
  ('2021-06-22', 'Moscow', 34),
  ('2021-06-23', 'Moscow', 34),
  ('2021-06-24', 'Moscow', 34),
  ('2021-06-25', 'Moscow', 32),
  ('2021-06-26', 'Moscow', 32),
  ('2021-06-27', 'Moscow', 31);
```

Create a continuous aggregate but do not materialize any data. Note that real
 time aggregation is enabled by default:
```sql
CREATE MATERIALIZED VIEW conditions_summary
WITH (timescaledb.continuous) AS
SELECT city,
   time_bucket('7 days', day) AS bucket,
   MIN(temperature),
   MAX(temperature)
FROM conditions
GROUP BY city, bucket
WITH NO DATA;

The select query returns data as real time aggregates are enabled. The query on 
the continuous aggregate fetches data directly from the hypertable:
SELECT * FROM conditions_summary ORDER BY bucket;
  city  |   bucket   | min | max
--------+------------+-----+-----
 Moscow | 2021-06-14 |  22 |  30
 Moscow | 2021-06-21 |  31 |  34
 ```

Materialize data into the continuous aggregate:
```sql
CALL refresh_continuous_aggregate('conditions_summary', '2021-06-14', '2021-06-21');

The select query returns the same data, as expected, but this time the data is 
fetched from the underlying materialized table
SELECT * FROM conditions_summary ORDER BY bucket;
  city  |   bucket   | min | max
--------+------------+-----+-----
 Moscow | 2021-06-14 |  22 |  30
 Moscow | 2021-06-21 |  31 |  34
```

Update the data in the previously materialized bucket:
```sql
UPDATE conditions
SET temperature = 35
WHERE day = '2021-06-14' and city = 'Moscow';
```

The updated data is not yet visible when you query the continuous aggregate. This
is because these changes have not been materialized.( Similarly, any
INSERTs or DELETEs would also not be visible).
```sql
SELECT * FROM conditions_summary ORDER BY bucket;
  city  |   bucket   | min | max
--------+------------+-----+-----
 Moscow | 2021-06-14 |  22 |  30
 Moscow | 2021-06-21 |  31 |  34
```

Refresh the data again to update the previously materialized region:
```sql
CALL refresh_continuous_aggregate('conditions_summary', '2021-06-14', '2021-06-21');

SELECT * FROM conditions_summary ORDER BY bucket;
  city  |   bucket   | min | max
--------+------------+-----+-----
 Moscow | 2021-06-14 |  22 |  35
 Moscow | 2021-06-21 |  31 |  34
```

## Queries that work on regular tables, fail on continuous aggregates
Continuous aggregates don't work on all queries. If you are using a function
that continuous aggregates do not support, you see an error like this:
```sql
ERROR:  invalid continuous aggregate view
SQL state: 0A000
```
Continuous aggregates are supported for most aggregate functions that can be
[parallelized by PostgreSQL][postgres-parallel-agg], including the standard
aggregates like `SUM` and `AVG`. You can also use more complex expressions on
top of the aggregate functions, for example `max(temperature)-min(temperature)`.

However, aggregates using `ORDER BY` and `DISTINCT` cannot be used with
continuous aggregates since they cannot be parallelized with
PostgreSQL. TimescaleDB does not support `FILTER` or `JOIN` clauses,
or window functions in continuous aggregates.

[postgres-parallel-agg]: https://www.postgresql.org/docs/current/parallel-plans.html#PARALLEL-AGGREGATION

## Queries using locf() do not return NULL values
When you have a query that uses a last observation carried forward (locf)
function, the query carries forward NULL values by default. If you want the
function to ignore NULL values instead, you can set `treat_null_as_missing=TRUE`
as the second parameter in the query. For example:
```sql
dev=# select * FROM (select time_bucket_gapfill(4, time,-5,13), locf(avg(v)::int,treat_null_as_missing:=true) FROM (VALUES (0,0),(8,NULL)) v(time, v) WHERE time BETWEEN 0 AND 10 GROUP BY 1) i ORDER BY 1 DESC;
 time_bucket_gapfill | locf
---------------------+------
                  12 |    0
                   8 |    0
                   4 |    0
                   0 |    0
                  -4 |
                  -8 |
(6 rows)
```

## Cannot refresh compressed chunks of a continuous aggregate
Compressed chunks of a continuous aggregate can't be refreshed. This follows
from a general limitation where compressed chunks can't be updated or deleted.

If you try to refresh the compressed regions, you get this error:
```
ERROR:  cannot update/delete rows from chunk <CHUNK_NAME> as it is compressed
```

If you receive historical data and must refresh a compressed region, first
[decompress the chunk][decompression]. Then manually run
[`refresh_continuous_aggregate`][refresh_continuous_aggregate].

[decompression]: /how-to-guides/compression/decompress-chunks/
[refresh_continuous_aggregate]: /api/:currentVersion:/continuous-aggregates/refresh_continuous_aggregate/
