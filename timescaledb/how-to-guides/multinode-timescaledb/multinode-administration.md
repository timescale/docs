# Multi-node administration
Multi-node TimescaleDB allows you to administer your cluster directly
from the access node. When your environment is set up, you do not
need to log directly into the data nodes to administer your database.

You can store both distributed and non-distributed objects in
a distributed database. Generally, operations on distributed
objects are sent to the data nodes to apply the operations
on all sub-objects. Distributed objects include:
* Schemas in distributed databases
* Default privileges in distributed databases
* Distributed hypertables

When you perform an administrative task, such as adding a new
schema, changing a default privilege, or adding an index on a
distributed hypertable, you can perform the task from the access node
and it is applied to all data nodes in the distributed database. If a
command is executed on a regular table, however, the effects of that
command are only applied locally on the access node. Similarly, if a
command is executed directly on a data node, the result is only
visible on that data node.

There are some exceptions to this rule. Commands that act on the
distributed database itself, such as [`ALTER
DATABASE`][alter-database], are not distributed to data nodes. That is
because these settings usually need to be different on the access node
compared to the data nodes. For example, the publicly accessible
access node typically requires a different connection limit than the
data nodes that are only accessed internally. The nodes could also be
provisioned differently, having varying levels of CPU, memory, and
disk capabilities, so the database-level configuration must be
heterogeneous and should reflect the node capabilities.

As well as distributed and non-distributed objects within a database,
you can also have instance-level objects, such as roles and
tablespaces. These objects are shared across multiple databases on
the same instance and need to be manually managed on each node.

The rest of this section describes in more detail how specific
administrative tasks are handled in a multi-node environment.

## Distributed role management
<highlight type="important">
Timescale Cloud automates role management. It distributes
role management commands so that the you do not have to
manually configure roles across all node instances. Most of
the information in this section applies only to self-managed
deployments.
</highlight>

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
node:
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
a distributed object it applies to all nodes that have that object (or
a part of it).

However, in some cases settings *should* be different depending on
node, because nodes might be provisioned differently (having, e.g.,
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
automatically drop the corresponding databases on the data nodes.
In this case, you need to connect directly to each data node and drop
the databases locally.

A distributed database is not automatically dropped across all nodes,
because the information about data nodes lives within the distributed
database on the access node, but it is not possible to read it when
executing the drop command since it cannot be issued when
connected to the database.

Additionally, if a data node has permanently failed, you need to be able
to drop a database even if one or more data nodes are not responding.

It is also good practice to leave the data intact on a data node if
possible. For example, you might want to back up a data node even
after a database was dropped on the access node.

## Create, alter, and drop schemas
When you create, alter, or drop schemas, the commands are applied
across all data nodes in the current distributed database. However,
existing schemas on the access node are not created on a data node
when it is added. A missing schema is, however, created when a
distributed hypertable is created, and the schema it belongs to does
not exist on a data node.

If a schema is created with a particular authorization, then the
authorized role must also exist on the data nodes prior to issuing the
command. The same things applies to altering the owner of an existing
schema.

### Drop owned objects
Use the [`DROP OWNED`][drop-owned] command to drop all objects
owned by a role and prepare the role for removal. This command is
applied across all data nodes of a distributed database.

### Manage privileges
Privileges configured using [`GRANT`][grant] or [`REVOKE`][revoke]
statements are applied to all data nodes when they are run on a
distributed object, like a distributed hypertable, schema in a distributed
database, or the distributed database itself.

If the statement is run on an object that a distributed object
depends on, such as a sequence or index that is used by a distributed
hypertable, the command is not applied across all data nodes.

#### Set default privileges
Changes to default privileges are applied across all data nodes of a
distributed database. The roles and schemas that the default
privileges reference need to exist on the data nodes prior to
executing the command.

New data nodes are assumed to already have any altered
default privileges. The default privileges are not automatically
applied retrospectively to new data nodes.

## Manage tablespaces
Tablespaces are instance-level objects, like roles, and require
manual configuration on each node.

[distributed_exec]: /api/:currentVersion:/distributed-hypertables/distributed_exec
[multi-node-authentication]: /how-to-guides/multinode-timescaledb/multinode-auth/
[alter-database]: https://www.postgresql.org/docs/current/sql-alterdatabase.html
[grant]: https://www.postgresql.org/docs/current/sql-grant.html
[revoke]: https://www.postgresql.org/docs/current/sql-revoke.html
[drop-owned]: https://www.postgresql.org/docs/current/sql-drop-owned.html
