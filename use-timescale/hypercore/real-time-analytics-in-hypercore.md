---
title: Optimize your data for real-time analytics
excerpt: Reduce your chunk size by up to 98% and speed up your queries by automatically converting data between the rowstore and columnstore
products: [cloud, mst, self_hosted]
keywords: [hyperscore, hypertable, compression, row-columnar storage, hypercore]
---

import PrereqCloud from "versionContent/_partials/_prereqs-cloud-only.mdx";
import HCConversionOverview from "versionContent/_partials/_hypercore-conversion-overview.mdx";
import HCPolicyWorkflow from "versionContent/_partials/_hypercore_policy_workflow.mdx";
import EarlyAccess from "versionContent/_partials/_early_access_2_18_0.mdx";
import HypercoreIntroShort from "versionContent/_partials/_hypercore-intro-short.mdx";

# Optimize your data for real-time analytics 

<HypercoreIntroShort />

<HCConversionOverview />

For an in-depth explanation of how $HYPERTABLEs and $HYPERCORE work, see the [Data model][data-model].

This page shows you how to get the best results when you set a policy to automatically convert $CHUNKs in a $HYPERTABLE 
from the $ROWSTORE to the $COLUMNSTORE.

## Prerequisites

<PrereqCloud />

The code samples in this page use the <Tag type="download">[crypto_sample.zip](https://assets.timescale.com/docs/downloads/candlestick/crypto_sample.zip)</Tag> data from [this key features tutorial][ingest-data].   

## Optimize your data with $COLUMNSTORE policies 

The compression ratio and query performance of data in the $COLUMNSTORE is dependent on the order and structure of your 
data. Rows that change over a dimension should be close to each other. With time-series data, you `orderby` the time 
dimension. For example, `Timestamp`:

| Timestamp  | Device ID  |  Device Type |  CPU |Disk IO|
|---|---|---|---|---|
|12:00:01|A|SSD|70.11|13.4|

This ensures that records are compressed and accessed in the same order. However, you would always have to 
access the data using the time dimension, then filter all the rows using other criteria. To make your queries more 
efficient, you segment your data based on the following:

- The way you want to access it. For example, to rapidly access data about a 
single device, you `segmentby` the `Device ID` column. This enables you to run much faster analytical queries on 
data in the $COLUMNSTORE. 
- The compression rate you want to achieve. The [lower the cardinality][cardinality-blog] of the `segmentby` column, the better compression results you get.

When $TIMESCALE_DB converts a $CHUNK to the $COLUMNSTORE, it automatically creates a different schema for your 
data. It also creates and uses custom indexes to incorporate the `segmentby` and `orderby` parameters when 
you write to and read from the $COLUMNSTORE.

To set up your $HYPERCORE automation:

<HCPolicyWorkflow />

## Reference

For integers, timestamps, and other integer-like types, data is compressed using [delta encoding][delta],
[delta-of-delta][delta-delta], [simple-8b][simple-8b], and [run-length encoding][run-length]. For columns with few
repeated values, [XOR-based][xor] and [dictionary compression][dictionary] is used. For all other types,
[dictionary compression][dictionary] is used.

[cardinality-blog]: https://www.tigerdata.com/blog/what-is-high-cardinality
[data-model]: /about/:currentVersion:/whitepaper/#data-model
[delta-delta]: /use-timescale/:currentVersion:/hypercore/compression-methods/#delta-of-delta-encoding
[delta]: /use-timescale/:currentVersion:/hypercore/compression-methods/#delta-encoding
[dictionary]: /use-timescale/:currentVersion:/hypercore/compression-methods/#dictionary-compression
[ingest-data]: /getting-started/:currentVersion:/try-key-features-timescale-products/#optimize-time-series-data-in-hypertables-with-hypercore
[run-length]: /use-timescale/:currentVersion:/hypercore/compression-methods/#run-length-encoding
[simple-8b]: /use-timescale/:currentVersion:/hypercore/compression-methods/#simple-8b
[xor]: /use-timescale/:currentVersion:/hypercore/compression-methods/#xor-based-compression
