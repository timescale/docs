---
api_name: ALTER TABLE (Compression)
excerpt: Change compression settings on a compressed hypertable
topics: [compression]
keywords: [compression]
tags: [settings, hypertables, alter, change]
api:
  license: community
  type: command
---

# ALTER TABLE (Compression) <Tag type="community" content="community" />

'ALTER TABLE' statement is used to turn on compression and set compression
options.  

By itself, this `ALTER` statement alone does not compress a hypertable. To do so, either create a
compression policy using the [add_compression_policy][add_compression_policy] function or manually
compress a specific hypertable chunk using the [compress_chunk][compress_chunk] function.

The syntax is:

``` sql
ALTER TABLE <table_name> SET (timescaledb.compress,
   timescaledb.compress_orderby = '<column_name> [ASC | DESC] [ NULLS { FIRST | LAST } ] [, ...]',
   timescaledb.compress_segmentby = '<column_name> [, ...]',
   timescaledb.compress_chunk_time_interval='interval'
);
```

## Required arguments

|Name|Type|Description|
|-|-|-|
|`timescaledb.compress`|BOOLEAN|Enable or disable compression|

## Optional arguments

|Name|Type|Description|
|-|-|-|
|`timescaledb.compress_orderby`|TEXT|Order used by compression, specified in the same way as the ORDER BY clause in a SELECT query. The default is the descending order of the hypertable's time column.|
|`timescaledb.compress_segmentby`|TEXT|Column list on which to key the compressed segments. An identifier representing the source of the data such as `device_id` or `tags_id` is usually a good candidate. The default is no `segment by` columns.|
|`timescaledb.compress_chunk_time_interval`|TEXT|EXPERIMENTAL: Set compressed chunk time interval used to roll chunks into. This parameter compresses every chunk, and then irreversibly merges it into a previous adjacent chunk if possible, to reduce the total number of chunks in the hypertable. Note that chunks will not be split up during decompression. It should be set to a multiple of the current chunk interval. This option can be changed independently of other compression settings and does not require the `timescaledb.compress` argument.|

## Parameters

|Name|Type|Description|
|-|-|-|
|`table_name`|TEXT|Hypertable that supports compression|
|`column_name`|TEXT|Column used to order by or segment by|
|`interval`|TEXT|Time interval used to roll compressed chunks into|

## Sample usage

Configure a hypertable that ingests device data to use compression. Here, if the hypertable
is often queried about a specific device or set of devices, the compression should be
segmented using the `device_id` for greater performance.

```sql
ALTER TABLE metrics SET (timescaledb.compress, timescaledb.compress_orderby = 'time DESC', timescaledb.compress_segmentby = 'device_id');
```

You can also specify compressed chunk interval without changing other
compression settings:

```sql
ALTER TABLE metrics SET (timescaledb.compress_chunk_time_interval = '24 hours');
```

To disable the previously set option, set the interval to 0:

```sql
ALTER TABLE metrics SET (timescaledb.compress_chunk_time_interval = '0');
```

[add_compression_policy]: /api/:currentVersion:/compression/add_compression_policy/
[compress_chunk]: /api/:currentVersion:/compression/compress_chunk/
