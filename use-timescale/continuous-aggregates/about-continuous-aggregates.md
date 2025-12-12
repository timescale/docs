---
title: About continuous aggregates
excerpt: A TimescaleDB continuous aggregate combines your data into analytic summaries and is refreshed in the background when new data is added. Learn how continuous aggregates work and how to use them
products: [cloud, mst, self_hosted]
keywords: [continuous aggregates]
---

import CaggsFunctionSupport from "versionContent/_partials/_caggs-function-support.mdx";
import CaggsIntro from "versionContent/_partials/_caggs-intro.mdx";
import CaggsTypes from "versionContent/_partials/_caggs-types.mdx";
import CreateHypertablePolicyNote from "versionContent/_partials/_create-hypertable-columnstore-policy-note.mdx";

# About continuous aggregates

<CaggsIntro />

## Types of aggregation

<CaggsTypes />

## Continuous aggregates on continuous aggregates

You can create a continuous aggregate on top of another continuous aggregate.
This allows you to summarize data at different granularity. For example, you
might have a raw hypertable that contains second-by-second data. Create a
continuous aggregate on the hypertable to calculate hourly data. To calculate
daily data, create a continuous aggregate on top of your hourly continuous
aggregate.

For more information, see the documentation about
[continuous aggregates on continuous aggregates][hierarchical-caggs].

## Continuous aggregates with a `JOIN` clause

Continuous aggregates support the following JOIN features: 

| Feature | TimescaleDB < 2.10.x | TimescaleDB <= 2.15.x | TimescaleDB >= 2.16.x| 
|-|-|-|-|
|INNER JOIN|&#10060;|&#9989;|&#9989;|
|LEFT JOIN|&#10060;|&#10060;|&#9989;|
|LATERAL JOIN|&#10060;|&#10060;|&#9989;|
|Joins between **ONE** hypertable and **ONE** standard $PG table|&#10060;|&#9989;|&#9989;|
|Joins between **ONE** hypertable and **MANY** standard $PG tables|&#10060;|&#10060;|&#9989;|
|Join conditions must be equality conditions, and there can only be **ONE** `JOIN` condition|&#10060;|&#9989;|&#9989;|
|Any join conditions|&#10060;|&#10060;|&#9989;|


JOINS in TimescaleDB must meet the following conditions:

*   Only the changes to the hypertable are tracked, and they are updated in the
    continuous aggregate when it is refreshed. Changes to standard
    $PG table are not tracked.
*   You can use an `INNER`, `LEFT`, and `LATERAL` joins; no other join type is supported.
*   Joins on the materialized hypertable of a continuous aggregate are not supported.
*   Hierarchical continuous aggregates can be created on top of a continuous
    aggregate with a `JOIN` clause, but cannot themselves have a `JOIN` clause.

### JOIN examples

Given the following schema:

```sql
CREATE TABLE locations (
  id TEXT PRIMARY KEY,
  name TEXT
);

CREATE TABLE devices (
  id SERIAL PRIMARY KEY,
  location_id TEXT,
  name TEXT
);

CREATE TABLE conditions (
  "time" TIMESTAMPTZ,
  device_id INTEGER,
  temperature FLOAT8
) WITH (
  tsdb.hypertable
);
```

<CreateHypertablePolicyNote />


See the following `JOIN` examples on continuous aggregates:

- `INNER JOIN` on a single equality condition, using the `ON` clause:

    ```sql
    CREATE MATERIALIZED VIEW conditions_by_day WITH (timescaledb.continuous) AS
    SELECT time_bucket('1 day', time) AS bucket, devices.name, MIN(temperature), MAX(temperature)
    FROM conditions
    JOIN devices ON devices.id = conditions.device_id
    GROUP BY bucket, devices.name
    WITH NO DATA;
    ``` 

- `INNER JOIN` on a single equality condition, using the `ON` clause, with a further condition added in the `WHERE` clause:

    ```sql
    CREATE MATERIALIZED VIEW conditions_by_day WITH (timescaledb.continuous) AS
    SELECT time_bucket('1 day', time) AS bucket, devices.name, MIN(temperature), MAX(temperature)
    FROM conditions
    JOIN devices ON devices.id = conditions.device_id
    WHERE devices.location_id = 'location123'
    GROUP BY bucket, devices.name
    WITH NO DATA;
    ```

- `INNER JOIN` on a single equality condition specified in `WHERE` clause:

    ```sql
    CREATE MATERIALIZED VIEW conditions_by_day WITH (timescaledb.continuous) AS
    SELECT time_bucket('1 day', time) AS bucket, devices.name, MIN(temperature), MAX(temperature)
    FROM conditions, devices
    WHERE devices.id = conditions.device_id
    GROUP BY bucket, devices.name
    WITH NO DATA;
    ```

- `INNER JOIN` on multiple equality conditions:

    ```sql
    CREATE MATERIALIZED VIEW conditions_by_day WITH (timescaledb.continuous) AS
    SELECT time_bucket('1 day', time) AS bucket, devices.name, MIN(temperature), MAX(temperature)
    FROM conditions
    JOIN devices ON devices.id = conditions.device_id AND devices.location_id = 'location123'
    GROUP BY bucket, devices.name
    WITH NO DATA;
    ```
   TimescaleDB v2.16.x and higher.

- `INNER JOIN` with a single equality condition specified in `WHERE` clause can be combined with further conditions in the `WHERE` clause:

    ```sql
    CREATE MATERIALIZED VIEW conditions_by_day WITH (timescaledb.continuous) AS
    SELECT time_bucket('1 day', time) AS bucket, devices.name, MIN(temperature), MAX(temperature)
    FROM conditions, devices
    WHERE devices.id = conditions.device_id
    AND devices.location_id = 'location123'
    GROUP BY bucket, devices.name
    WITH NO DATA;
    ```
    TimescaleDB v2.16.x and higher.

- `INNER JOIN` between a hypertable and multiple $PG tables:

    ```sql
    CREATE MATERIALIZED VIEW conditions_by_day WITH (timescaledb.continuous) AS
    SELECT time_bucket('1 day', time) AS bucket, devices.name AS device, locations.name AS location, MIN(temperature), MAX(temperature)
    FROM conditions
    JOIN devices ON devices.id = conditions.device_id
    JOIN locations ON locations.id = devices.location_id
    GROUP BY bucket, devices.name, locations.name
    WITH NO DATA;
    ```
   TimescaleDB v2.16.x and higher.

- `LEFT JOIN` between a hypertable and a $PG table:

    ```sql
    CREATE MATERIALIZED VIEW conditions_by_day WITH (timescaledb.continuous) AS
    SELECT time_bucket('1 day', time) AS bucket, devices.name, MIN(temperature), MAX(temperature)
    FROM conditions
    LEFT JOIN devices ON devices.id = conditions.device_id
    GROUP BY bucket, devices.name
    WITH NO DATA;
    ```
    TimescaleDB v2.16.x and higher.

- `LATERAL JOIN` between a hypertable and a subquery:

    ```sql
    CREATE MATERIALIZED VIEW conditions_by_day WITH (timescaledb.continuous) AS
    SELECT time_bucket('1 day', time) AS bucket, devices.name, MIN(temperature), MAX(temperature)
    FROM conditions, 
    LATERAL (SELECT * FROM devices WHERE devices.id = conditions.device_id) AS devices
    GROUP BY bucket, devices.name
    WITH NO DATA;
    ```
   TimescaleDB v2.16.x and higher.

## Function support

In $TIMESCALE_DB v2.7 and later, continuous aggregates support all $PG
aggregate functions. This includes both parallelizable aggregates, such as `SUM`
and `AVG`, and non-parallelizable aggregates, such as `RANK`.

In $TIMESCALE_DB v2.10.0 and later, the `FROM` clause supports `JOINS`, with
some restrictions. For more information, see the [`JOIN` support section][caggs-joins].

In older versions of $TIMESCALE_DB, continuous aggregates only support
[aggregate functions that can be parallelized by $PG][postgres-parallel-agg].
You can work around this by aggregating the other parts of your query in the
continuous aggregate, then
[using the window function to query the aggregate][cagg-window-functions].

<CaggsFunctionSupport />

If you want the old behavior in later versions of $TIMESCALE_DB, set the
`timescaledb.finalized` parameter to `false` when you create your continuous
aggregate.

## Components of a continuous aggregate

Continuous aggregates consist of:

*   Materialization hypertable to store the aggregated data in
*   Materialization engine to aggregate data from the raw, underlying, table to
    the materialization hypertable
*   Invalidation engine to determine when data needs to be re-materialized, due
    to changes in the data
*   Query engine to access the aggregated data

### Materialization hypertable

Continuous aggregates take raw data from the original hypertable, aggregate it,
and store the aggregated data in a materialization hypertable. When you query
the continuous aggregate view, the aggregated data is returned to you as needed.

Using the same temperature example, the materialization table looks like this:

|day|location|chunk|avg temperature|
|-|-|-|-|
|2021/01/01|New York|1|73|
|2021/01/01|Stockholm|1|70|
|2021/01/02|New York|2||
|2021/01/02|Stockholm|2|69|

The materialization table is stored as a $TIMESCALE_DB hypertable, to take
advantage of the scaling and query optimizations that hypertables offer.
Materialization tables contain a column for each group-by clause in the query,
and an `aggregate` column for each aggregate in the query.

For more information, see [materialization hypertables][cagg-mat-hypertables].

### Materialization engine

The materialization engine performs two transactions. The first transaction
blocks all INSERTs, UPDATEs, and DELETEs, determines the time range to
materialize, and updates the invalidation threshold. The second transaction
unblocks other transactions, and materializes the aggregates. The first
transaction is very quick, and most of the work happens during the second
transaction, to ensure that the work does not interfere with other operations.

### Invalidation engine

Any change to the data in a hypertable could potentially invalidate some
materialized rows. The invalidation engine checks to ensure that the system does
not become swamped with invalidations.

Fortunately, time-series data means that nearly all INSERTs and UPDATEs have a
recent timestamp, so the invalidation engine does not materialize all the data,
but to a set point in time called the materialization threshold. This threshold
is set so that the vast majority of INSERTs contain more recent timestamps.
These data points have never been materialized by the continuous aggregate, so
there is no additional work needed to notify the continuous aggregate that they
have been added. When the materializer next runs, it is responsible for
determining how much new data can be materialized without invalidating the
continuous aggregate. It then materializes the more recent data and moves the
materialization threshold forward in time. This ensures that the threshold lags
behind the point-in-time where data changes are common, and that most INSERTs do
not require any extra writes.

When data older than the invalidation threshold is changed, each transaction
logs the minimum and maximum timestamps of the rows it modified.
The continuous aggregate then identifies which complete time buckets are affected
based on this per-transaction tracking. The range of buckets that are recalculated
depends on transaction boundaries:

* If you modify rows in the 10:00 bucket and rows in the 15:00 bucket within a
  **single transaction**, all buckets from 10:00 to 15:00 (including intermediate
  buckets 11:00, 12:00, 13:00, and 14:00) are recalculated during refresh.
* If you modify rows in the 10:00 bucket in one transaction and rows in the 15:00
  bucket in a **separate transaction**, only the 10:00 and 15:00 buckets are
  recalculated. The intermediate buckets (11:00, 12:00, 13:00, 14:00) are not affected.

This logging does cause some write load. However, the threshold lags behind the
area of data that is currently changing, so the writes are small and rare.

[cagg-mat-hypertables]: /use-timescale/:currentVersion:/continuous-aggregates/materialized-hypertables
[cagg-window-functions]: /use-timescale/:currentVersion:/continuous-aggregates/create-a-continuous-aggregate/#create-continuous-aggregates
[hierarchical-caggs]: /use-timescale/:currentVersion:/continuous-aggregates/hierarchical-continuous-aggregates/
[postgres-parallel-agg]: https://www.postgresql.org/docs/current/parallel-plans.html#PARALLEL-AGGREGATION
[caggs-joins]: /use-timescale/:currentVersion:/continuous-aggregates/about-continuous-aggregates/#continuous-aggregates-with-a-join-clause
