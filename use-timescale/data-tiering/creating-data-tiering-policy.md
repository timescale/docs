---
title: Creating a Data Tiering Policy
excerpt: How to create a data tiering policy
product: [ cloud ]
keywords: [ data tiering, tiering ]
tags: [ storage, data management ]
---

# Creating a data tiering policy

To automate archival of historical data, create a data tiering policy that
automatically moves data to object storage. Any chunks that only contain data
older than the `move_after` threshold are moved. This works similarly to a
[data retention policy](https://docs.timescale.com/use-timescale/latest/data-retention/), but chunks are moved rather than deleted.

The data tiering policy schedules a job that runs periodically to migrate
eligible chunks. The migration is asynchronous.
The chunks are tiered once they appear in the timescaledb_osm.tiered_chunks view.
Tiering does not influence your ability to query the chunks.

To add a tiering policy, use the `add_tiering_policy` function:

```sql
SELECT add_tiering_policy(hypertable REGCLASS, move_after INTERVAL);
```

In this example, you use a hypertable called example, and tier chunks older than three days.

<Procedure>

### Adding a tiering policy

1. At the psql prompt, select the hypertable and duration:

```sql
SELECT add_tiering_policy('example', INTERVAL '3 days');
```

</Procedure>

To remove an existing tiering policy, use the `remove_tiering_policy` function:

```sql
SELECT remove_tiering_policy(hypertable REGCLASS, if_exists BOOL = false);
```

<Procedure>

### Removing a tiering policy

1. At the psql prompt, select the hypertable to remove the policy from:

```sql
SELECT remove_tiering_policy('example');
```

</Procedure>

If you remove a tiering policy, the removal automatically prevents scheduled chunks from being tiered in the future.
Any chunks that were already tiered won't be untiered automatically. You can use the [untier_chunk][untier-data] procedure 
to untier chunks to local storage that have already been tiered.

## List tiered chunks

<Highlight type="info">
Tiering a chunk schedules the chunk for migration to object storage but, won't be tiered immediately. 
It may take some time tiering to complete. You can continue to query a chunk during migration.
</Highlight>

To see which chunks are tiered into object storage, use the `tiered_chunks`
informational view:

```sql
SELECT * FROM timescaledb_osm.tiered_chunks;
```

If you need to untier your data, see the
[manually untier data][untier-data] section.


[untier-data]: /use-timescale/:currentVersion:/data-tiering/untier-data/
