---
api_name: timescaledb_experimental.policies
excerpt: Get information about all policies set on continuous aggregates
topics: [information, continuous aggregates]
keywords: [continuous aggregates, information]
tags: [policies, compress, data retention, refresh, jobs]
api:
  license: community
  type: view
  experimental: true
---

import Experimental from "versionContent/_partials/_experimental.mdx";

<!-- vale Google.Headings = NO -->
<!-- markdownlint-disable-next-line line-length -->
## timescaledb_experimental.policies <Tag type="community" content="Community" /><Tag type="experimental" content="Experimental" />
<!-- vale Google.Headings = YES -->

The `policies` view provides information on all policies set on continuous
aggregates.

<Highlight type="note">
Only policies applying to continuous aggregates are shown in this view. Policies
applying to regular hypertables or regular materialized views are not displayed.
</Highlight>

<Experimental />

### Available columns

|Column|Type|Description|
|-|-|-|
|`relation_name`|Name of the continuous aggregate|
|`relation_schema`|Schema of the continuous aggregate|
|`schedule_interval`|How often the policy job runs|
|`proc_schema`|Schema of the policy job|
|`proc_name`|Name of the policy job|
|`config`|Configuration details for the policy job|
|`hypertable_schema`|Schema of the hypertable that contains the actual data for the continuous aggregate view|
|`hypertable_name`|Name of the hypertable that contains the actual data for the continuous aggregate view|

### Sample usage

Select from the `timescaledb_experimental.policies` table to view it:

```sql
SELECT * FROM timescaledb_experimental.policies;
```

Example of the returned output:

```sql
-[ RECORD 1 ]--------------------------------------------------------------------
relation_name     | mat_m1
relation_schema   | public
schedule_interval | @ 1 hour
proc_schema       | _timescaledb_internal
proc_name         | policy_refresh_continuous_aggregate
config            | {"end_offset": 1, "start_offset", 10, "mat_hypertable_id": 2}
hypertable_schema | _timescaledb_internal
hypertable_name   | _materialized_hypertable_2
-[ RECORD 2 ]--------------------------------------------------------------------
relation_name     | mat_m1
relation_schema   | public
schedule_interval | @ 1 day
proc_schema       | _timescaledb_internal
proc_name         | policy_compression
config            | {"hypertable_id": 2, "compress_after", 11}
hypertable_schema | _timescaledb_internal
hypertable_name   | _materialized_hypertable_2
-[ RECORD 3 ]--------------------------------------------------------------------
relation_name     | mat_m1
relation_schema   | public
schedule_interval | @ 1 day
proc_schema       | _timescaledb_internal
proc_name         | policy_retention
config            | {"drop_after": 20, "hypertable_id": 2}
hypertable_schema | _timescaledb_internal
hypertable_name   | _materialized_hypertable_2
```
