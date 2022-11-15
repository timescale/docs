---
api_name: interpolated_duration_in()
excerpt: Calculate the total time spent in a given state, interpolating values at interval boundaries if they don't exist
topics: [hyperfunctions]
tags: [hyperfunctions, duration, state, state aggregates, interpolated]
api:
  license: community
  type: function
  experimental: true
  toolkit: true
  version:
    experimental: 1.8.0
hyperfunction:
  family: frequency analysis
  type: accessor
  aggregates:
    - state_agg()
---

import Experimental from 'versionContent/_partials/_experimental.mdx';

# interpolated_duration_in()  <tag type="toolkit">Toolkit</tag><tag type="experimental-toolkit">Experimental</tag>

Calculate the total duration in a given state from a [state aggregate][state_agg].
Unlike [`duration_in`][duration_in], you can use this function across multiple state
aggregates that cover different time buckets. Any missing values at the time bucket
boundaries are interpolated from adjacent StateAggs.

```SQL
interpolated_duration_in(
    state TEXT,
    tws StateAgg,
    start TIMESTAMPTZ,
    interval INTERVAL,
    prev StateAgg,
    next StateAgg
) RETURNS DOUBLE PRECISION
```

<Experimental />

## Required arguments

|Name|Type|Description|
|-|-|-|
|`state`|`TEXT`|State to query|
|`aggregate`|`StateAgg`|Previously created state_agg aggregate|
|`start`|`TIMESTAMPTZ`|The start of the interval which this function should cover (if there is a preceeding point)|
|`interval`|`INTERVAL`|The length of the interval|

### Optional arguments

|Name|Type|Description|
|-|-|-|
|`prev`|`StateAgg`|The `StateAgg` from the prior interval, used to interpolate the value at `start`. If `NULL`, the first timestamp in `aggregate` will be used as the start of the interval.|
|`next`|`StateAgg`|The `StateAgg` from the following interval, used to interpolate the value at `start` + `interval`. If `NULL`, the last timestamp in `aggregate` will be used as the end of the interval.|

## Returns

|Column|Type|Description|
|-|-|-|
|`interpolated_duration_in`|`INTERVAL`|The total time spent in the target state. Displayed as `days`, `hh:mm:ss`, or a combination of the two.|

## Sample usage

This example creates a simple test table:

```sql
SET timezone TO 'UTC';
CREATE TABLE states(time TIMESTAMPTZ, state TEXT);
INSERT INTO states VALUES
  ('1-1-2020 10:00', 'starting'),
  ('1-1-2020 10:30', 'running'),
  ('1-2-2020 16:00', 'error'),
  ('1-3-2020 18:30', 'starting'),
  ('1-3-2020 19:30', 'running'),
  ('1-4-2020 12:00', 'stopping');
```

You can query this table for the time spent in the running state, like this:

```sql
SELECT 
  time,
  toolkit_experimental.interpolated_duration_in(
    'running',
    agg,
    time,
    '1 day',
    LAG(agg) OVER (ORDER BY time),
    LEAD(agg) OVER (ORDER BY time)
) FROM (
  SELECT
    time_bucket('1 day', time) as time,
    toolkit_experimental.state_agg(time, state) as agg
  FROM
    states
  GROUP BY time_bucket('1 day', time)
) s;
```

Which gives the result:

```sql
          time          | interpolated_duration_in 
------------------------+--------------------------
 2020-01-01 00:00:00+00 | 13:30:00
 2020-01-02 00:00:00+00 | 16:00:00
 2020-01-03 00:00:00+00 | 04:30:00
 2020-01-04 00:00:00+00 | 12:00:00
```

If you prefer to see the result in seconds, [`EXTRACT`][extract] the epoch from
the returned result.

[duration_in]: /api/:currentVersion:/hyperfunctions/frequency-analysis/duration_in/
[extract]: https://www.postgresql.org/docs/current/functions-datetime.html#FUNCTIONS-DATETIME-EXTRACT
[state_agg]: /api/:currentVersion:/hyperfunctions/frequency-analysis/state_agg/
