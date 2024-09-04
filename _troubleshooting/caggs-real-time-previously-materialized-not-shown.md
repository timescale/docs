---
title: Updates to previously materialized regions aren't shown in real-time aggregates
section: troubleshooting
products: [cloud, mst, self_hosted]
topics: [continuous aggregates]
apis:
  - [continuous aggregates, add_continuous_aggregate_policy()]
  - [continuous aggregates, add_policies()]
  - [continuous aggregates, alter_policies()]
  - [continuous aggregates, CREATE MATERIALIZED VIEW (Continuous Aggregate)]
  - [continuous aggregates, refresh_continuous_aggregate()]
keywords: [continuous aggregates, real-time aggregates]
tags: [continuous aggregates, real-time aggregates, materialized views]
---

import CaggsRealTimeHistoricalDataRefreshes from 'versionContent/_partials/_caggs-real-time-historical-data-refreshes.mdx';

{/*
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
*/}

<CaggsRealTimeHistoricalDataRefreshes />

The following example shows how this works.

Create and fill the hypertable:

```sql
CREATE TABLE conditions(
  day DATE NOT NULL,
  city text NOT NULL,
  temperature INT NOT NULL);

SELECT create_hypertable(
  'conditions', by_range('day', INTERVAL '1 day')
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
