---
title: Multi-node administration
excerpt: Manage your multi-node TimescaleDB cluster
products: [self_hosted]
keywords: [multi-node, admin]
tags: [manage]
---

import MultiNodeDeprecation from "versionContent/_partials/_multi-node-deprecation.mdx";

<MultiNodeDeprecation />

# Multi-node administration

Multi-node TimescaleDB allows you to administer your cluster directly
from the access node. When your environment is set up, you do not
need to log directly into the data nodes to administer your database.

When you perform an administrative task, such as adding a new column,
changing privileges, or adding an index on a distributed hypertable,
you can perform the task from the access node and it is applied to all
the data nodes. If a command is executed on a regular table, however,
the effects of that command are only applied locally on the access
node. Similarly, if a command is executed directly on a data node, the
result is only visible on that data node.

Commands that create or modify schemas, roles, tablespaces, and
settings in a distributed database are not automatically distributed
either. That is because these objects and settings sometimes need to
be different on the access node compared to the data nodes, or even
vary among data nodes. For example, the data nodes could have unique
CPU, memory, and disk configurations. The node differences make it
impossible to assume that a single configuration works for all
nodes. Further, some settings need to be different on the publicly
accessible access node compared to data nodes, such as having
different connection limits. A role might not have the `LOGIN`
privilege on the access node, but it needs this privilege on data
nodes so that the access node can connect.

Roles and tablespaces are also shared across multiple databases on the
same instance. Some of these databases might be distributed and some
might not be, or be configured with a different set of data
nodes. Therefore, it is not possible to know for sure when a role or
tablespace should be distributed to a data node given that these
commands can be executed from within different databases, that need
not be distributed.

To administer a multi-node cluster from the access node, you can use
the [`distributed_exec`][distributed_exec] function. This function
allows full control over creating and configuring, database settings,
schemas, roles, and tablespaces across all data nodes.

The rest of this section describes in more detail how specific
administrative tasks are handled in a multi-node environment.

## Distributed role management

In a multi-node environment, you need to manage roles on each
PostgreSQL instance independently, because roles are instance-level
objects that are shared across both distributed and non-distributed
databases that each can be configured with a different set of data
nodes or none at all. Therefore, an access node does not
automatically distribute roles or role management commands across its
data nodes. When a data node is added to a cluster, it is assumed that
it already has the proper roles necessary to be consistent with the
rest of the nodes. If this is not the case, you might encounter
unexpected errors when you try to create or alter objects that depend
on a role that is missing or set incorrectly.

To help manage roles from the access node, you can use the
[`distributed_exec`][distributed_exec] function. This is useful for
creating and configuring roles across all data nodes in the
current database.

### Creating a distributed role

When you create a distributed role, it is important to consider that
the same role might require different configuration on the access node
compared to the data nodes. For example, a user might require a
password to connect to the access node, while certificate
authentication is used between nodes within the cluster. You might
also want a connection limit for external connections, but allow
unlimited internal connections to data nodes. For example, the
following user can use a password to make 10 connections to the access
node but has no limits connecting to the data nodes:

```sql
CREATE ROLE alice WITH LOGIN PASSWORD 'mypassword' CONNECTION LIMIT 10;
CALL distributed_exec($$ CREATE ROLE alice WITH LOGIN CONNECTION LIMIT -1; $$);
```

For more information about setting up authentication, see the
[multi-node authentication section][multi-node-authentication].

Some roles can also be configured without the `LOGIN` attribute on
the access node. This allows you to switch to the role locally, but not
connect with the user from a remote location. However, to be able to
connect from the access node to a data node as that user, the data
nodes need to have the role configured with the `LOGIN` attribute
enabled. To create a non-login role for a multi-node setup, use these
commands:

```sql
CREATE ROLE alice WITHOUT LOGIN;
CALL distributed_exec($$ CREATE ROLE alice WITH LOGIN; $$);
```

To allow a new role to create distributed hypertables it also needs to
be granted usage on data nodes, for example:

```sql
GRANT USAGE ON FOREIGN SERVER dn1,dn2,dn3 TO alice;
```

By granting usage on some data nodes, but not others, you can
restrict usage to a subset of data nodes based on the role.

### Alter a distributed role

When you alter a distributed role, use the same process as creating
roles. The role needs to be altered on the access node and on the data
nodes in two separate steps. For example, add the `CREATEROLE`
attribute to a role as follows:

```sql
ALTER ROLE alice CREATEROLE;
CALL distributed_exec($$ ALTER ROLE alice CREATEROLE; $$);
```

## Manage distributed databases

A distributed database can contain both distributed and
non-distributed objects. In general, when a command is issued to alter
a distributed object, it applies to all nodes that have that object (or
a part of it).

However, in some cases settings *should* be different depending on
node, because nodes might be provisioned differently (having, for example,
varying levels of CPU, memory, and disk capabilities) and the role of
the access node is different from a data node's.

This section describes how and when commands on distributed objects
are applied across all data nodes when executed from within a
distributed database.

### Alter a distributed database

The [`ALTER DATABASE`][alter-database] command is only applied locally
on the access node. This is because database-level configuration often
needs to be different across nodes. For example, this is a setting that
might differ depending on the CPU capabilities of the node:

```sql
ALTER DATABASE mydatabase SET max_parallel_workers TO 12;
```

The database names can also differ between nodes, even if the
databases are part of the same distributed database. When you rename a
data node's database, also make sure to update the configuration of
the data node on the access node so that it references the new
database name.

### Drop a distributed database

When you drop a distributed database on the access node, it does not
automatically drop the corresponding databases on the data nodes. In
this case, you need to connect directly to each data node and drop the
databases locally.

A distributed database is not automatically dropped across all nodes,
because the information about data nodes lives within the distributed
database on the access node, but it is not possible to read it when
executing the drop command since it cannot be issued when connected to
the database.

Additionally, if a data node has permanently failed, you need to be able
to drop a database even if one or more data nodes are not responding.

It is also good practice to leave the data intact on a data node if
possible. For example, you might want to back up a data node even
after a database was dropped on the access node.

Alternatively, you can delete the data nodes with
the `drop_database` option prior to dropping the database on the
access node:

```sql
SELECT * FROM delete_data_node('dn1', drop_database => true);
```

## Create, alter, and drop schemas

When you create, alter, or drop schemas, the commands are not
automatically applied across all data nodes. A missing schema is,
however, created when a distributed hypertable is created, and the
schema it belongs to does not exist on a data node.

To manually create a schema across all data nodes, use this command:

```sql
CREATE SCHEMA newschema;
CALL distributed_exec($$ CREATE SCHEMA newschema $$);
```

If a schema is created with a particular authorization, then the
authorized role must also exist on the data nodes prior to issuing the
command. The same things applies to altering the owner of an existing
schema.

### Prepare for role removal with DROP OWNED

The [`DROP OWNED`][drop-owned] command is used to drop all objects owned
by a role and prepare the role for removal. Execute the following
commands to prepare a role for removal across all data nodes in a
distributed database:

```sql
DROP OWNED BY alice CASCADE;
CALL distributed_exec($$ DROP OWNED BY alice CASCADE $$);
```

Note, however, that the role might still own objects in other
databases after these commands have been executed.

### Manage privileges

Privileges configured using [`GRANT`][grant] or [`REVOKE`][revoke]
statements are applied to all data nodes when they are run on a
distributed hypertable. When granting privileges on other objects, the
command needs to be manually distributed with
[`distributed_exec`][distributed_exec].

#### Set default privileges

Default privileges need to be manually modified using
[`distributed_exec`][distributed_exec], if they are to apply across
all data nodes. The roles and schemas that the default privileges
reference need to exist on the data nodes prior to executing the
command.

New data nodes are assumed to already have any altered
default privileges. The default privileges are not automatically
applied retrospectively to new data nodes.

## Manage tablespaces

Nodes might be configured with different disks, and therefore
tablespaces need to be configured manually on each node. In
particular, an access node might not have the same storage
configuration as data nodes, since it typically does not store a lot
of data. Therefore, it is not possible to assume that the same
tablespace configuration exists across all nodes in a multi-node
cluster.

[alter-database]: https://www.postgresql.org/docs/current/sql-alterdatabase.html
[distributed_exec]: /api/:currentVersion:/distributed-hypertables/distributed_exec
[drop-owned]: https://www.postgresql.org/docs/current/sql-drop-owned.html
[grant]: https://www.postgresql.org/docs/current/sql-grant.html
[multi-node-authentication]: /self-hosted/:currentVersion:/multinode-timescaledb/multinode-auth/
[revoke]: https://www.postgresql.org/docs/current/sql-revoke.html
