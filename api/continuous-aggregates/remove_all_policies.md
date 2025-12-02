---
api_name: remove_all_policies()
excerpt: Remove all policies from a continuous aggregate
topics: [continuous aggregates, jobs, compression, data retention]
keywords: [continuous aggregates, policies, remove, compress, data retention]
api:
  license: community
  type: function
  experimental: true
products: [cloud, self_hosted, mst]
---

<!-- markdownlint-disable-next-line line-length -->
# remove_all_policies() <Tag type="community" content="Community" /><Tag type="experimental" content="Experimental" />

Remove all policies from a continuous aggregate. The removed columnstore and
retention policies apply to the continuous aggregate, _not_ to the original
hypertable.

<Highlight type="warning">

This experimental function will be removed in future, please use [`remove_job()`](remove_job) function to delete a policy.

</Highlight>

```sql
timescaledb_experimental.remove_all_policies(
     relation REGCLASS,
     if_exists BOOL = false
) RETURNS BOOL
```

## Samples

Remove all policies from a continuous aggregate named
`example_continuous_aggregate`. This includes refresh policies, columnstore
policies, and data retention policies. It doesn't include custom $JOBs:

```sql
SELECT timescaledb_experimental.remove_all_policies('example_continuous_aggregate');
```

## Required arguments

|Name|Type|Description|
|-|-|-|
|`relation`|`REGCLASS`|The continuous aggregate to remove all policies from|

## Optional arguments

|Name|Type|Description|
|-|-|-|
|`if_exists`|`BOOL`|When true, prints a warning instead of erroring if any policies are missing. Defaults to false.|

## Returns

Returns true if successful.

[delete_job]: /api/:currentVersion:/jobs-automation/delete_job/
