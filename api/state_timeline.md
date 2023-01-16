---
api_name: state_timeline()
excerpt: Get all state periods from a timeline aggregate
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

# state_timeline()  <tag type="toolkit">Toolkit</tag><tag type="experimental-toolkit">Experimental</tag>

Returns the timeline of states in a [timeline aggregate][state_agg].  

```sql
state_timeline(
    agg TimelineAgg
) RETURNS (TEXT, TIMESTAMPTZ, TIMESTAMPTZ)

state_int_timeline(
    agg TimelineAgg
) RETURNS (BIGINT, TIMESTAMPTZ, TIMESTAMPTZ)
```

<Experimental />

## Required arguments

|Name|Type|Description|
|-|-|-|
|`agg`|`TimelineAgg`|The aggregate to get data for|

## Returns

|Column|Type|Description|
|-|-|-|
|`state`|`TEXT` or `BIGINT`|A state found in the `TimelineAgg`|
|`start_time`|`TIMESTAMPTZ`|The time the state started at (inclusive)|
|`end_time`|`TIMESTAMPTZ`|The time the state ended at (exclusive)|

## Sample usage

Getting the history of states in a timeline aggregate:

```sql
SELECT state, start_time, end_time FROM toolkit_experimental.state_timeline(
     (SELECT toolkit_experimental.timeline_agg(ts, state) FROM states_test));
```

Example output:

```
 state |       start_time       |        end_time
-------+------------------------+------------------------
 START | 2020-01-01 00:00:00+00 | 2020-01-01 00:00:11+00
 OK    | 2020-01-01 00:00:11+00 | 2020-01-01 00:01:00+00
 ERROR | 2020-01-01 00:01:00+00 | 2020-01-01 00:01:03+00
 OK    | 2020-01-01 00:01:03+00 | 2020-01-01 00:02:00+00
 STOP  | 2020-01-01 00:02:00+00 | 2020-01-01 00:02:00+00
```

[state_agg]: /api/:currentVersion:/hyperfunctions/state-aggregates/state_agg/
