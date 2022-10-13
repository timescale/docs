---
api_name: state_agg()
excerpt: Aggregate state data into a state aggregate for further analysis
topics: [hyperfunctions]
keywords: [states, aggregate, hyperfunctions, toolkit]
api:
  license: community
  type: function
  experimental: true
  toolkit: true
  version:
    experimental: 1.5.0
hyperfunction:
  family: frequency analysis
  type: aggregate
# fields below will be deprecated
api_category: hyperfunction
api_experimental: true
toolkit: true
hyperfunction_family: 'frequency analysis'
hyperfunction_subfamily: StateAgg
hyperfunction_type: aggregate
---

import Experimental from 'versionContent/_partials/_experimental.mdx';

# state_agg()  <tag type="toolkit">Toolkit</tag><tag type="experimental-toolkit">Experimental</tag>

The `state_agg` aggregate measures the amount of time spent in each
distinct value of a state field. It is designed to work with a relatively small
number of states and might not perform well on queries where states are
mostly distinct across rows.

<Experimental />

## Required arguments

|Name|Type|Description|
|-|-|-|
|`ts`|`TIMESTAMPTZ`|Column of timestamps|
|`value`|`TEXT`|Column of states|

## Returns

|Column|Type|Description|
|-|-|-|
|`stateagg`|`stateagg`|An object storing the total time spent in each state.|

## Sample usage

This example creates a state aggregate over a `status` column in a `devices`
table, with a timestamp column `time`.

```sql
CREATE toolkit_experimental.state_agg(time, status) FROM devices;
```
