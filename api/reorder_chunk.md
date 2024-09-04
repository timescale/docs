---
api_name: reorder_chunk()
excerpt: Reorder rows in a chunk
topics: [hypertables]
keywords: [chunks, hypertables, reorder]
api:
  license: community
  type: function
---

# reorder_chunk() <Tag type="community">Community</Tag>

Reorder a single chunk's heap to follow the order of an index. This function
acts similarly to the [PostgreSQL CLUSTER command][postgres-cluster] , however
it uses lower lock levels so that, unlike with the CLUSTER command,  the chunk
and hypertable are able to be read for most of the process. It does use a bit
more disk space during the operation.

This command can be particularly useful when data is often queried in an order
different from that in which it was originally inserted. For example, data is
commonly inserted into a hypertable in loose time order (for example, many devices
concurrently sending their current state), but one might typically query the
hypertable about a _specific_ device. In such cases, reordering a chunk using an
index on `(device_id, time)` can lead to significant performance improvement for
these types of queries.

One can call this function directly on individual chunks of a hypertable, but
using [add_reorder_policy][add_reorder_policy] is often much more convenient.

### Required arguments

|Name|Type|Description|
|---|---|---|
| `chunk` | REGCLASS | Name of the chunk to reorder. |

### Optional arguments

|Name|Type|Description|
|---|---|---|
| `index` | REGCLASS | The name of the index (on either the hypertable or chunk) to order by.|
| `verbose` | BOOLEAN | Setting to true displays messages about the progress of the reorder command. Defaults to false.|

### Returns

This function returns void.

### Sample usage

```sql
SELECT reorder_chunk('_timescaledb_internal._hyper_1_10_chunk', 'conditions_device_id_time_idx');
```

runs a reorder on the `_timescaledb_internal._hyper_1_10_chunk` chunk using the `conditions_device_id_time_idx` index.

[add_reorder_policy]: /api/:currentVersion:/hypertable/add_reorder_policy/
[postgres-cluster]: https://www.postgresql.org/docs/current/sql-cluster.html
