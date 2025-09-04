---
api_name: uuid_timestamp()
excerpt: Extract a PostgreSQL timestamp from a version 7 UUID
topics: [uuid]
keywords: [uuid]
tags: [uuid, partitioning, events]
api:
  license: community
  type: function
products: [cloud, mst, self_hosted]
---

# uuid_timestamp() <Tag type="Community">Community</Tag>

Extract a PostgreSQL timestamp with time zone from a version 7
UUID. The UUID contains a millisecond unix timestamp and an optional
sub-millisecond fraction. Only the millisecond part is used to
construct the PostgreSQL timestamp.

To include the optional sub-millisecond fraction in the returned
timestamp, use `uuid_timestamp_micros`.

## Samples

```sql
postgres=# SELECT uuid_timestamp('019913ce-f124-7835-96c7-a2df691caa98');
       uuid_timestamp
----------------------------
 2025-09-04 10:19:13.316+02
```

### Required arguments

|Name|Type|Description|
|---|---|---|
|`uuid`|UUID|The version 7 UUID to extract a timestamp from|
