---
title: Manage tiering
excerpt: How to enable the object storage tier
products: [cloud]
keywords: [tiered storage]
tags: [storage, data management]
cloud_ui:
    path:
        - [services, :serviceId, overview]
---

# Manage tiering

You use tiered storage to save on storage costs. Specifically, you can migrate rarely used data from Timescale's standard high-performance storage
to the object storage. With tiered storage enabled, you then either manually tier and untier data, or create tiering policies.

## Enable tiered storage

You enable tiered storage from the `Overview` tab in Console.

<Procedure>

### Enable tiered storage

1.  In Timescale Console, from the `Services` list, click the name of
    the service you want to modify.
1.  In the `Overview` tab, locate the `Tiered Storage` card, and click
    `Enable tiered storage`. Confirm the action.
1.  Tiered storage can take a few seconds to turn on and once activated shows the amount of
    data that has been tiered.   

    <img class="main-content__illustration"
    src="https://assets.timescale.com/docs/images/enable-data-tiering-ga.png"
    width={1375} height={944}
    alt="The Timescale Console showing tiered storage enabled" />

</Procedure>


## Automate tiering with policies

To automate the archival of data not actively accessed, create a tiering policy that
automatically moves data to the object storage tier. Any chunks that only contain data
older than the `move_after` threshold are moved. This works similarly to a
[data retention policy](https://docs.timescale.com/use-timescale/latest/data-retention/), but chunks are moved rather than deleted.

The tiering policy schedules a job that runs periodically to migrate
eligible chunks. The migration is asynchronous.
The chunks are tiered once they appear in the `timescaledb_osm.tiered_chunks` view.
Tiering does not influence your ability to query the chunks.

To add a tiering policy, call the `add_tiering_policy` function:

```sql
SELECT add_tiering_policy(hypertable REGCLASS, move_after INTERVAL, if_not_exists BOOL = false);
```

You can add a tiering policy to hypertables and continuous aggregates. In the following example, you tier chunks that are more than three days old in the `example` hypertable.

<Procedure>

### Add a tiering policy

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

### Remove a tiering policy

1. At the psql prompt, select the hypertable to remove the policy from:

```sql
SELECT remove_tiering_policy('example');
```

</Procedure>

If you remove a tiering policy, the removal automatically prevents scheduled chunks from being tiered in the future.
Any chunks that were already tiered won't be untiered automatically. You can use the [untier_chunk][untier-data] procedure
to untier chunks to local storage that have already been tiered.

The procedure for adding and removing tiering policy for a continuous aggregate is identical to a hypertable. The following example uses a continuous aggregate called `example_day_avg`.

<Procedure>

### Add a tiering policy for a continuous aggregate

At the psql prompt, specify the continuous aggregate name and the interval after which chunks are moved to  tiered storage:

```sql
SELECT add_tiering_policy('example_day_avg', move_after => '1 month'::interval)
```

</Procedure>

<Procedure>

### Remove a tiering policy from a continuous aggregate

At the psql prompt, specify the continuous aggregate to remove the policy from:

```sql
SELECT remove_tiering_policy('example_day_avg');
```

</Procedure>


## Manually tier and untier chunks

Once tiered storage has been enabled on a service, individual chunks from a hypertable may be tiered to the object storage tier.

Before you start, you need a list of chunks to tier. In this example, you use a hypertable called example, and tier chunks older than three days.
Data on the object storage tier cannot be modified - so inserts, updates, and deletes will not work on tiered data. So make sure that
you are not tiering data that is being <b>actively modified</b> to the object storage tier

<Procedure>

### Select chunks to tier

1. At the psql prompt, select all chunks in the table `example` that are older
   than three days:

   ```sql
   SELECT show_chunks('example', older_than => INTERVAL '3 days');
   ```

1. This returns a list of chunks. Take a note of the chunk names:

   ```sql
   |1|_timescaledb_internal_hyper_1_2_chunk|
   |2|_timescaledb_internal_hyper_1_3_chunk|
   ```

</Procedure>

When you are happy with the list of chunks, you can use the `tier_chunk` function to manually tier each one.

<Procedure>

### Tier chunks manually

1. At the psql prompt, tier the chunk:

   ```sql
   SELECT tier_chunk( '_timescaledb_internal_hyper_1_2_chunk');
   ```

   Tiering a chunk is an asynchronous process that schedules the chunk to be tiered.

1. Repeat for all chunks you want to tier.

</Procedure>


<Procedure>

### List tiered chunks

<Highlight type="info">
Tiering a chunk schedules the chunk for migration to the object storage tier but, won't be tiered immediately. 
It may take some time tiering to complete. You can continue to query a chunk during migration.
</Highlight>

To see which chunks are tiered into the object storage tier, use the `tiered_chunks`
informational view:

```sql
SELECT * FROM timescaledb_osm.tiered_chunks;
```
</Procedure>

<Procedure>

### Find chunks that are scheduled to be tiered

Chunks are tiered asynchronously. Chunks are tiered one at a time in order to minimize db resource
consumption during the tiering process. You can see chunks scheduled for tiering (either by the policy or
by a manual call to `tier_chunk`) but have not yet been moved to the object storage tier using this view.

```sql
SELECT * FROM timescaledb_osm.chunks_queued_for_tiering ;
```

If you need to untier your data, see the
[manually untier data][untier-data] section.

</Procedure>

<Procedure>

#### Untier data in a chunk

Tiered data is stored on our object storage tier. Tiered data is immutable, and cannot
be changed. To update data in a tiered chunk, you need to move it back to local storage (Timescale's standard high-performance storage tier).
This is called untiering the data. You can untier data in a chunk using the `untier_chunk` stored procedure.

Untiering chunks is a synchronous process that occurs when the `untier_chunk`
procedure is called. When you untier a chunk, the data is moved from the object storage tier
to local storage. Chunks are renamed when the data is untiered.

1.  At the `psql` prompt, check which chunks are currently tiered:

    ```sql
    SELECT * FROM timescaledb_osm.tiered_chunks ;
    ```

    The output looks something like this:

    ```sql
     hypertable_schema | hypertable_name |    chunk_name    |      range_start       |       range_end
    -------------------+-----------------+------------------+------------------------+------------------------
    public            | sample          | _hyper_1_1_chunk | 2023-02-16 00:00:00+00 | 2023-02-23 00:00:00+00
    (1 row)
    ```

1.  Run `untier_chunk`:

    ```sql
    CALL untier_chunk('_hyper_1_1_chunk');
    ```

1.  You can see the details of the chunk with the
    `timescaledb_information.chunks` function. The chunk might have changed name
    when it was untiered:

    ```sql
    SELECT * FROM timescaledb_information.chunks;
    ```

    The output looks something like this:

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



## Disable tiering on a hypertable

If you no longer want to use tiered storage for a particular hypertable, you
can drop the associated metadata by calling the `disable_tiering` function.

<Procedure>

### Disable tiering 

1. Call [remove_tiering_policy][tiering-policy] and drop any tiering policy associated with this hypertable.

1. Make sure that there is no tiered data associated with this hypertable:

    1. List the tiered chunks associated with this hypertable:
       ```sql
       select * from timescaledb_osm.tiered_chunks 
       ```

    1. If you have any tiered chunks, either untier this data, or drop these chunks from tiered storage.

       You can use the [untier_chunk][untier-data] procedure to untier chunks that have already been tiered to local storage.

1. Use `disable_tiering` to drop all tiering related metadata for the hypertable:

   ```sql
   select disable_tiering('my_hypertable_name');
   ```

1. Verify that tiering has been disabled by listing the hypertables that have tiering enabled.
   ```sql
   select * from timescaledb_osm.tiered_hypertables;
   ```

</Procedure>

And that is it, you have disabled tiering on a hypertable.

[untier-data]: /use-timescale/:currentVersion:/data-tiering/untier-data/
[tiering-policy]: /use-timescale/:currentVersion:/data-tiering/creating-data-tiering-policy/