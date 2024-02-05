---
api_name: timescaledb_experimental.time_bucket_ng()
excerpt: Bucket rows by time interval with support for time zones, months, and years
topics: [hyperfunctions]
keywords: [aggregate, hyperfunctions]
tags: [time buckets]
api:
  license: apache
  type: function
  experimental: true
  deprecated: true
hyperfunction:
  type: bucket
---

import DeprecationNotice from "versionContent/_partials/_deprecated.mdx";

## timescaledb_experimental.time_bucket_ng() <Tag type="experimental">Experimental</Tag>

The `time_bucket_ng()` function is an experimental version of the
[`time_bucket()`][time_bucket] function. It introduced some new capabilities,
such as monthly buckets and timezone support. Those features are now part of the
regular `time_bucket()` function.

<DeprecationNotice />

<Highlight type="warning">
The `time_bucket()` and `time_bucket_ng()` functions are similar, but not
completely compatible. There are two main differences.

Firstly, `time_bucket_ng()` doesn't work with timestamps prior to `origin`,
while `time_bucket()` does.

Secondly, the default `origin` values differ. `time_bucket()` uses an origin
date of January 3, 2000, for buckets shorter than a month. `time_bucket_ng()`
uses an origin date of January 1, 2000, for all bucket sizes.
</Highlight>

### Required arguments

|Name|Type|Description|
|---|---|---|
| `bucket_width` | INTERVAL | A PostgreSQL time interval for how long each bucket is |
| `ts` | DATE, TIMESTAMP or TIMESTAMPTZ | The timestamp to bucket |

### Optional arguments

|Name|Type|Description|
|---|---|---|
| `origin` | Should be the same as `ts` | Buckets are aligned relative to this timestamp |
| `timezone` | TEXT | The name of the timezone. The argument can be specified only if the type of `ts` is TIMESTAMPTZ |

For backward compatibility with `time_bucket()` the `timezone` argument is
optional. However, it is required for time buckets that are less than 24 hours.

If you call the TIMESTAMPTZ-version of the function without the `timezone`
argument, the timezone defaults to the session's timezone and so the function
can't be used with continuous aggregates. Best practice is to use
`time_bucket_ng(interval, timestamptz, text)` and specify the timezone.

### Returns

The function returns the bucket's start time. The return value type is the
same as `ts`.

### Sample usage

In this example, `time_bucket_ng()` is used to create bucket data in three month
intervals:

```sql
SELECT timescaledb_experimental.time_bucket_ng('3 month', date '2021-08-01');
 time_bucket_ng
----------------
 2021-07-01
(1 row)
```

This example uses `time_bucket_ng()` to bucket data in one year intervals:

```sql
SELECT timescaledb_experimental.time_bucket_ng('1 year', date '2021-08-01');
 time_bucket_ng
----------------
 2021-01-01
(1 row)
```

To split time into buckets, `time_bucket_ng()` uses a starting point in time
called `origin`. The default origin is `2000-01-01`. `time_bucket_ng` cannot use
timestamps earlier than `origin`:

```sql
SELECT timescaledb_experimental.time_bucket_ng('100 years', timestamp '1988-05-08');
ERROR:  origin must be before the given date
```

Going back in time from `origin` isn't usually possible, especially when you
consider timezones and daylight savings time (DST). Note also that there is no
reasonable way to split time in variable-sized buckets (such as months) from an
arbitrary `origin`, so `origin` defaults to the first day of the month.

To bypass named limitations, you can override the default `origin`:

```sql
-- working with timestamps before 2000-01-01
SELECT timescaledb_experimental.time_bucket_ng('100 years', timestamp '1988-05-08', origin => '1900-01-01');
   time_bucket_ng
---------------------
 1900-01-01 00:00:00

-- unlike the default origin, which is Saturday, 2000-01-03 is Monday
SELECT timescaledb_experimental.time_bucket_ng('1 week', timestamp '2021-08-26', origin => '2000-01-03');
   time_bucket_ng
---------------------
 2021-08-23 00:00:00
```

This example shows how `time_bucket_ng()` is used to bucket data
by months in a specified timezone:

```sql
-- note that timestamptz is displayed differently depending on the session parameters
SET TIME ZONE 'Europe/Moscow';
SET

SELECT timescaledb_experimental.time_bucket_ng('1 month', timestamptz '2001-02-03 12:34:56 MSK', timezone => 'Europe/Moscow');
     time_bucket_ng
------------------------
 2001-02-01 00:00:00+03
```

You can use `time_bucket_ng()` with continuous aggregates. This example tracks
the temperature in Moscow over seven day intervals:

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

CREATE MATERIALIZED VIEW conditions_summary_weekly
WITH (timescaledb.continuous) AS
SELECT city,
       timescaledb_experimental.time_bucket_ng('7 days', day) AS bucket,
       MIN(temperature),
       MAX(temperature)
FROM conditions
GROUP BY city, bucket;

SELECT to_char(bucket, 'YYYY-MM-DD'), city, min, max
FROM conditions_summary_weekly
ORDER BY bucket;

  to_char   |  city  | min | max
------------+--------+-----+-----
 2021-06-12 | Moscow |  22 |  27
 2021-06-19 | Moscow |  28 |  34
 2021-06-26 | Moscow |  31 |  32
(3 rows)
```

<Highlight type="note">
The `by_range` dimension builder is an addition to TimescaleDB
2.13. For simpler cases, like this one, you can also create the
hypertable using the old syntax:

```sql
SELECT create_hypertable('<table name>', '<time column name>');
```
</Highlight>

For more information, see the [continuous aggregates documentation][caggs].

<Highlight type="important">
While `time_bucket_ng()` supports months and timezones,
continuous aggregates cannot always be used with monthly
buckets or buckets with timezones.
</Highlight>

This table shows which `time_bucket_ng()` functions can be used in a continuous aggregate:

|Function|Available in continuous aggregate|TimescaleDB version|
|-|-|-|
|Buckets by seconds, minutes, hours, days, and weeks|✅|2.4.0 and later|
|Buckets by months and years|✅|2.6.0 or later|
|Timezones support|✅|2.6.0 or later|
|Specify custom origin|✅|2.7.0 or later|

[time_bucket]: /api/:currentVersion:/hyperfunctions/time_bucket/
[caggs]: /use-timescale/:currentVersion:/continuous-aggregates/
