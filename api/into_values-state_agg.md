---
api_name: into_values()
excerpt: Calculate all state durations from a state aggregate
topics: [hyperfunctions]
keywords: [duration, states, hyperfunctions, Toolkit]
api:
  license: community
  type: function
  experimental: true
  toolkit: true
  version:
    experimental: 1.6.0
hyperfunction:
  family: state aggregates
  type: accessor
  aggregates:
    - state_agg() | timeline_agg()
---

import Experimental from 'versionContent/_partials/_experimental.mdx';

# into_values()  <tag type="toolkit">Toolkit</tag><tag type="experimental-toolkit">Experimental</tag>

Returns the data accumulated in a [state aggregate][state_agg].  

```sql
into_values (
    agg [StateAgg | TimelineAgg]
) RETURNS (TEXT, BIGINT)

into_int_values (
    agg [StateAgg | TimelineAgg]
) RETURNS (INT, BIGINT)
```

<Experimental />

## Required arguments

|Name|Type|Description|
|-|-|-|
|`agg`|`StateAgg` or `TimelineAgg`|The aggregate to display data for|

## Returns

|Column|Type|Description|
|-|-|-|
|`state`|`TEXT`|A state found in the `StateAgg` or `TimelineAgg`|
|`duration`|`BIGINT` or `INT`|The duration of time spent in that state|

## Sample usage

Create a state aggregate from the table `states_test`. The time column is named
`time`, and the `state` column contains text values corresponding to different
states of a system. Use `into_values` to display the data from the state
aggregate:

```sql
SELECT state, duration FROM toolkit_experimental.into_values(
     (SELECT toolkit_experimental.state_agg(time, state) FROM states_test));
```

Example output:

```
state | duration
------+-----------
ERROR |   3000000
OK    | 106000000
START |  11000000
```

[state_agg]: /api/:currentVersion:/hyperfunctions/state-aggregates/state_agg/
