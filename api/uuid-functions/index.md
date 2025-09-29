---
title: UUIDv7 functions
excerpt: Create a hypertable partitioned by time-based UUIDv7
keywords: [jobs]
tags: [background jobs, scheduled jobs, automation framework]
products: [cloud, mst, self_hosted]
---

# UUIDv7 functions <Tag type="community">Community</Tag>


UUIDv7 is a time-ordered UUID that includes a Unix timestamp (with millisecond precision) in its first 48 bits. Like 
other UUIDs, it uses 6 bits for version and variant info, and the remaining 74 bits are random.

![UUIDv7 microseconds](https://assets.timescale.com/docs/images/uuidv7-structure-microseconds.svg)

UUIDv7 is ideal anywhere you create lots of records over time, not only observability. Advantages are:

- **No extra column required to partition by time with sortability**: you can sort UUIDv7 instances by their value. This 
   is useful for ordering records by creation time without the need for a separate timestamp column.
- **Indexing performance**: UUIDv7s increase with time, so new rows append near the end of a B-tree instead of 
   This results in fewer page splits, less fragmentation, faster inserts, and efficient time-range scans.
- **Easy keyset pagination**: `WHERE id > :cursor` and natural sharding.
- **UUID**: safe across services, replicas, and unique across distributed systems.

You use UUIDvs for events, orders, messages, uploads, runs, jobs, spans, and more.
    
## Examples

- **High-rate event logs for observability and metrics**: 

   UUIDv7 gives you globally unique IDs (for traceability) and time windows (“last hour”), without the need for a 
   separate `created_at` column. UUIDv7 create less churn because inserts land at the end of the index, and you can 
   filter by time using UUIDv7 objects.

  - Last hour:
      ```sql
      SELECT count(*) FROM logs WHERE id >= to_uuidv7_boundary(now() - interval '1 hour');
      ```
  - Keyset pagination
      ```sql
      SELECT * FROM logs WHERE id > to_uuidv7($last_seen'::timestamptz, true) ORDER BY id LIMIT 1000;
      ```

- **Workflow / durable execution runs**: 

   Each run needs a stable ID for joins and retries, and you often ask “what started since X?”. UUIDs help by serving
   both as the primary key and a time cursor across services. For example:

    ```sql
    SELECT run_id, status
    FROM runs
    WHERE run_id >= to_uuidv7_boundary(now() - interval '5 minutes')
    ```

- **Orders / activity feeds / messages (SaaS apps)**:  

    Human-readable timestamps are not mandatory in a table. However, you still need time-ordered pages and day/week ranges. 
    UUIDv7 enables clean date windows and cursor pagination with just the ID. For example:

    ```sql
    SELECT * FROM orders
    WHERE id >= to_uuidv7('2025-08-01'::timestamptz, true)
    AND id <  to_uuidv7('2025-08-02'::timestamptz, true)
    ORDER BY id;
    ```

## Functions

- [generate_uuidv7()][generate_uuidv7]: generate a version 7 UUID based on current time
- [to_uuidv7()][to_uuidv7]: create a version 7 UUID from a PostgreSQL timestamp
- [to_uuidv7_boundary()][to_uuidv7_boundary]: create a version 7 "boundary" UUID from a PostgreSQL timestamp
- [uuid_timestamp()][uuid_timestamp]: extract a PostgreSQL timestamp from a version 7 UUID
- [uuid_timestamp_micros()][uuid_timestamp_micros]: extract a PostgreSQL timestamp with microsecond precision from a version 7 UUID
- [uuid_version()][uuid_version]: extract the version of a UUID

[generate_uuidv7]: /api/:currentVersion:/uuid-functions/generate_uuidv7/
[to_uuidv7]: /api/:currentVersion:/uuid-functions/to_uuidv7/
[to_uuidv7_boundary]: /api/:currentVersion:/uuid-functions/to_uuidv7_boundary/
[uuid_timestamp]: /api/:currentVersion:/uuid-functions/uuid_timestamp/
[uuid_timestamp_micros]: /api/:currentVersion:/uuid-functions/uuid_timestamp_micros/
[uuid_version]: /api/:currentVersion:/uuid-functions/uuid_version/

