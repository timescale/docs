---
api_name: timescaledb_information.data_nodes
excerpt: Get information on data nodes in a multi-node cluster
topics: [information, multi-node]
keywords: [multi-node, information]
tags: [data nodes, cluster]
api:
  license: community
  type: view
products: [cloud, mst, self_hosted]
---

import MultiNodeDeprecation from "versionContent/_partials/_multi-node-deprecation.mdx";

# timescaledb_information.data_nodes

Get information on data nodes. This function is specific to running
TimescaleDB in a multi-node setup.

<MultiNodeDeprecation />

## Samples

Get metadata related to data nodes.

```sql
SELECT * FROM timescaledb_information.data_nodes;

 node_name    | owner      | options                        
--------------+------------+--------------------------------
 dn1         | postgres   | {host=localhost,port=15431,dbname=test}   
 dn2         | postgres   | {host=localhost,port=15432,dbname=test} 
(2 rows)
```

## Available columns

|Name|Type|Description|
|---|---|---|
| `node_name` | TEXT | Data node name. |
| `owner` | REGCLASS | Oid of the user, who added the data node. |
| `options` | JSONB | Options used when creating the data node. |


