---
api_name: create_distributed_restore_point()
excerpt: Create a consistent restore point for all nodes in a multi-node cluster
topics: [distributed hypertables, multi-node]
keywords: [distributed hypertables, restore, backups, multi-node]
tags: [clusters, write-ahead logs, recovery]
api:
  license: community
  type: function
---

import MultiNodeDeprecation from "versionContent/_partials/_multi-node-deprecation.mdx";

<MultiNodeDeprecation />

# create_distributed_restore_point()

Creates a same-named marker record, for example `restore point`, in the
write-ahead logs of all nodes in a multi-node TimescaleDB cluster.

The restore point can be used as a recovery target on each node, ensuring the
entire multi-node cluster can be restored to a consistent state. The function
returns the write-ahead log locations for all nodes where the marker record was
written.

This function is similar to the PostgreSQL function
[`pg_create_restore_point`][pg-create-restore-point], but it has been modified
to work with a distributed database.

This function can only be run on the access node, and requires superuser
privileges.

## Required arguments

|Name|Description|
|-|-|
|`name`|The restore point name|

## Returns

|Column|Type|Description|
|-|-|-|
|`node_name`|NAME|Node name, or `NULL` for access node|
|`node_type`|TEXT|Node type name: `access_node` or `data_node`|
|`restore_point`|[PG_LSN][pg-lsn]|Restore point log sequence number|

### Errors

An error is given if:

*   The restore point `name` is more than 64 characters
*   A recovery is in progress
*   The current WAL level is not set to `replica` or `logical`
*   The current user is not a superuser
*   The current server is not the access node
*   TimescaleDB's 2PC transactions are not enabled

## Sample usage

This example create a restore point called `pitr` across three data nodes and
the access node:

```sql
SELECT * FROM create_distributed_restore_point('pitr');
 node_name |  node_type  | restore_point
-----------+-------------+---------------
           | access_node | 0/3694A30
 dn1       | data_node   | 0/3694A98
 dn2       | data_node   | 0/3694B00
 dn3       | data_node   | 0/3694B68
(4 rows)
```

[pg-create-restore-point]: https://www.postgresql.org/docs/current/functions-admin.html#FUNCTIONS-ADMIN-BACKUP-TABLE
[pg-lsn]: https://www.postgresql.org/docs/current/datatype-pg-lsn.html
