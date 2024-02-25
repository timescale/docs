---
api_name: add_policies()
excerpt: Add refresh, compression, and data retention policies on a continuous aggregate
topics: [continuous aggregates, jobs, compression, data retention]
keywords: [continuous aggregates, policies, add, compress, data retention]
api:
  license: community
  type: function
  experimental: true
---

import Experimental from "versionContent/_partials/_experimental.mdx";

<!-- markdownlint-disable-next-line line-length -->
# add_policies() <Tag type="community" content="Community" /><Tag type="experimental" content="Experimental" />

Add refresh, compression, and data retention policies to a continuous aggregate
in one step. The added compression and retention policies apply to the
continuous aggregate, _not_ to the original hypertable.

```sql
timescaledb_experimental.add_policies(
     relation REGCLASS,
     if_not_exists BOOL = false,
     refresh_start_offset "any" = NULL,
     refresh_end_offset "any" = NULL,
     compress_after "any" = NULL,
     drop_after "any" = NULL
) RETURNS BOOL
```

<Experimental />

<Highlight type="note">
`add_policies()` does not allow the `schedule_interval` for the continuous aggregate to be set, instead using a default value of 1 hour. 

If you would like to set this add your policies manually (see [`add_continuous_aggregate_policy`][add_continuous_aggregate_policy]).
</Highlight>

## Required arguments

|Name|Type|Description|
|-|-|-|
|`relation`|`REGCLASS`|The continuous aggregate that the policies should be applied to|

## Optional arguments

|Name|Type|Description|
|-|-|-|
|`if_not_exists`|`BOOL`|When true, prints a warning instead of erroring if the continuous aggregate doesn't exist. Defaults to false.|
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

Given a continuous aggregate named `example_continuous_aggregate`, add three
policies to it:

1.  Regularly refresh the continuous aggregate to materialize data between 1 day
    and 2 days old.
1.  Compress data in the continuous aggregate after 20 days.
1.  Drop data in the continuous aggregate after 1 year.

```sql
SELECT timescaledb_experimental.add_policies(
    'example_continuous_aggregate',
    refresh_start_offset => '1 day'::interval,
    refresh_end_offset => '2 day'::interval,
    compress_after => '20 days'::interval,
    drop_after => '1 year'::interval
);
```
<!-- vale Vale.Terms = NO -->
[add_continuous_aggregate_policy]: /api/:currentVersion:/continuous-aggregates/add_continuous_aggregate_policy/

<!-- vale Vale.Terms = YES -->
