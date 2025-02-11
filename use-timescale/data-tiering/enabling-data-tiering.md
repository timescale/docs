---
title: Manage tiering
excerpt: How to enable and use object storage tiering
products: [cloud]
keywords: [tiered storage]
tags: [storage, data management]
cloud_ui:
    path:
        - [services, :serviceId, overview]
---

# Manage automated and manual tiering

You use tiered storage to save on storage costs. Specifically, you can migrate rarely used data from 
Timescale's standard high-performance storage to the object storage. After you 
[enable tiered storage][enable-tiered-storage], you then either [create automated tiering policies][tiering-policies] 
or [manually tier and untier data][manual-tier].

You can query the data on the object storage tier, but you cannot modify it. Make sure that you are not tiering data that needs to be **actively modified**.

## Enable tiered storage

You enable tiered storage from the `Overview` tab in Console.

<Procedure>

1. **In [Timescale Console][console], select the service to modify**.

    You see the `Overview` section.

1. **Scroll down, then click `Enable tiered storage`**.

   ![Enable tiered storage](https://assets.timescale.com/docs/images/console-enable-tiered-storage.png)

   When tiered storage is enabled, you see the amount of data in the tiered object storage.

</Procedure>

<Highlight type="note">

Data tiering is available in [Scale and Enterprise][pricing-plans] pricing plans only.

</Highlight>

## Automate tiering with policies

A tiering policy automatically moves any chunks that only contain data
older than the `move_after` threshold to the object storage tier. This works similarly to a
[data retention policy][data-retention], but chunks are moved rather than deleted. 

A tiering policy schedules a job that runs periodically to asynchronously migrate eligible chunks to object storage. Chunks are considered tiered once they appear in the `timescaledb_osm.tiered_chunks` view. 

You can add tiering policies to [hypertables][hypertable], including [continuous aggregates][caggs]. To manage tiering policies, [connect to your service][connect-to-service] and run the queries below in the data mode, the SQL editor, or using `psql`.

### Add a tiering policy

To add a tiering policy, call `add_tiering_policy`:

```sql
SELECT add_tiering_policy(hypertable REGCLASS, move_after INTERVAL, if_not_exists BOOL = false);
```

For example, to tier chunks that are more than three days old in the `example` [hypertable][hypertable]:

```sql
SELECT add_tiering_policy('example', INTERVAL '3 days');
```

By default, a tiering policy runs hourly on your database. To change this interval, call `alter_job`.

### Remove a tiering policy

To remove an existing tiering policy, call `remove_tiering_policy`:

```sql
SELECT remove_tiering_policy(hypertable REGCLASS, if_exists BOOL = false);
```

For example, to remove the tiering policy from the `example` hypertable:

```sql
SELECT remove_tiering_policy('example');
```

If you remove a tiering policy, the remaining scheduled chunks are not tiered. However, chunks in tiered storage are not untiered. You [untier chunks manually][manual-tier] to local storage.

## Manually tier and untier chunks

If tiering policies do not meet your current needs, you can tier and untier chunks manually. To do so, [connect to your service][connect-to-service] and run the queries below in the data mode, the SQL editor, or using `psql`.

### Tier chunks

Tiering a chunk is an asynchronous process that schedules the chunk to be tiered. In the following example, you tier chunks older than three days in the `example` hypertable. You then list the tiered chunks.

<Procedure>

1. **Select all chunks in `example` that are older than three days:**

   ```sql
   SELECT show_chunks('example', older_than => INTERVAL '3 days');
   ```

   This returns a list of chunks. Take a note of the chunk names:

   ```sql
   |1|_timescaledb_internal_hyper_1_2_chunk|
   |2|_timescaledb_internal_hyper_1_3_chunk|
   ```

1. **Call `tier_chunk` to manually tier each chunk:**

   ```sql
   SELECT tier_chunk( '_timescaledb_internal_hyper_1_2_chunk');
   ```

1. **Repeat for all chunks you want to tier.**

   Tiering a chunk schedules it for migration to the object storage tier, but the migration won't happen immediately. Chunks are tiered one at a time in order to minimize database resource consumption. A chunk is marked as migrated and deleted from the standard storage only after it has been durably stored in the object storage tier. You can continue to query a chunk during migration.

1. **To see which chunks are tiered into the object storage tier, use the `tiered_chunks` informational view:**

    ```sql
    SELECT * FROM timescaledb_osm.tiered_chunks;
    ```

</Procedure>

To see which chunks are scheduled for tiering either by policy or by a manual call, but have not yet been tiered, use this view:

```sql
SELECT * FROM timescaledb_osm.chunks_queued_for_tiering ;
```

### Untier chunks

To update data in a tiered chunk, move it back to the standard high-performance storage tier in $CLOUD_LONG. Untiering chunks is a synchronous process. Chunks are renamed when the data is untiered.

To untier a chunk, call the `untier_chunk` stored procedure.

<Procedure>

1.  **Check which chunks are currently tiered:**

    ```sql
    SELECT * FROM timescaledb_osm.tiered_chunks ;
    ```

    Sample output:

    ```sql
     hypertable_schema | hypertable_name |    chunk_name    |      range_start       |       range_end
    -------------------+-----------------+------------------+------------------------+------------------------
    public            | sample          | _hyper_1_1_chunk | 2023-02-16 00:00:00+00 | 2023-02-23 00:00:00+00
    (1 row)
    ```

1.  **Call `untier_chunk`**:

    ```sql
    CALL untier_chunk('_hyper_1_1_chunk');
    ```

1.  **See the details of the chunk with `timescaledb_information.chunks`**:

    ```sql
    SELECT * FROM timescaledb_information.chunks;
    ```

    Sample output:

    ```sql
    -[ RECORD 1 ]----------+-------------------------
    hypertable_schema      | public
    hypertable_name        | sample
    chunk_schema           | _timescaledb_internal
    chunk_name             | _hyper_1_4_chunk
    primary_dimension      | ts
    primary_dimension_type | timestamp with time zone
    range_start            | 2023-02-16 00:00:00+00
    range_end              | 2020-03-23 00:00:00+00
    range_start_integer    |
    range_end_integer      |
    is_compressed          | f
    chunk_tablespace       |
    data_nodes             |
    ```

</Procedure>

## Disable tiering 

If you no longer want to use tiered storage for a particular hypertable, drop the associated metadata by calling `disable_tiering`.

<Procedure>

1. **To drop all tiering policies associated with a table, call `remove_tiering_policy`**.

1. **Make sure that there is no tiered data associated with this hypertable**:

    1. List the tiered chunks associated with this hypertable:
   
       ```sql
       select * from timescaledb_osm.tiered_chunks 
       ```

    1. If you have any tiered chunks, either untier this data, or drop these chunks from tiered storage.

1. **Use `disable_tiering` to drop all tiering-related metadata for the hypertable**:

   ```sql
   select disable_tiering('my_hypertable_name');
   ```

1. **Verify that tiering has been disabled by listing the hypertables that have tiering enabled**:

   ```sql
   select * from timescaledb_osm.tiered_hypertables;
   ```

</Procedure>

[data-retention]: /use-timescale/:currentVersion:/data-retention/
[console]: https://console.cloud.timescale.com/dashboard/services
[hypertable]: /use-timescale/:currentVersion:/hypertables/
[connect-to-service]: /getting-started/:currentVersion:/run-queries-from-console/
[caggs]: /use-timescale/:currentVersion:/continuous-aggregates/
[enable-tiered-storage]: /use-timescale/:currentVersion:/data-tiering/enabling-data-tiering/#enable-tiered-storage
[tiering-policies]: /use-timescale/:currentVersion:/data-tiering/enabling-data-tiering#automate-tiering-with-policies
[manual-tier]: /use-timescale/:currentVersion:/data-tiering/enabling-data-tiering#manually-tier-and-untier-chunks
[pricing-plans]: /about/:currentVersion:/pricing-and-account-management
