---
title: Untier data
excerpt: How to untier Timescale Cloud data
product: cloud
keywords: [data tiering, untiering]
tags: [storage, data management]
cloud_ui:
    path:
        - [services, :serviceID, operations, data-tiering]
---

import ExperimentalPrivateBeta from 'versionContent/_partials/_experimental-private-beta.mdx';
import TieringBeta from 'versionContent/_partials/_cloud-data-tiering-beta.mdx';

# Untier data

If you need to update data in a tiered chunk, or if you want to enable faster
queries, you can untier the data in the chunk.

<ExperimentalPrivateBeta />
<TieringBeta />

## Untier data in a chunk

When you have untiered a chunk, an entry is added to the corresponding table. A
temporary table is created, and data is loaded into it using SQL. This invokes a
function in the TimescaleDB extension to remount the untiered chunk to the
hypertable.

<Highlight type="important">
When you untier a chunk, the data is not removed from storage. The data remains
stored in the same place, but it is no longer marked as tiered.
</Highlight>

<procedure>

### Untiering data in a chunk

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
    SELECT untier_chunk('_hyper_1_1_chunk');
    ```

1.  If the untiering operation is successful, an entry is added to the table,
    like this:

    ```sql
      osm_chunk_name  |          time_stamp
    ------------------+-------------------------------
     _hyper_1_1_chunk | 2023-02-14 12:38:56.557034+00
    (1 row)
    ```

</procedure>
