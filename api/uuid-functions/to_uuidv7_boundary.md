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

Create a UUIDv7 object from a Postgres timestamp for use in range queries. 

`ts` is converted to a UNIX timestamp split into millisecond and sub-millisecond parts.

![UUIDv7 microseconds][uuidv7-microseconds]

The random bits of the UUID are set to zero in order to create a "lower" boundary UUID.

For example, you can use the returned UUIDvs to find all rows with UUIDs where the timestamp is less than the 
boundary UUID's timestamp.

## Samples

- **Create a boundary UUID from a timestamp**:

    ```sql
    postgres=# SELECT to_uuidv7_boundary('2025-09-04 11:01');
    ```
    Returns something like:
    ```terminaloutput
              to_uuidv7_boundary
    --------------------------------------
     019913f5-30e0-7000-8000-000000000000
    ```

- **Use a boundary UUID to find all UUIDs with a timestamp below `'2025-09-04 10:00'`**:

    ```sql
    SELECT * FROM uuid_events WHERE event_id < to_uuidv7_boundary('2025-09-04 10:00');
    ```

## Arguments

| Name | Type             | Default | Required | Description                                      |
|-|------------------|-|----------|--------------------------------------------------|
|`ts`|TIMESTAMPTZ| - | ✔ | The timestamp used to return a UUIDv7 object |

[uuidv7-microseconds]: https://assets.timescale.com/docs/images/uuidv7-structure-microseconds.svg
