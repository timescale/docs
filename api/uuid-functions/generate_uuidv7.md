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

Generate a UUIDv7 object based on the current time. 

The UUID contains a a UNIX timestamp split into millisecond and sub-millisecond parts, followed by
random bits.


![UUIDv7 microseconds][uuidv7-microseconds]

You can use this function to generate a time-ordered series of UUIDs
suitable for use in a time-partitioned column in TimescaleDB.

## Samples


- **Generate a UUIDv7 object based on the current time**

    ```sql
    postgres=# SELECT generate_uuidv7();
               generate_uuidv7
    --------------------------------------
     019913ce-f124-7835-96c7-a2df691caa98
    ```

- **Insert a generated UUIDv7 object**

    ```sql
    INSERT INTO alerts VALUES (generate_uuidv7(), 'high CPU');
    ```

[uuidv7-microseconds]: https://assets.timescale.com/docs/images/uuidv7-structure-microseconds.svg
