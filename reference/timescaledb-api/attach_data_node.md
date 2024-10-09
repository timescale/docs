---
api_name: attach_data_node()
excerpt: Attach a data node to a distributed hypertable
topics: [distributed hypertables, multi-node]
keywords: [multi-node, distributed hypertables]
tags: [distributed hypertables, data nodes, attach]
api:
  license: community
  type: function
---

import MultiNodeDeprecation from "versionContent/_partials/_multi-node-deprecation.mdx";

<MultiNodeDeprecation />

# attach_data_node() <Tag type="community">Community</Tag>

Attach a data node to a hypertable. The data node should have been
previously created using [`add_data_node`][add_data_node].

When a distributed hypertable is created, by default it uses all
available data nodes for the hypertable, but if a data node is added
*after* a hypertable is created, the data node is not automatically
used by existing distributed hypertables.

If you want a hypertable to use a data node that was created later,
you must attach the data node to the hypertable using this
function.

### Required arguments

| Name              | Description                                   |
|-------------------|-----------------------------------------------|
| `node_name`       | Name of data node to attach             |
| `hypertable`      | Name of distributed hypertable to attach node to          |

### Optional arguments

| Name              | Description                                   |
|-------------------|-----------------------------------------------|
| `if_not_attached` | Prevents error if the data node is already attached to the hypertable. A notice is printed that the data node is attached. Defaults to `FALSE`. |
| `repartition`     | Change the partitioning configuration so that all the attached data nodes are used. Defaults to `TRUE`. |

### Returns

| Column               | Description                              |
|-------------------|-----------------------------------------------|
| `hypertable_id`      | Hypertable id of the modified hypertable |
| `node_hypertable_id` | Hypertable id on the remote data node    |
| `node_name`          | Name of the attached data node     |

### Sample usage

Attach a data node `dn3` to a distributed hypertable `conditions`
previously created with
[`create_distributed_hypertable`][create_distributed_hypertable].

```sql
SELECT * FROM attach_data_node('dn3','conditions');

hypertable_id | node_hypertable_id |  node_name
--------------+--------------------+-------------
            5 |                  3 | dn3

(1 row)
```

<Highlight type="tip">
 You must add a data node to your distributed database first
with [`add_data_node`](/api/latest/distributed-hypertables/add_data_node) first before attaching it.
</Highlight>

[add_data_node]: /api/:currentVersion:/distributed-hypertables/add_data_node/
[create_distributed_hypertable]: /api/:currentVersion:/distributed-hypertables/create_distributed_hypertable/
