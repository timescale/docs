---
api_name: alter_policies()
excerpt: Alter refresh, compression, or data retention policies on a continuous aggregate
topics: [continuous aggregates, jobs, compression, data retention]
keywords: [continuous aggregates, policies, alter, compress, data retention]
tags: [change]
api:
  license: community
  type: function
  experimental: true
---

import Experimental from "versionContent/_partials/_experimental.mdx";

<!-- markdownlint-disable-next-line line-length -->
# alter_policies() <Tag type="community" content="Community" /><Tag type="experimental" content="Experimental" />

Alter refresh, compression, or data retention policies on a continuous
aggregate. The altered compression and retention policies apply to the
continuous aggregate, _not_ to the original hypertable.

```sql
timescaledb_experimental.alter_policies(
     relation REGCLASS,
     if_exists BOOL = false,
     refresh_start_offset "any" = NULL,
     refresh_end_offset "any" = NULL,
     compress_after "any" = NULL,
     drop_after "any" = NULL
) RETURNS BOOL
```

<Experimental />

## Required arguments

|Name|Type|Description|
|-|-|-|
|`relation`|`REGCLASS`|The continuous aggregate that you want to alter policies for|

## Optional arguments

|Name|Type|Description|
|-|-|-|
|`if_not_exists`|`BOOL`|When true, prints a warning instead of erroring if the policy doesn't exist. Defaults to false.|
|`refresh_start_offset`|`INTERVAL` or `INTEGER`|The start of the continuous aggregate refresh window, expressed as an offset from the policy run time.|
|`refresh_end_offset`|`INTERVAL` or `INTEGER`|The end of the continuous aggregate refresh window, expressed as an offset from the policy run time. Must be greater than `refresh_start_offset`.|
|`compress_after`|`INTERVAL` or `INTEGER`|Continuous aggregate chunks are compressed if they exclusively contain data older than this interval.|
|`drop_after`|`INTERVAL` or `INTEGER`|Continuous aggregate chunks are dropped if they exclusively contain data older than this interval.|

For arguments that could be either an `INTERVAL` or an `INTEGER`, use an
`INTERVAL` if your time bucket is based on timestamps. Use an `INTEGER` if your
time bucket is based on integers.

## Returns

Returns true if successful.

## Sample usage

Given a continuous aggregate named `example_continuous_aggregate` with an
existing compression policy, alter the compression policy to compress data older
than 16 days:

```sql
SELECT timescaledb_experimental.alter_policies(
    'continuous_agg_max_mat_date',
    compress_after => '16 days'::interval
);
```
