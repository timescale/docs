---
api_name: generate_uuidv7()
excerpt: Generate a version 7 UUID based on current time
topics: [uuid]
keywords: [uuid]
tags: [uuid, partitioning, events]
api:
  license: community
  type: function
products: [cloud, mst, self_hosted]
---

# generate_uuidv7() <Tag type="Community">Community</Tag>

Generate a version 7 UUID based on current time. The UUID contains a
millisecond unix timestamp and a sub-millisecond fraction, followed by
random bits.

The function can be used to generate a time-ordered series of UUIDs
suitable for use in a time-partitioned column in TimescaleDB.

## Samples

```sql
postgres=# SELECT generate_uuidv7();
           generate_uuidv7
--------------------------------------
 019913ce-f124-7835-96c7-a2df691caa98
```

Insert a generated version 7 UUID:

```sql
INSERT INTO alerts VALUES (generate_uuidv7(), 'high CPU');
```
