---
title: Compression
excerpt: Compress your data
products: [cloud]
keywords: [compression]
layout_components: [next_prev_large]
content_group: Getting started
---

import CompressionIntro from "versionContent/_partials/_compression-intro.mdx";
import UsageBasedStorage from "versionContent/_partials/_usage-based-storage-intro.mdx";

# Compression

<CompressionIntro />

You can turn on an automated compression policy for your data. Timescale
automatically determines what kind of data you are compressing, and then
compresses the data using a suitable method as your data ages. In this section,
you enable a compression policy on your data, to help you save disk space.

<UsageBasedStorage />

In this section, you create a compression policy on a single hypertable, to
automatically compresses data more than seven days old.

## Create a compression policy

By default, Timescale orders your data by the time column before it is
compressed, so you do not need to tell it to do so. However, you can also set
how you want the data to be segmented before compression, which is useful
depending on the type of queries you want to do. If you want to find out more
about how `ORDER_BY` and `SEGMENT_BY` works for compression, see the [compression section][compression-design].

In this section, you start by altering the `stocks_real_time srt` table by declaring which column you want to segment by. In this example, the data is ordered by time, and segmented by stock symbol:

<CodeBlock canCopy={false} showLineNumbers={false} children={`
ALTER TABLE stocks_real_time srt SET (
  timescaledb.compress,
  timescaledb.compress_segmentby = 'symbol'
);
`} />

When you have done that, you can enable the compression policy by declaring the
interval to use:

<CodeBlock canCopy={false} showLineNumbers={false} children={`
SELECT add_compression_policy('stocks_real_time srt', INTERVAL '7 days');
`} />

<Procedure>

### Creating a compression policy

1.  At the `psql` prompt, alter the table:

    ```sql
    ALTER TABLE stocks_real_time srt SET (
      timescaledb.compress,
      timescaledb.compress_segmentby = 'symbol'
    );
    ```

1.  Add a compression policy to compress chunks that are older than seven days:

    ```sql
    SELECT add_compression_policy('stocks_real_time srt', INTERVAL '7 days');
    ```

</Procedure>

For more information about how compression work, see the
[compression section][compression].

[compression]: /use-timescale/:currentVersion:/compression/
[compression-design]: /use-timescale/:currentVersion:/compression/about-compression

<!-- Update the compression-design link to go to the compression-design page, when PR#2664 merges --LKB 20230906 -->
