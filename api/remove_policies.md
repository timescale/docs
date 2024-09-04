---
api_name: remove_policies()
excerpt: Remove refresh, compression, or data retention policies from a continuous aggregate
topics: [continuous aggregates, jobs, compression, data retention]
keywords: [continuous aggregates, policies, remove, compress, data retention]
api:
  license: community
  type: function
  experimental: true
---

import Experimental from "versionContent/_partials/_experimental.mdx";

{/* markdownlint-disable-next-line line-length */}
# remove_policies() <Tag type="community" content="Community" /><Tag type="experimental" content="Experimental" />

Remove refresh, compression, and data retention policies from a continuous
aggregate. The removed compression and retention policies apply to the
continuous aggregate, _not_ to the original hypertable.

```sql
timescaledb_experimental.remove_policies(
     relation REGCLASS,
     if_exists BOOL = false,
     VARIADIC policy_names TEXT[] = NULL
) RETURNS BOOL
```

To remove all policies on a continuous aggregate, see
[`remove_all_policies()`][remove-all-policies].

<Experimental />

## Required arguments

|Name|Type|Description|
|-|-|-|
|`relation`|`REGCLASS`|The continuous aggregate to remove policies from|

## Optional arguments

|Name|Type|Description|
|-|-|-|
|`if_exists`|`BOOL`|When true, prints a warning instead of erroring if the policy doesn't exist. Defaults to false.|
|`policy_names`|`TEXT`|The policies to remove. You can list multiple policies, separated by a comma. Allowed policy names are `policy_refresh_continuous_aggregate`, `policy_compression`, and `policy_retention`.|

## Returns

Returns true if successful.

## Sample usage

Given a continuous aggregate named `example_continuous_aggregate` with a refresh
policy and a data retention policy, remove both policies.

Throw an error if either policy doesn't exist. If the continuous aggregate has a
compression policy, leave it unchanged:

```sql
SELECT timescaledb_experimental.remove_policies(
    'example_continuous_aggregate',
    false,
    'policy_refresh_continuous_aggregate',
    'policy_retention'
);
```

[remove-all-policies]: /api/:currentVersion:/continuous-aggregates/remove_all_policies/
