---
api_name: remove_continuous_aggregate_policy()
excerpt: Remove a refresh policy from a continuous aggregate
topics: [continuous aggregates, jobs]
keywords: [continuous aggregates, policies, remove]
tags: [delete, drop]
api:
  license: community
  type: function
---

## remove_continuous_aggregate_policy() <tag type="community">Community</tag>

Remove refresh policy for a continuous aggregate. To view the policies that
already exist, see [informational views][informational-views].

### Required arguments

|Name|Type|Description|
|---|---|---|
| `continuous_aggregate` | REGCLASS | Name of the continuous aggregate the policy should be removed from |

### Sample usage

Remove the refresh policy from the 'cpu_view' continuous aggregate:

``` sql
SELECT remove_continuous_aggregate_policy('cpu_view');
```

[informational-views]: /api/:currentVersion:/informational-views/jobs/
