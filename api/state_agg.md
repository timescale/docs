---
api_name: state_agg() | timeline_agg()
excerpt: Aggregate state data into a state aggregate for further analysis
topics: [hyperfunctions]
keywords: [states, aggregate, hyperfunctions, Toolkit]
api:
  license: community
  type: function
  experimental: true
  toolkit: true
  version:
    experimental: 1.5.0
hyperfunction:
  family: state aggregates
  type: aggregate
---

import Experimental from 'versionContent/_partials/_experimental.mdx';

# state_agg() and timeline_agg() <tag type="toolkit">Toolkit</tag><tag type="experimental-toolkit">Experimental</tag>

The `state_agg` aggregate measures the amount of time spent in each
distinct value of a state field. It is designed to work with a relatively small
number of states and might not perform well on queries where states are
mostly distinct across rows.

The `timeline_agg` aggregate works the same as `state_agg`, but also tracks when
states are entered and exited. It has increased memory usage since it needs to
track more data.

<Experimental />

## Required arguments

|Name|Type|Description|
|-|-|-|
|`ts`|`TIMESTAMPTZ`|Column of timestamps|
|`value`|`TEXT` or `BIGINT`|Column of states|

## Returns

|Column|Type|Description|
|-|-|-|
|`agg`|`StateAgg` or `TimelineAgg`|An object storing the total time spent in each state.|

## Sample usage

This example creates an aggregate over a `status` column in a `devices`
table, with a timestamp column `time`.

```sql
-- create a state aggregate:
SELECT toolkit_experimental.state_agg(time, status) FROM devices;
-- create a timeline aggregate:
SELECT toolkit_experimental.timeline_agg(time, status) FROM devices;
```
