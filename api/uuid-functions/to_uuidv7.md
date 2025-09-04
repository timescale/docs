---
api_name: to_uuidv7()
excerpt: Create a version 7 UUID from a PostgreSQL timestamp
topics: [uuid]
keywords: [uuid]
tags: [uuid, partitioning, events]
api:
  license: community
  type: function
products: [cloud, mst, self_hosted]
---

# to_uuidv7() <Tag type="Community">Community</Tag>

Create a version 7 UUID from a PostgreSQL timestamp and random
bits. The PostgreSQL timestamp is converted to a UNIX timestamp which
is split into milliseconds and sub-milliseconds parts.

## Samples

```sql
SELECT to_uuidv7(ts)
FROM generate_series('2025-01-01:00:00:00'::timestamptz, '2025-01-01:00:00:03'::timestamptz, '1 microsecond'::interval) ts;
```

### Required arguments

|Name|Type|Description|
|---|---|---|
|`ts`|TIMESTAMPTZ|The timestamp to use in the UUID|
