---
api_name: alter_data_node()
excerpt: Change the configuration of a data node
topics: [distributed hypertables, multi-node]
keywords: [multi-node]
tags: [data nodes, distributed hypertables, cluster]
api:
  license: community
  type: function
---

import MultiNodeDeprecation from "versionContent/_partials/_multi-node-deprecation.mdx";

<MultiNodeDeprecation />

# alter_data_node() <Tag type="community">Community</Tag>

Change the configuration of a data node that was originally set up with
[`add_data_node`][add_data_node] on the access node.

Only users with certain privileges can alter data nodes. When you alter
the connection details for a data node, make sure that the altered
configuration is reachable and can be authenticated by the access node.

### Required arguments

|Name|Description|
|-|-|
|`node_name`|Name for the data node|

### Optional arguments

|Name|Description|
|-|-|
|`host`|Host name for the remote data node|
|`database`|Database name where remote hypertables are created. The default is the database name that was provided in `add_data_node`|
|`port`|Port to use on the remote data node. The default is the PostgreSQL port that was provided in `add_data_node`|
|`available`|Configure availability of the remote data node. The default is `true` meaning that the data node is available for read/write queries|

### Returns

|Column|Description|
|-|-|
|`node_name`|Local name to use for the data node|
|`host`|Host name for the remote data node|
|`port`|Port for the remote data node|
|`database`|Database name used on the remote data node|
|`available`|Availability of the remote data node for read/write queries|

#### Errors

An error is given if:

*   A remote data node with the provided `node_name` argument does not exist.

#### Privileges

To alter a data node, you must have the correct permissions, or be the owner of the remote server.
Additionally, you must have the `USAGE` privilege on the `timescaledb_fdw` foreign data
wrapper.

### Sample usage

To change the port number and host information for an existing data node `dn1`:

```sql
SELECT alter_data_node('dn1', host => 'dn1.example.com', port => 6999);
```

Data nodes are available for read/write queries by default. If the data node
becomes unavailable for some reason, the read/write query gives an error. This
API provides an optional argument, `available`, to mark an existing data node
as available or unavailable for read/write queries. By marking a data node as
unavailable you can allow read/write queries to proceed in the cluster. For
more information, see the [multi-node HA section][multi-node-ha]

[add_data_node]: /api/:currentVersion:/distributed-hypertables/add_data_node/
[multi-node-ha]: /self-hosted/:currentVersion:/multinode-timescaledb/multinode-ha/#node-failures
