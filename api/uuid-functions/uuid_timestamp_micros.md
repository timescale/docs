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

Extract a [Postgres timestamp with time zone][postgres-date-time] from a UUIDv7 object.
`uuid` contains a millisecond unix timestamp and an optional sub-millisecond fraction. 


![UUIDv7 microseconds](https://assets.timescale.com/docs/images/uuidv7-structure-microseconds.svg)

Unlike [`uuid_timestamp`][uuid_timestamp], the microsecond part of `uuid` is used to construct a 
Postgres timestamp with microsecond precision.

Unless `uuid` is known to encode a valid sub-millisecond fraction, use [`uuid_timestamp`][uuid_timestamp].

## Samples

```sql
postgres=# SELECT uuid_timestamp_micros('019913ce-f124-7835-96c7-a2df691caa98');
```
Returns something like:
```terminaloutput
uuid_timestamp_micros
-------------------------------
 2025-09-04 10:19:13.316512+02
```

## Arguments

| Name | Type             | Default | Required | Description                                     |
|-|------------------|-|----------|-------------------------------------------------|
|`uuid`|UUID| - | ✔ | The UUID object to extract the timestamp from |

[uuid_timestamp]: /api/:currentVersion:/uuid-functions/uuid_timestamp/
[postgres-date-time]: https://www.postgresql.org/docs/current/datatype-datetime.html
