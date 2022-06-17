---
api_name: state_agg()
excerpt: Aggregate state data into a state aggregate for further analysis
license: community
toolkit: true
experimental: true
topic: hyperfunctions
tags: [hyperfunctions, states, aggregates, state aggregates]
api_category: hyperfunction
api_experimental: true
hyperfunction_toolkit: true
hyperfunction_family: 'frequency analysis'
hyperfunction_subfamily: StateAgg
hyperfunction_type: aggregate
---

# state_agg()  <tag type="toolkit">Toolkit</tag><tag type="experimental">Experimental</tag>
The `state_agg` aggregate measures the amount of time spent in each 
distinct value of a state field. It is designed to work with a relatively small 
number of states and might not perform well on queries where states are 
mostly distinct across rows.

<highlight type="warning">
Experimental features could have bugs. They might not be backwards compatible,
and could be removed in future releases. Use these features at your own risk, and
do not use any experimental features in production.
</highlight>

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
