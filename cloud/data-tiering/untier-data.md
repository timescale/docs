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

import ExperimentalPrivateBeta from 'versionContent/_partials/_early_access.mdx';
import TieringBeta from 'versionContent/_partials/_cloud-data-tiering-beta.mdx';

# Untier data

Tiered data is stored on Amazon S3 storage. Data in S3 is immutable, and cannot
be changed. To update data in a tiered chunk, you need to move it back to EBS
(elastic block storage). This is called untiering the data. You can untier data
in a chunk using the `untier_chunk` stored procedure.

<ExperimentalPrivateBeta />

## Untier data in a chunk

Untiering chunks is an asynchronous process. When you untier a chunk, the data
is moved from S3 storage to EBS storage. This process occurs in the background.
The chunk remains available for queries during the migration to EBS.

<Highlight type="note">
Chunks are sometimes renamed when you untier your data.
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
    CALL untier_chunk('_hyper_1_1_chunk');
    ```

1.  You can see the details of the chunk with the
    `timescaledb_information.chunks` function. The chunk might have changed name when it was untiered:

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

</procedure>
