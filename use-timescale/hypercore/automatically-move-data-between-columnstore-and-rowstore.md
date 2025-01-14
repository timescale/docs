---
title: Automatically convert data between the rowstore and columnstore
excerpt: Reduce your chunk size by more than 90% and speed up your queries by automatically converting data between the rowstore and columnstore.
products: [cloud,]
keywords: [hyperscore, hypertable, compression, row-columnar storage, hypercore, hyperstore]
---

# Automatically convert data between the rowstore and columnstore

The rowstore contains row-oriented tables optimized for high-speed inserts and updates. The columnstore is a 
column-oriented storage format optimized for analytics. When you [create a hypertable][create-hypertable], 
you set a primary dimension that is used to partition the table into chunks. Typically, this is the `time` column. 

You ingest `hot` data into the rowstore. With Hypercore, as data cools and becomes more suited for analytics, 
$CLOUD_LONG automatically moves these chunks of data to the columnstore when it reaches an age specified by you 
in a columnstore policy.

When you convert chunks from the rowstore to the columnstore, multiple records are grouped into a single row. 
The columns of this row hold an array-like structure that stores all the data. The columnstore holds multiple rows 
of data compressed into a single row. For example, data in the following chunk in the rowstore:

| Timestamp  | Device ID  |  Device Type |  CPU |Disk IO|
|---|---|---|---|---|
|12:00:01|A|SSD|70.11|13.4|
|12:00:01|B|HDD|69.70|20.5|
|12:00:02|A|SSD|70.12|13.2|
|12:00:02|B|HDD|69.69|23.4|
|12:00:03|A|SSD|70.14|13.0|
|12:00:03|B|HDD|69.70|25.2|

Is converted to the following row in the columnstore:

|Timestamp|Device ID|Device Type|CPU|Disk IO|
|-|-|-|-|-|
|[12:00:01, 12:00:01, 12:00:02, 12:00:02, 12:00:03, 12:00:03]|[A, B, A, B, A, B]|[SSD, HDD, SSD, HDD, SSD, HDD]|[70.11, 69.70, 70.12, 69.69, 70.14, 69.70]|[13.4, 20.5, 13.2, 23.4, 13.0, 25.2]|

Because a single row takes up less disk space, you can reduce your chunk size by more than 90%, and can also
speed up your queries. This saves on storage costs, and keeps your queries operating at lightning speed.

This page shows you how get the best results when you set a policy to automatically move chunks in a hypertable to the 
columnstore.

## Prerequisites

Before you set a policy to automatically move chunks in a hypertable to the columnstore, you must:

## Plan your hypercore schema for maximum efficiency 

When $CLOUD_LONG converts a chunk from the rowstore to the columnstore, TimescaleDB automatically creates a different 
schema for your data. Indexes set on the hypertable are used only on chunks in the rowstore. During conversion,
$TIMESCALE_DB creates and uses custom indexes to incorporate the `segmentby` and `orderby`. These parameters
are used when you read compressed data.

The compression ratio and query performance is dependent on the order and structure of the
data in the columnstore.


[create-hypertable]: /use-timescale/:currentVersion:/compression/
[add_columnstore_policy]: /api/:currentVersion:/hypercore/add_columnstore_policy/
