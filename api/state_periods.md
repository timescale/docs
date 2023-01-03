---
api_name: state_periods()
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

# state_periods()  <tag type="toolkit">Toolkit</tag><tag type="experimental-toolkit">Experimental</tag>

Returns the times in a given state in a [timeline aggregate][state_agg].  

```sql
state_periods(
    state [TEXT | BIGINT],
    agg TimelineAgg
) RETURNS (TIMESTAMPTZ, TIMESTAMPTZ)
```

<Experimental />

## Required arguments

|Name|Type|Description|
|-|-|-|
|`state`|`TEXT` or `BIGINT`|The state to get data for|
|`agg`|`TimelineAgg`|The aggregate to get data for|

## Returns

|Column|Type|Description|
|-|-|-|
|`start_time`|`TIMESTAMPTZ`|The time the state started at (inclusive)|
|`end_time`|`TIMESTAMPTZ`|The time the state ended at (exclusive)|

## Sample usage

Getting the history of states in a timeline aggregate:

```sql
SELECT start_time, end_time FROM toolkit_experimental.state_periods(
  'OK',
  (SELECT toolkit_experimental.timeline_agg(ts, state) FROM states_test)
);
```

Example output:

```
       start_time       |        end_time
------------------------+------------------------
 2020-01-01 00:00:11+00 | 2020-01-01 00:01:00+00
 2020-01-01 00:01:03+00 | 2020-01-01 00:02:00+00
```

[state_agg]: /api/:currentVersion:/hyperfunctions/state-aggregates/state_agg/
