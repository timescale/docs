---
title: Compress your data using hypercore
excerpt: Compress a sample dataset with Timescale Cloud to store the financial data more efficiently
products: [cloud, self_hosted, mst]
keywords: [tutorials, finance, learn]
tags: [tutorials, beginner]
layout_components: [next_prev_large]
content_group: Analyze financial tick data
---

import TutorialsHypercoreIntro from "versionContent/_partials/_tutorials-hypercore-intro.mdx"

# Compress your data using $HYPERCORE

<TutorialsHypercoreIntro />

## Optimize your data in the $COLUMNSTORE

To compress the data in the `crypto_ticks` table, do the following:

<Procedure>

1. Connect to your $SERVICE_LONG

   In [$CONSOLE][services-portal] open an [SQL editor][in-console-editors]. The in-Console editors display the query speed.
   You can also connect to your service using [psql][connect-using-psql].

1. Convert data to the $COLUMNSTORE:

   You can do this either automatically or manually:
   - [Automatically convert chunks][add_columnstore_policy] in the $HYPERTABLE to the $COLUMNSTORE at a specific time interval:

       ```sql 
      CALL add_columnstore_policy('crypto_ticks', after => INTERVAL '1d');
       ```

   - [Manually convert all chunks][convert_to_columnstore] in the $HYPERTABLE to the $COLUMNSTORE:

       ```sql
       CALL convert_to_columnstore(c) from show_chunks('crypto_ticks') c;
       ```
     
1.  Now that you have converted the chunks in your $HYPERTABLE to the $COLUMNSTORE, compare the
    size of the dataset before and after compression:

    ```sql
    SELECT 
        pg_size_pretty(before_compression_total_bytes) as before,
        pg_size_pretty(after_compression_total_bytes) as after
     FROM hypertable_columnstore_stats('crypto_ticks');
    ```

    This shows a significant improvement in data usage:

    ```sql
    before | after 
    --------+-------
    694 MB | 75 MB
    (1 row)
    ```

</Procedure>


## Take advantage of query speedups

Previously, data in the $COLUMNSTORE was segmented by the `block_id` column value.
This means fetching data by filtering or grouping on that column is
more efficient. Ordering is set to time descending. This means that when you run queries
which try to order data in the same way, you see performance benefits.

<Procedure>

1. Connect to your $SERVICE_LONG

   In [$CONSOLE][services-portal] open an [SQL editor][in-console-editors]. The in-Console editors display the query speed.

1. Run the following query:

   ```sql
   SELECT
       time_bucket('1 day', time) AS bucket,
       symbol,
       FIRST(price, time) AS "open",
       MAX(price) AS high,
       MIN(price) AS low,
       LAST(price, time) AS "close",
       LAST(day_volume, time) AS day_volume
   FROM crypto_ticks
   GROUP BY bucket, symbol;
   ```

   Performance speedup is of two orders of magnitude, around 15 ms when compressed in the $COLUMNSTORE and
   1 second when decompressed in the $ROWSTORE.

</Procedure>


[hypercore]: /use-timescale/:currentVersion:/hypercore/
[in-console-editors]: /getting-started/:currentVersion:/run-queries-from-console/
[services-portal]: https://console.cloud.timescale.com/dashboard/services
[connect-using-psql]: /integrations/:currentVersion:/psql#connect-to-your-service
[add_columnstore_policy]: /api/:currentVersion:/hypercore/add_columnstore_policy/
[convert_to_columnstore]: /api/:currentVersion:/hypercore/convert_to_columnstore/
