---
api_name: hypertable_detailed_size()
excerpt: Get detailed information about disk space used by a hypertable
topics: [hypertables]
keywords: [hypertables, information]
tags: [statistics, size, disk space]
api:
  license: apache
  type: function
---

# hypertable_detailed_size()

Get detailed information about disk space used by a hypertable or
continuous aggregate, returning size information for the table
itself, any indexes on the table, any toast tables, and the total
size of all. All sizes are reported in bytes. If the function is
executed on a distributed hypertable, it returns size information
as a separate row per node, including the access node.

<Highlight type="note">
When a continuous aggregate name is provided, the function
transparently looks up the backing hypertable and returns its statistics
instead.
</Highlight>

For more information about using hypertables, including chunk size partitioning,
see the [hypertable section][hypertable-docs].

### Required arguments

|Name|Type|Description|
|---|---|---|
| `hypertable` | REGCLASS | Hypertable or continuous aggregate to show detailed size of. |

### Returns

|Column|Type|Description|
|-|-|-|
|table_bytes|BIGINT|Disk space used by main_table (like `pg_relation_size(main_table)`)|
|index_bytes|BIGINT|Disk space used by indexes|
|toast_bytes|BIGINT|Disk space of toast tables|
|total_bytes|BIGINT|Total disk space used by the specified table, including all indexes and TOAST data|
|node_name|TEXT|For distributed hypertables, this is the user-given name of the node for which the size is reported. `NULL` is returned for the access node and non-distributed hypertables.|

<Highlight type="note">
If executed on a relation that is not a hypertable, the function
returns `NULL`.
</Highlight>

### Sample usage

Get the size information for a hypertable.

```sql
-- disttable is a distributed hypertable --
SELECT * FROM hypertable_detailed_size('disttable') ORDER BY node_name;

 table_bytes | index_bytes | toast_bytes | total_bytes |  node_name
-------------+-------------+-------------+-------------+-------------
       16384 |       40960 |           0 |       57344 | data_node_1
        8192 |       24576 |           0 |       32768 | data_node_2
           0 |        8192 |           0 |        8192 |

```

The access node is listed without a user-given node name. Normally,
the access node holds no data, but still maintains, for example, index
information that occupies a small amount of disk space.

[hypertable-docs]: /use-timescale/:currentVersion:/hypertables/
