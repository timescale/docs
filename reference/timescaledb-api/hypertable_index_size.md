---
api_name: hypertable_index_size()
excerpt: Get the disk space used by a hypertable index
topics: [hypertables]
keywords: [hypertables, indexes, information]
tags: [disk space, size]
api:
  license: apache
  type: function
---

# hypertable_index_size()

Get the disk space used by an index on a hypertable, including the
disk space needed to provide the index on all chunks. The size is
reported in bytes.

For more information about using hypertables, including chunk size partitioning,
see the [hypertable section][hypertable-docs].

### Required arguments

|Name|Type|Description|
|-|-|-|
|`index_name`|REGCLASS|Name of the index on a hypertable|

### Returns

|Column|Type|Description|
|-|-|-|
|hypertable_index_size|BIGINT|Returns the disk space used by the index|

<Highlight type="note">
NULL is returned if the function is executed on a non-hypertable relation.
</Highlight>

### Sample usage

Get size of a specific index on a hypertable.

```sql
\d conditions_table
                     Table "public.conditions_table"
 Column |           Type           | Collation | Nullable | Default
--------+--------------------------+-----------+----------+---------
 time   | timestamp with time zone |           | not null |
 device | integer                  |           |          |
 volume | integer                  |           |          |
Indexes:
    "second_index" btree ("time")
    "test_table_time_idx" btree ("time" DESC)
    "third_index" btree ("time")

SELECT hypertable_index_size('second_index');

 hypertable_index_size
-----------------------
                163840

SELECT pg_size_pretty(hypertable_index_size('second_index'));

 pg_size_pretty
----------------
 160 kB

```

[hypertable-docs]: /use-timescale/:currentVersion:/hypertables/
