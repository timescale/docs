---
api_name: distributed_exec()
excerpt: Execute a command across all the data nodes of a distributed database.
license: community
tags: [multi-node]
---

## distributed_exec() <tag type="community">Community</tag>

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

Create new databases `dist_database` on data nodes, which requires to set `transactional` to FALSE:

```sql
CALL distributed_exec('CREATE DATABASE dist_database', transactional => FALSE);
```
