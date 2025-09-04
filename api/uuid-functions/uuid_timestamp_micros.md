---
api_name: uuid_timestamp_micros()
excerpt: Extract a PostgreSQL timestamp with microsecond precision from a version 7 UUID
topics: [uuid]
keywords: [uuid]
tags: [uuid, partitioning, events]
api:
  license: community
  type: function
products: [cloud, mst, self_hosted]
---

# uuid_timestamp_micros() <Tag type="Community">Community</Tag>

Extract a PostgreSQL timestamp with time zone from a version 7
UUID. The UUID contains a millisecond unix timestamp and an optional
sub-millisecond fraction. Unlike `uuid_timestamp`, the microsecond
part is used to construct a PostgreSQL timestamp with microsecond
precision.

Unless the UUID is known to encode a valid sub-millisecond fraction,
use `uuid_timestamp` instead.

## Samples

```sql
postgres=# SELECT uuid_timestamp_micros('019913ce-f124-7835-96c7-a2df691caa98');
     uuid_timestamp_micros
-------------------------------
 2025-09-04 10:19:13.316512+02
```

### Required arguments

|Name|Type|Description|
|---|---|---|
|`uuid`|UUID|The version 7 UUID to extract a timestamp from|
