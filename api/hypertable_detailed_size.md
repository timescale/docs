---
api_name: hypertable_detailed_size()
excerpt: Get detailed information about disk space used by a hypertable
license: apache
topic: hypertables
tags: [hypertables, size, disk space]
---

## hypertable_detailed_size()  

Get detailed information about disk space used by a hypertable,
returning size information for the table itself, any indexes on the
table, any toast tables, and the total size of all. All sizes are
reported in bytes. If the function is executed on a distributed
hypertable, it returns size information as a separate row per node,
including the access node.

### Required arguments

|Name|Type|Description|
|---|---|---|
| `hypertable` | REGCLASS | Hypertable to show detailed size of. |

### Returns 
|Column|Type|Description|
|---|---|---|
|table_bytes|BIGINT| Disk space used by main_table (like pg_relation_size(main_table))|
|index_bytes|BIGINT| Disk space used by indexes|
|toast_bytes|BIGINT| Disk space of toast tables|
|total_bytes|BIGINT| Total disk space used by the specified table, including all indexes and TOAST data|
|node_name| TEXT | For distributed hypertables, this is the user-given name of the node for which the size is reported. `NULL` is returned for the access node and non-distributed hypertables. |

<highlight type="tip">
If executed on a relation that is not a hypertable, the function
returns `NULL`.
</highlight>

### Sample usage 
Get size information for a hypertable.
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
the access node holds no data, but still maintains, e.g., index
information that occupies a small amount of disk space.
