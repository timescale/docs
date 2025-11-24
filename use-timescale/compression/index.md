---
title: Compression
excerpt: With data compression, you can achieve a significant improvement in the performance of your analytical queries. Learn how to enable and benefit from data compression in TimescaleDB
products: [cloud, mst, self_hosted]
keywords: [compression, hypertables]
---
import Deprecated2180 from "versionContent/_partials/_deprecated_2_18_0.mdx";

# Compression (Superseded by [Hypercore][hypercore])

<Deprecated2180 /> Superseded by <a href="https://docs.tigerdata.com/use-timescale/latest/hypercore/">hypercore</a>. 
However, compression APIs are still supported, you do not need to migrate to the hypercore APIs.

Time-series data can be compressed to reduce the amount of storage required, and
increase the speed of some queries. This is a cornerstone feature of
$TIMESCALE_DB. When new data is added to your database, it is in the form of
uncompressed rows. $TIMESCALE_DB uses a built-in job scheduler to convert this
data to the form of compressed columns. This occurs across chunks of $TIMESCALE_DB
hypertables.


[hypercore]: /use-timescale/:currentVersion:/hypercore/
