---
title: Manually tier data to object storage
excerpt: How to manually tier Timescale data to object storage
products: [self_hosted]
keywords: [data tiering]
tags: [storage, data management]
---

import ExperimentalPrivateBeta from 'versionContent/_partials/_early_access.mdx';
import TieringBeta from 'versionContent/_partials/_cloud-data-tiering-beta.mdx';

# Tier data to object storage

Tier data from primary storage to object storage to save on storage costs. You
can continue to query a hypertable as normal after migration. All queries,
including `JOIN`s, work as usual.

## Manually tier a chunk

Move a single chunk to tiered S3 storage by calling the `tier_chunk` function
with the chunk name:

```sql
SELECT tier_chunk(chunk REGCLASS, if_not_tiered BOOL = false);
```

For example:

```sql
SELECT tier_chunk('_timescaledb_internal._hyper_2_3_chunk');
```

To get the chunk name, use either the [`show_chunks`][show_chunks] command or
the chunks informational view. For example:

```sql
SELECT * FROM timescaledb_information.chunks WHERE hypertable_name = 'metrics';
```

Tiering a chunk schedules the chunk for migration to object storage. You can
continue to query a chunk during migration.

## Automate chunk tiering with a data tiering policy

To automate archival of historical data, create a data tiering policy that
automatically moves data to object storage. Any chunks that only contain data
older than the `move_after` threshold are moved. This works similarly to a
[data retention policy][data-retention], but chunks are moved rather than deleted.

The data tiering policy schedules a job that runs periodically to migrate
eligible chunks. The migration is asynchronous.

To add a tiering policy, use the `add_tiering_policy` function:

```sql
SELECT add_tiering_policy(hypertable REGCLASS, move_after INTERVAL);
```

For example:

```sql
SELECT add_tiering_policy('metrics', INTERVAL '4 weeks');
```

To remove an existing tiering policy, use the `remove_tiering_policy` function:

```sql
SELECT remove_tiering_policy(hypertable REGCLASS, if_exists BOOL = false);
```

For example:

```sql
SELECT remove_tiering_policy('metrics');
```

## List tiered chunks

To see which chunks are tiered into object storage, use the `tiered_chunks`
informational view:

```sql
SELECT * FROM timescaledb_osm.tiered_chunks;
```

[data-retention]: /use-timescale/:currentVersion:/data-retention/
[show_chunks]: /api/:currentVersion:/hypertable/show_chunks/
