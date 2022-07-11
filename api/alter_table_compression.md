---
api_name: ALTER TABLE (Compression)
excerpt: Change compression settings on a compressed hypertable
license: community
topic: compression
keywords: [compression]
tags: [settings, hypertables, alter, change]
---

## ALTER TABLE (Compression) <tag type="community" content="community" />

'ALTER TABLE' statement is used to turn on compression and set compression
options.

The syntax is:

``` sql
ALTER TABLE <table_name> SET (timescaledb.compress, timescaledb.compress_orderby = '<column_name> [ASC | DESC] [ NULLS { FIRST | LAST } ] [, ...]',
timescaledb.compress_segmentby = '<column_name> [, ...]'
);
```
#### Required arguments
|Name|Type|Description|
|---|---|---|
| `timescaledb.compress` | BOOLEAN | Enable/Disable compression |

#### Optional arguments
|Name|Type|Description|
|---|---|---|
| `timescaledb.compress_orderby` | TEXT |Order used by compression, specified in the same way as the ORDER BY clause in a SELECT query. The default is the descending order of the hypertable's time column. |
| `timescaledb.compress_segmentby` | TEXT |Column list on which to key the compressed segments. An identifier representing the source of the data such as `device_id` or `tags_id` is usually a good candidate. The default is no `segment by` columns. |

### Parameters
|Name|Type|Description|
|---|---|---|
| `table_name` | TEXT |Hypertable that supports compression |
| `column_name` | TEXT | Column used to order by and/or segment by |

### Sample usage
Configure a hypertable that ingests device data to use compression.

```sql
ALTER TABLE metrics SET (timescaledb.compress, timescaledb.compress_orderby = 'time DESC', timescaledb.compress_segmentby = 'device_id');
```
