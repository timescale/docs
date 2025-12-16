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

Extract a Postgres timestamp with time zone from a UUIDv7 object. 

![UUIDv7 microseconds][uuidv7-microseconds]

`uuid` contains a millisecond unix timestamp and an optional sub-millisecond fraction.
This fraction is used to construct the Postgres timestamp.

To include the sub-millisecond fraction in the returned timestamp, call [`uuid_timestamp_micros`][uuid_timestamp_micros].

## Samples

```sql
postgres=# SELECT uuid_timestamp('019913ce-f124-7835-96c7-a2df691caa98');
```
Returns something like:
```terminaloutput
uuid_timestamp
----------------------------
 2025-09-04 10:19:13.316+02
```

## Arguments

| Name | Type             | Default | Required | Description                                     |
|-|------------------|-|----------|-------------------------------------------------|
|`uuid`|UUID| - | ✔ | The UUID object to extract the timestamp from |

[uuid_timestamp_micros]: /api/:currentVersion:/uuid-functions/uuid_timestamp_micros/
[uuidv7-microseconds]: https://assets.timescale.com/docs/images/uuidv7-structure-microseconds.svg
