---
api_name: interpolated_state_periods()
excerpt: Get time periods for a state from a timeline aggregate
topics: [hyperfunctions]
keywords: [duration, states, hyperfunctions, Toolkit]
api:
  license: community
  type: function
  experimental: true
  toolkit: true
  version:
    experimental: 1.13.0
hyperfunction:
  family: state aggregates
  type: accessor
  aggregates:
    - state_agg() | timeline_agg()
---

import Experimental from 'versionContent/_partials/_experimental.mdx';

# interpolated_state_periods()  <tag type="toolkit">Toolkit</tag><tag type="experimental-toolkit">Experimental</tag>

Returns the times in a given state in a [timeline aggregate][state_agg].  

Unlike [`state_periods`][state_periods], you can use this function across multiple state
aggregates that cover different time buckets. Any missing values at the time bucket
boundaries are interpolated from adjacent TimelineAggs.

```sql
interpolated_state_periods(
    state [TEXT | BIGINT],
    tws [StateAgg | TimelineAgg],
    start TIMESTAMPTZ,
    interval INTERVAL,
    prev [StateAgg | TimelineAgg],
    next [StateAgg | TimelineAgg]
) RETURNS (TIMESTAMPTZ, TIMESTAMPTZ)
```

<Experimental />

## Required arguments

|Name|Type|Description|
|-|-|-|
|`state`|`TEXT` or `BIGINT`|State to query|
|`aggregate`|`TimelineAgg`|Previously created state_agg aggregate|
|`start`|`TIMESTAMPTZ`|The start of the interval which this function should cover (if there is a preceeding point)|
|`interval`|`INTERVAL`|The length of the interval|

### Optional arguments

|Name|Type|Description|
|-|-|-|
|`prev`|`TimelineAgg`|The `TimelineAgg` from the prior interval, used to interpolate the value at `start`. If `NULL`, the first timestamp in `aggregate` is used as the start of the interval.|
|`next`|`TimelineAgg`|The `TimelineAgg` from the following interval, used to interpolate the value at `start` + `interval`. If `NULL`, the last timestamp in `aggregate` is used as the end of the interval.|

## Returns

|Column|Type|Description|
|-|-|-|
|`start_time`|`TIMESTAMPTZ`|The time the state started at (inclusive)|
|`end_time`|`TIMESTAMPTZ`|The time the state ended at (exclusive)|

## Sample usage

Getting the interpolated history of states in a timeline aggregate:

```sql
SELECT
    bucket,
    (toolkit_experimental.interpolated_state_periods(
        'OK',
        summary,
        bucket,
        '15 min',
        LAG(summary) OVER (ORDER by bucket),
        LEAD(summary) OVER (ORDER by bucket)
    )).*
FROM (
    SELECT
        time_bucket('1 min'::interval, ts) AS bucket,
        toolkit_experimental.timeline_agg(ts, state) AS summary
    FROM states_test
    GROUP BY time_bucket('1 min'::interval, ts)
) t;
```

Example output:

```
         bucket         |       start_time       |        end_time
------------------------+------------------------+------------------------
 2020-01-01 00:00:00+00 | 2020-01-01 00:00:11+00 | 2020-01-01 00:15:00+00
 2020-01-01 00:01:00+00 | 2020-01-01 00:01:03+00 | 2020-01-01 00:16:00+00
```

[state_agg]: /api/:currentVersion:/hyperfunctions/state-aggregates/state_agg/
[state_periods]: /api/:currentVersion:/hyperfunctions/state-aggregates/state_periods/
