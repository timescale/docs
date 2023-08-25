---
title: Compression
excerpt: Learn how compression works in Timescale
products: [cloud, mst, self_hosted]
keywords: [compression, hypertables]
---

import UsageBasedStorage from "versionContent/_partials/_usage-based-storage-intro.mdx";

# Compression

Time-series data can be compressed to reduce the amount of storage required, and
increase the speed of some queries. This is a cornerstone feature of
Timescale. When new data is added to your database, it is in the form of
uncompressed rows. Timescale uses a built-in job scheduler to convert this
data to the form of compressed columns. This occurs across chunks of Timescale
hypertables.

<UsageBasedStorage />

[backfill-historical]: /use-timescale/:currentVersion:/compression/backfill-historical-data/
[decompress-chunks]: /use-timescale/:currentVersion:/compression/decompress-chunks/
[modify-schema]: /use-timescale/:currentVersion:/compression/modify-a-schema/
[compression-tshoot]: /use-timescale/:currentVersion:/compression/troubleshooting/
