---
api_name: distributed_exec()
excerpt: Execute a procedure across all the data nodes of a multi-node cluster
topics: [distributed hypertables, multi-node]
keywords: [multi-node]
tags: [data nodes, cluster, procedure, roles, permissions]
api:
  license: community
  type: procedure
---

import MultiNodeDeprecation from "versionContent/_partials/_multi-node-deprecation.mdx";

<MultiNodeDeprecation />

# distributed_exec() <Tag type="community">Community</Tag>

This procedure is used on an access node to execute a SQL command
across the data nodes of a distributed database. For instance, one use
case is to create the roles and permissions needed in a distributed
database.

The procedure can run distributed commands transactionally, so a command
is executed either everywhere or nowhere. However, not all SQL commands can run in a
transaction. This can be toggled with the argument `transactional`. Note if the execution
is not transactional, a failure on one of the data node requires manual dealing with
any introduced inconsistency.

Note that the command is _not_ executed on the access node itself and
it is not possible to chain multiple commands together in one call.

<Highlight type="important">
You cannot run `distributed_exec` with some SQL commands. For example, `ALTER
EXTENSION` doesn't work because it can't be called after the TimescaleDB
extension is already loaded.
</Highlight>

### Required arguments

|Name|Type|Description|
|---|---|---|
| `query` | TEXT | The command to execute on data nodes. |

### Optional arguments

|Name|Type|Description|
|---|---|---|
| `node_list` | ARRAY | An array of data nodes where the command should be executed. Defaults to all data nodes if not specified. |
| `transactional` | BOOLEAN | Allows to specify if the execution of the statement should be transactional or not. Defaults to TRUE. |

### Sample usage

Create the role `testrole` across all data nodes in a distributed database:

```sql
CALL distributed_exec($$ CREATE USER testrole WITH LOGIN $$);
```

Create the role `testrole` on two specific data nodes:

```sql
CALL distributed_exec($$ CREATE USER testrole WITH LOGIN $$, node_list => '{ "dn1", "dn2" }');
```

Create the table `example` on all data nodes:

```sql
CALL distributed_exec($$ CREATE TABLE example (ts TIMESTAMPTZ, value INTEGER) $$);
```

Create new databases `dist_database` on data nodes, which requires setting
`transactional` to FALSE:

```sql
CALL distributed_exec('CREATE DATABASE dist_database', transactional => FALSE);
```
