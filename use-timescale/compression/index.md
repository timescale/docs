---
title: Compression
excerpt: Learn how compression works in Timescale
products: [cloud, mst, self_hosted]
keywords: [compression, hypertables]
---

# Compression

Time-series data can be compressed to reduce the amount of storage required, and
increase the speed of some queries. This is a cornerstone feature of
Timescale. When new data is added to your database, it is in the form of
uncompressed rows. TimescaleDB uses a built-in job scheduler to convert this
data to the form of compressed columns. This occurs across chunks of Timescale
hypertables.

*   [Manually compress][manual-compression] specific chunks.
*   [Decompress chunks][decompress-chunks] to manually decompress specific chunks.
*   [Backfill historical data][backfill-historical] to insert a batch of data
    into a compressed chunk.
*   [Modify schema][modify-schema] to modify the table definition for a
    hypertable with compressed chunks.
*   [Troubleshoot][compression-tshoot] compression.

<Highlight type="warning">
Compression alters data on your disk, so always back up before you start.
</Highlight>

[backfill-historical]: /use-timescale/:currentVersion:/compression/backfill-historical-data
[decompress-chunks]: /use-timescale/:currentVersion:/compression/decompress-chunks
[manual-compression]: /use-timescale/:currentVersion:/compression/manually-compress-chunks
[modify-schema]: /use-timescale/:currentVersion:/compression/modify-a-schema
[compression-tshoot]: /use-timescale/:currentVersion:/compression/troubleshooting/
