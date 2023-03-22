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
<TieringBeta />

## Untier data in a chunk

Untiering chunks is an asynchronous process. When you untier a chunk, the data
is moved from S3 storage to EBS storage. This process occurs in the background.
The chunk remains available for queries until the data is moved to EBS, and
becomes visible when you run the `timescaledb_information.chunks` function.

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

</procedure>
