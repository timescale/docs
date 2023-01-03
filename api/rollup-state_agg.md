---
api_name: rollup()
excerpt: Rollup multiple `StateAgg` aggregates
topics: [hyperfunctions]
keywords: [hyperfunctions, duration, states, hyperfunctions, Toolkit]
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

# rollup()  <tag type="toolkit">Toolkit</tag><tag type="experimental-toolkit">Experimental</tag>

Combines multiple `StateAgg`/`TimelineAgg` aggregates. Using `rollup`, you can
reaggregate a continuous aggregate into larger [time buckets][time_bucket].

```sql
rollup(
    agg [StateAgg | TimelineAgg]
) RETURNS [StateAgg | TimelineAgg]
```

<Experimental />

## Required arguments

|Name|Type|Description|
|-|-|-|
|`agg`|`StateAgg` or `TimelineAgg`|The aggregates to roll up|

## Returns

|Column|Type|Description|
|-|-|-|
|`agg`|`StateAgg` or `TimelineAgg`|A new aggregate containing the combined rolled-up aggregates.|

## Sample usage
```sql
WITH buckets AS (SELECT
    time_bucket('1 minute', ts) as dt,
    toolkit_experimental.state_agg(ts, state) AS sa
FROM states_test
GROUP BY time_bucket('1 minute', ts))
SELECT toolkit_experimental.duration_in(
    'START',
    toolkit_experimental.rollup(buckets.sa)
)
FROM buckets;
```

[time_bucket]: /api/:currentVersion:/hyperfunctions/time_bucket/
