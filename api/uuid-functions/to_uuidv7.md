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

Create a UUIDv7 object from a Postgres timestamp and random bits. 

`ts` is converted to a UNIX timestamp split into millisecond and sub-millisecond parts.

![UUIDv7 microseconds](https://assets.timescale.com/docs/images/uuidv7-structure-microseconds.svg)

## Samples

```sql
SELECT to_uuidv7(ts)
FROM generate_series('2025-01-01:00:00:00'::timestamptz, '2025-01-01:00:00:03'::timestamptz, '1 microsecond'::interval) ts;
```

## Arguments

| Name | Type             | Default | Required | Description                                      |
|-|------------------|-|----------|--------------------------------------------------|
|`ts`|TIMESTAMPTZ| - | ✔ | The timestamp used to return a UUIDv7 object |