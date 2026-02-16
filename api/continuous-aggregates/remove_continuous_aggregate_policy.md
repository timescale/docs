---
api_name: remove_continuous_aggregate_policy()
excerpt: Remove a refresh policy from a continuous aggregate
topics: [continuous aggregates, jobs]
keywords: [continuous aggregates, policies, remove]
tags: [delete, drop]
api:
  license: community
  type: function
products: [cloud, self_hosted, mst]
---

# remove_continuous_aggregate_policy() <Tag type="community">Community</Tag>

Remove all refresh policies from a continuous aggregate.

```sql
remove_continuous_aggregate_policy(
    continuous_aggregate REGCLASS,
    if_exists BOOL = NULL
) RETURNS VOID
```

<Highlight type="note">

To view the existing continuous aggregate policies, see the [policies informational view](/api/:currentVersion:/informational-views/policies/).

</Highlight>

## Samples

Remove all refresh policies from the `cpu_view` continuous aggregate:

``` sql
SELECT remove_continuous_aggregate_policy('cpu_view');
```

## Required arguments

|Name|Type|Description|
|-|-|-|
|`continuous_aggregate`|`REGCLASS`|Name of the continuous aggregate the policies should be removed from|

## Optional arguments

|Name|Type|Description|
|-|-|-|
|`if_exists` (formerly `if_not_exists`)|`BOOL`|When true, prints a warning instead of erroring if the policy doesn't exist. Defaults to false. Renamed in TimescaleDB 2.8.|


