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

# Manage tiering

You use tiered storage to save on storage costs. Specifically, you can migrate rarely used data from Timescale's standard high-performance storage to the object storage. With tiered storage enabled, you then either create automated tiering policies or manually tier and untier data.

Data on the object storage tier cannot be modified - so inserts, updates, and deletes will not work on tiered data. Make sure that you are not tiering data that is being <b>actively modified</b> to the object storage tier.

## Enable tiered storage

You enable tiered storage from the `Overview` tab in Console.

<Procedure>

1.  In Timescale Console, from the `Services` list, click the name of
    the service you want to modify.
1.  In the `Overview` tab, locate the `Tiered Storage` card and click
    `Enable tiered storage`. Confirm the action.
1.  Tiered storage can take a few seconds to turn on and, once activated, shows the amount of
    data that has been tiered.   

    <img class="main-content__illustration"
    src="https://assets.timescale.com/docs/images/enable-data-tiering-ga.png"
    width={1375} height={944}
    alt="The Timescale Console showing tiered storage enabled" />

</Procedure>

## Automate tiering with policies

A tiering policy automatically moves data to the object storage tier. Any chunks that only contain data
older than the `move_after` threshold are moved. This works similarly to a
[data retention policy][data-retention], but chunks are moved rather than deleted. You can add tiering policies to hypertables, including continuous aggregates.

A tiering policy schedules a job that runs periodically to migrate eligible chunks. The migration is asynchronous. The chunks are considered tiered once they appear in the `timescaledb_osm.tiered_chunks` view. Tiering does not influence your ability to query the chunks.

### Add a tiering policy

To add a tiering policy, call `add_tiering_policy`:

```sql
SELECT add_tiering_policy(hypertable REGCLASS, move_after INTERVAL, if_not_exists BOOL = false);
```

For example, tier chunks that are more than three days old in the `example` hypertable in the following way: 

```sql
SELECT add_tiering_policy('example', INTERVAL '3 days');
```

### Remove a tiering policy

To remove an existing tiering policy, call `remove_tiering_policy`:

```sql
SELECT remove_tiering_policy(hypertable REGCLASS, if_exists BOOL = false);
```

For example, remove the tiering policy from the `example` hypertable in the following way:

```sql
SELECT remove_tiering_policy('example');
```

If you remove a tiering policy, new scheduled chunks will not be tiered. However, already tiered chunks won't be untiered. You can [untier chunks manually](#manually-tier-and-untier-chunks) to the local storage.

## Manually tier and untier chunks

If tiering policies do not meet your current needs, you can tier and untier chunks manually. 

### Tier chunks

Tiering a chunk is an asynchronous process that schedules the chunk to be tiered. In this example, you use a hypertable called `example` and tier chunks older than three days. You then proceed to list tiered chunks.

<Procedure>

1. At the psql prompt, select all chunks in the table `example` that are older
   than three days:

   ```sql
   SELECT show_chunks('example', older_than => INTERVAL '3 days');
   ```

    This returns a list of chunks. Take a note of the chunk names:

   ```sql
   |1|_timescaledb_internal_hyper_1_2_chunk|
   |2|_timescaledb_internal_hyper_1_3_chunk|
   ```

1. Call the `tier_chunk` function to manually tier each chunk:

   ```sql
   SELECT tier_chunk( '_timescaledb_internal_hyper_1_2_chunk');
   ```

1. Repeat for all chunks you want to tier.

1. To see which chunks are tiered into the object storage tier, use the `tiered_chunks` informational view:

    ```sql
    SELECT * FROM timescaledb_osm.tiered_chunks;
    ```

</Procedure>

Tiering a chunk schedules it for migration to the object storage tier, but the migration won't happen immediately. Chunks are tiered one at a time in order to minimize database resource consumption. You can continue to query a chunk during migration.

To see which chunks are scheduled for tiering either by policy or by a manual call, but have not yet been tiered, use this view:

```sql
SELECT * FROM timescaledb_osm.chunks_queued_for_tiering ;
```

### Untier chunks

Tiered data is immutable. To update data in a tiered chunk, move it back to local storage, that is, Timescale's standard high-performance storage tier. You can do so by using the `untier_chunk` stored procedure.

Untiering chunks is a synchronous process. Chunks are renamed when the data is untiered.

<Procedure>

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

1.  See the details of the chunk with the
    `timescaledb_information.chunks` function:

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


## Disable tiering 

If you no longer want to use tiered storage for a particular hypertable, you
can drop the associated metadata by calling the `disable_tiering` function.

<Procedure>

1. Call `remove_tiering_policy` and drop any tiering policy associated with this hypertable.

1. Make sure that there is no tiered data associated with this hypertable:

    1. List the tiered chunks associated with this hypertable:
   
       ```sql
       select * from timescaledb_osm.tiered_chunks 
       ```

    1. If you have any tiered chunks, either untier this data, or drop these chunks from tiered storage.

1. Use `disable_tiering` to drop all tiering-related metadata for the hypertable:

   ```sql
   select disable_tiering('my_hypertable_name');
   ```

1. Verify that tiering has been disabled by listing the hypertables that have tiering enabled:

   ```sql
   select * from timescaledb_osm.tiered_hypertables;
   ```

</Procedure>

[data-retention]: /use-timescale/:currentVersion:/data-retention/