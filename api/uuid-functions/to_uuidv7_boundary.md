---
api_name: to_uuidv7_boundary()
excerpt: Create a version 7 "boundary" UUID from a PostgreSQL timestamp
topics: [uuid]
keywords: [uuid]
tags: [uuid, partitioning, events]
api:
  license: community
  type: function
products: [cloud, mst, self_hosted]
---

# to_uuidv7_boundary() <Tag type="Community">Community</Tag>

Create a version 7 UUID from a PostgreSQL timestamp to be used in
range queries. The PostgreSQL timestamp is converted to a UNIX
timestamp which is split into milliseconds and sub-milliseconds
parts. The otherwise random bits of the UUID are set to zero in order
to create a "lower" boundary UUID that can be used to find, e.g., all
UUIDs with a timestamp less than the boundary UUID's timestamp.

## Samples

Create a boundary UUID from a timestamp:
```sql
postgres=# SELECT to_uuidv7_boundary('2025-09-04 11:01');
          to_uuidv7_boundary
--------------------------------------
 019913f5-30e0-7000-8000-000000000000
```

Use a boundary UUID to find all UUIDs with a timestamp below `'2025-09-04 10:00'`:

```sql
SELECT * FROM uuid_events WHERE event_id < to_uuidv7_boundary('2025-09-04 10:00');
```

### Required arguments

|Name|Type|Description|
|---|---|---|
|`ts`|TIMESTAMPTZ|The timestamp to use in the UUID|
