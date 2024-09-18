---
title: SELECT data
excerpt: Query data from a hypertable using a standard SELECT command
products: [cloud, mst, self_hosted]
keywords: [queries]
---

# SELECT data

You can query data from a hypertable using a standard
[`SELECT`][postgres-select] command. All SQL clauses and features are supported. Use [PopSQL][popsql] to work on data with centralized SQL queries, interactive visuals and real-time collaboration

## Basic query examples

Here are some examples of basic `SELECT` queries.

Return the 100 most-recent entries in the table `conditions`. Order the rows
from newest to oldest:

```sql
SELECT * FROM conditions ORDER BY time DESC LIMIT 100;
```

Return the number of entries written to the table `conditions` in the last 12
hours:

```sql
SELECT COUNT(*) FROM conditions
  WHERE time > NOW() - INTERVAL '12 hours';
```

### Advanced query examples

Here are some examples of more advanced `SELECT` queries.

Get information about the weather conditions at each location, for each
15-minute period within the last 3&nbsp;hours. Calculate the number of
measurements taken, the maximum temperature, and the maximum humidity. Order the
results by maximum temperature.

This examples uses the [`time_bucket`][time_bucket] function to aggregate data
into 15-minute buckets:

```sql
SELECT time_bucket('15 minutes', time) AS fifteen_min,
    location,
    COUNT(*),
    MAX(temperature) AS max_temp,
    MAX(humidity) AS max_hum
  FROM conditions
  WHERE time > NOW() - INTERVAL '3 hours'
  GROUP BY fifteen_min, location
  ORDER BY fifteen_min DESC, max_temp DESC;
```

Count the number of distinct locations with air conditioning that have reported
data in the last day:

```sql
SELECT COUNT(DISTINCT location) FROM conditions
  JOIN locations
    ON conditions.location = locations.location
  WHERE locations.air_conditioning = True
    AND time > NOW() - INTERVAL '1 day';
```

[postgres-select]: https://www.postgresql.org/docs/current/static/sql-select.html
[time_bucket]: /use-timescale/:currentVersion:/time-buckets/
[popsql]: /getting-started/:currentVersion:/run-queries-from-console/#data-mode
