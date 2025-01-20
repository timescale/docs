---
title: Optimize data for real-time analytics with Hypercore
excerpt: Reduce your chunk size by more than 90% and speed up your queries by automatically converting data between the rowstore and columnstore.
products: [cloud,]
keywords: [hyperscore, hypertable, compression, row-columnar storage, hypercore, hyperstore]
---

import PrereqCloud from "versionContent/_partials/_prereqs-cloud-only.mdx";
import HCConversionOverview from "versionContent/_partials/_hypercore-conversion-overview.mdx";
import HCPolicyWorkflow from "versionContent/_partials/_hypercore_policy_workflow.mdx";
import UsageBasedStorage from "versionContent/_partials/_usage-based-storage-intro.mdx";


# Optimize data for real-time analytics with Hypercore 

Hypercore is the Timescale hybrid row-columnar storage engine. The rowstore contains row-oriented tables optimized
 for high-speed inserts and updates. The columnstore is a column-oriented storage format optimized for analytics.
You ingest `hot` data into the rowstore. As data cools and becomes more suited for analytics, 
$CLOUD_LONG automatically converts these chunks of data to the columnstore. You define the moment when data is converted 
using a columnstore policy.

<HCConversionOverview />

<UsageBasedStorage />

This page shows you how get the best results when you set a policy to automatically move chunks in a hypertable to the 
columnstore.

## Prerequisites

<PrereqCloud />

This page uses the [real-time-stock-data][ingest-data] sample data in the samples.   

## Optimize your data with columnstore policies 

The compression ratio and query performance of data in the columnstore is dependent on the order and structure of your 
data. Rows that change over a dimension should be close to each other. With time-series data, you `orderby` the time 
dimension. For example, `Timestamp`:

| Timestamp  | Device ID  |  Device Type |  CPU |Disk IO|
|---|---|---|---|---|
|12:00:01|A|SSD|70.11|13.4|

This ensures that records are compressed and accessed in the same order. However, you would always have to 
access the data using the time dimension, then filter all the rows using other criteria. To make your queries more 
efficient, you segment your data based on the way you want to access it. For example, to rapidly access data about a 
single device, you `segmentby` the `Device ID` column. This enables you to run much faster analytical queries on 
data in the columnstore.

When $CLOUD_LONG converts a chunk to the columnstore, TimescaleDB automatically creates a different schema for your 
data. $TIMESCALE_DB creates and uses custom indexes to incorporate the `segmentby` and `orderby` parameters when 
you write to and read from the columstore.

To setup your Hypercore automation:

<HCPolicyWorkflow />

## Reference

For integers, timestamps, and other integer-like types, data is compressed using [delta encoding][delta],
[delta-of-delta][delta-delta], [simple-8b][simple-8b], and [run-length encoding][run-length]. For columns with few
repeated values,[XOR-based][xor] and [dictionary compression][dictionary] is used. For all other types,
[dictionary compression][dictionary] is used.



[create-hypertable]: /use-timescale/:currentVersion:/compression/
[add_columnstore_policy]: /api/:currentVersion:/hypercore/add_columnstore_policy/
[delta]: /use-timescale/:currentVersion:/compression/compression-methods/#delta-encoding
[delta-delta]: /use-timescale/:currentVersion:/compression/compression-methods/#delta-of-delta-encoding
[simple-8b]: /use-timescale/:currentVersion:/compression/compression-methods/#simple-8b
[run-length]: /use-timescale/:currentVersion:/compression/compression-methods/#run-length-encoding
[xor]: /use-timescale/:currentVersion:/compression/compression-methods/#xor-based-encoding
[dictionary]: /use-timescale/:currentVersion:/compression/compression-methods/#dictionary-compression
[ingest-data]: /getting-started/:currentVersion:/time-series-data/#ingest-the-dataset
[add_columnstore_policy]: /api/:currentVersion:/hypercore/add_columnstore_policy/
[run-job]: /api/:currentVersion:/actions/run_job/
[convert_to_rowstore]: /api/:currentVersion:/hypercore/convert_to_rowstore/
[alter_job]: /api/:currentVersion:/actions/alter_job/
[informational-views]: /api/:currentVersion:/informational-views/jobs/
[insert]: /use-timescale/:currentVersion:/write-data/insert/
[modify-data-in-the-columnstore]: /use-timescale/:currentVersion:/hypercore/modify-data-in-the-columnstore/
