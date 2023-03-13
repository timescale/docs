---
title: Heartbeat aggregation
excerpt: Measure system liveness using discrete points
keywords: [hyperfunctions, Toolkit, heartbeat, liveness]
---

# Heartbeat aggregation

Given a series of timestamped health checks, it can be tricky to determine the overall health of
a system over a given interval. PostgresQL provides window functions which can be used to get a
sense of where unhealthy gaps are, but can be somewhat awkward to use efficiently. We've created
the heartbeat aggregate as part of the TimescaleDB Toolkit to solve this problem in a simpler,
more accessible manner.

For this example, we'll be using the SustData public dataset found [here][sustdata]. This dataset
tracks the power usage of a small number of apartments and houses over four different deployment
intervals. The data is collected in one minute samples from each unit.

Our first step after loading the data into [hypertables][hypertables] will be to create a materialized
view containing weekly heartbeat aggregates for each of the units.

```sql
CREATE MATERIALIZED VIEW weekly_heartbeat AS
  SELECT 
    time_bucket('1 week', tmstp) as week,
    iid as unit,
    deploy,
    heartbeat_agg(tmstp, time_bucket('1w', tmstp), '1w', '2m') 
  FROM power_samples
  GROUP BY 1,2,3;
```

Notice the heartbeat aggregate takes four parameters; the timestamp column, the start of the
interval, the length of the interval, and how long the aggregate is considered live after each
timestamp. In this example we use 2 minutes as the heartbeat lifetime to give us some tolerance
for small gaps.

With this data we can easily see when we're receiving data for a particular unit. Here we'll
rollup the weekly aggregates into a single aggregate and view the live ranges.

```sql
SELECT live_ranges(rollup(heartbeat_agg)) FROM weekly_heartbeat WHERE unit = 17;
```

```output
                     live_ranges                     
-----------------------------------------------------
 ("2010-09-18 00:00:00+00","2011-03-27 01:01:50+00")
 ("2011-03-27 03:00:52+00","2011-07-03 00:01:00+00")
 ("2011-07-05 00:00:00+00","2011-08-21 00:01:00+00")
 ("2011-08-22 00:00:00+00","2011-08-25 00:01:00+00")
 ("2011-08-27 00:00:00+00","2011-09-06 00:01:00+00")
 ("2011-09-08 00:00:00+00","2011-09-29 00:01:00+00")
 ("2011-09-30 00:00:00+00","2011-10-04 00:01:00+00")
 ("2011-10-05 00:00:00+00","2011-10-17 00:01:00+00")
 ("2011-10-19 00:00:00+00","2011-11-09 00:01:00+00")
 ("2011-11-10 00:00:00+00","2011-11-14 00:01:00+00")
 ("2011-11-15 00:00:00+00","2011-11-18 00:01:00+00")
 ("2011-11-20 00:00:00+00","2011-11-23 00:01:00+00")
 ("2011-11-24 00:00:00+00","2011-12-01 00:01:00+00")
 ("2011-12-02 00:00:00+00","2011-12-12 00:01:00+00")
 ("2011-12-13 00:00:00+00","2012-01-12 00:01:00+00")
 ("2012-01-13 00:00:00+00","2012-02-03 00:01:00+00")
 ("2012-02-04 00:00:00+00","2012-02-10 00:01:00+00")
 ("2012-02-11 00:00:00+00","2012-03-25 01:01:50+00")
 ("2012-03-25 03:00:51+00","2012-04-11 00:01:00+00")
```

We can do also do more eloborate queries, like looking for the 5 units with the lowest uptime
during the third deployment.

```sql
SELECT unit, uptime(rollup(heartbeat_agg))
FROM weekly_heartbeat
WHERE deploy = 3
GROUP BY unit
ORDER BY uptime LIMIT 5;
```

```output
 unit |      uptime       
------+-------------------
   31 | 203 days 22:05:00
   34 | 222 days 22:05:00
   32 | 222 days 22:05:00
   35 | 222 days 22:05:00
   30 | 222 days 22:05:00
```

Another neat feature of the heartbeat agg is that we can actually combine aggregates from different
units to get the combined coverage. Here we're querying for the interval where any part of a
deployment was active.

```sql
SELECT deploy, live_ranges(rollup(heartbeat_agg)) 
FROM weekly_heartbeat group by deploy order by deploy;
```

```output
 deploy |                     live_ranges                     
--------+-----------------------------------------------------
      1 | ("2010-07-29 00:00:00+00","2010-11-26 00:01:00+00")
      2 | ("2010-11-25 00:00:00+00","2011-03-27 01:01:59+00")
      2 | ("2011-03-27 03:00:00+00","2012-03-25 01:01:59+00")
      2 | ("2012-03-25 03:00:26+00","2012-04-17 00:01:00+00")
      2 | ("2012-04-20 00:00:00+00","2012-04-21 00:01:00+00")
      2 | ("2012-05-11 00:00:00+00","2012-05-13 00:01:00+00")
      2 | ("2013-02-20 00:00:00+00","2013-02-21 00:01:00+00")
      3 | ("2012-08-01 00:00:01+00","2013-03-31 01:01:16+00")
      3 | ("2013-03-31 03:00:03+00","2013-05-22 00:01:00+00")
      4 | ("2013-07-31 00:00:00+00","2014-03-30 01:01:49+00")
      4 | ("2014-03-30 03:00:01+00","2014-04-25 00:01:00+00")
```

With this data we can make a few observations. First, it looks the second deployment had a lot
more problems than the other ones. Second, it looks like there were some readings from February
2013 that were incorrectly categorized as second deployment. And finally, it looks like the
timestamps are given in a local time without time zone, resulting in some missing hours around
springtime daylight savings time changes.

For more information about heartbeat aggregation API calls, see the
[hyperfunction API documentation][hyperfunctions-api-heartbeat-agg].

[sustdata]: https://osf.io/2ac8q/
[hypertables]: /timescaledb/:currentVersion:/overview/core-concepts/hypertables-and-chunks/hypertable-architecture/
[hyperfunctions-api-heartbeat-agg]: /api/:currentVersion:/hyperfunctions/state-tracking/heartbeat_agg/
