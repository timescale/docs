---
api_name: show_policies()
excerpt: Show all policies that are currently set on a continuous aggregate
topics: [continuous aggregates, jobs, compression, data retention, information]
keywords: [continuous aggregates, policies, show, compress, data retention]
api:
  license: community
  type: function
  experimental: true
products: [cloud, self_hosted, mst]
---

<!-- markdownlint-disable-next-line line-length -->
# show_policies() <Tag type="community" content="Community" /><Tag type="experimental" content="Experimental" />

Show all policies that are currently set on a continuous aggregate.

<Highlight type="warning">

This experimental function will be removed in future releases. Please query the [`timescaledb_information.jobs`][informational-views] view.

</Highlight>

```sql
timescaledb_experimental.show_policies(
     relation REGCLASS
) RETURNS SETOF JSONB
```

## Samples

Given a continuous aggregate named `example_continuous_aggregate`, show all the
policies set on it:

```sql
SELECT timescaledb_experimental.show_policies('example_continuous_aggregate');
```

Example of returned data:

```bash
show_policies                                                                
--------------------------------------------------------------------------------
{"policy_name": "policy_compression", "compress_after": 11, "compress_interval": "@ 1 day"}
{"policy_name": "policy_refresh_continuous_aggregate", "refresh_interval": "@ 1 hour", "refresh_end_offset": 1, "refresh_start_offset": 10}
{"drop_after": 20, "policy_name": "policy_retention", "retention_interval": "@ 1 day"}
```

## Required arguments

|Name|Type|Description|
|-|-|-|
|`relation`|`REGCLASS`|The continuous aggregate to display policies for|

## Returns

|Column|Type|Description|
|-|-|-|
|`show_policies`|`JSONB`|Details for each policy set on the continuous aggregate|

[informational-views]: /api/:currentVersion:/informational-views/jobs/
