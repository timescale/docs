---
api_name: remove_all_policies()
excerpt: Remove all policies from a continuous aggregate
topics: [continuous aggregates, jobs, compression, data retention]
keywords: [continuous aggregates, policies, remove, compress, data retention]
api:
  license: community
  type: function
  experimental: true
---

import Experimental from "versionContent/_partials/_experimental.mdx";

<!-- markdownlint-disable-next-line line-length -->
# remove_all_policies() <Tag type="community" content="Community" /><Tag type="experimental" content="Experimental" />

Remove all policies from a continuous aggregate. The removed compression and
retention policies apply to the continuous aggregate, _not_ to the original
hypertable.

```sql
timescaledb_experimental.remove_all_policies(
     relation REGCLASS,
     if_exists BOOL = false
) RETURNS BOOL
```

<Experimental />

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

## Sample usage

Remove all policies from a continuous aggregate named
`example_continuous_aggregate`. This includes refresh policies, compression
policies, and data retention policies. It doesn't include user-defined jobs:

```sql
SELECT timescaledb_experimental.remove_all_policies('example_continuous_aggregate');
```
