---
title: Compression
excerpt: With data compression, you can achieve a significant improvement in the performance of your analytical queries. Learn how to enable and benefit from data compression in Timescale Cloud
products: [cloud, mst, self_hosted]
keywords: [compression, hypertables]
---
import Deprecated2180 from "versionContent/_partials/_deprecated_2_18_0.mdx";
import UsageBasedStorage from "versionContent/_partials/_usage-based-storage-intro.mdx";

# Compression  (Replaced by [Hypercore][hypercore])

<Deprecated2180 /> Replaced by <a href="https://docs.timescale.com/use-timescale/latest/hypercore/">Hypercore</a>.

Time-series data can be compressed to reduce the amount of storage required, and
increase the speed of some queries. This is a cornerstone feature of
Timescale. When new data is added to your database, it is in the form of
uncompressed rows. Timescale uses a built-in job scheduler to convert this
data to the form of compressed columns. This occurs across chunks of Timescale
hypertables.

<UsageBasedStorage />


[hypercore]: /use-timescale/:currentVersion:/hypercore/
