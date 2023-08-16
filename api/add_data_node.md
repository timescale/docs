---
api_name: add_data_node()
excerpt: Add a new data node to a multi-node cluster
topics: [distributed hypertables, multi-node]
keywords: [multi-node]
tags: [data nodes, distributed hypertables, cluster]
api:
  license: community
  type: function
---

# add_data_node() <Tag type="community">Community</Tag>

Add a new data node on the access node to be used by distributed
hypertables. The data node is automatically used by distributed
hypertables that are created after the data node has been added, while
existing distributed hypertables require an additional
[`attach_data_node`][attach_data_node].

If the data node already exists, the command aborts with either an
error or a notice depending on the value of `if_not_exists`.

For security purposes, only superusers or users with necessary
privileges can add data nodes (see below for details). When adding a
data node, the access node also tries to connect to the data node
and therefore needs a way to authenticate with it. TimescaleDB
currently supports several different such authentication methods for
flexibility (including trust, user mappings, password, and certificate
methods). Refer to [Setting up Multi-Node TimescaleDB][multinode] for more
information about node-to-node authentication.

Unless `bootstrap` is false, the function attempts to bootstrap
the data node by:

1.  Creating the database given in `database` that serve as the
   new data node.
1.  Loading the TimescaleDB extension in the new database.
1.  Setting metadata to make the data node part of the distributed
   database.

Note that user roles are not automatically created on the new data
node during bootstrapping. The [`distributed_exec`][distributed_exec]
procedure can be used to create additional roles on the data node
after it is added.

### Required arguments

| Name        | Description                         |
| ----------- | -----------                         |
| `node_name` | Name for the data node.             |
| `host`      | Host name for the remote data node. |

### Optional arguments

| Name                 | Description                                           |
|----------------------|-------------------------------------------------------|
| `database`           | Database name where remote hypertables are created. The default is the current database name. |
| `port`               | Port to use on the remote data node. The default is the PostgreSQL port used by the access node on which the function is executed. |
| `if_not_exists`      | Do not fail if the data node already exists. The default is `FALSE`. |
| `bootstrap`          | Bootstrap the remote data node. The default is `TRUE`. |
| `password`           | Password for authenticating with the remote data node during bootstrapping or validation. A password only needs to be provided if the data node requires password authentication and a password for the user does not exist in a local password file on the access node. If password authentication is not used, the specified password is ignored. |

### Returns

| Column              | Description                                       |
|---------------------|---------------------------------------------------|
| `node_name`         | Local name to use for the data node               |
| `host`              | Host name for the remote data node                |
| `port`              | Port for the remote data node                     |
| `database`          | Database name used on the remote data node        |
| `node_created`      | Was the data node created locally                 |
| `database_created`  | Was the database created on the remote data node  |
| `extension_created` | Was the extension created on the remote data node |

#### Errors

An error is given if:

*   The function is executed inside a transaction.
*   The function is executed in a database that is already a data node.
*   The data node already exists and `if_not_exists` is `FALSE`.
*   The access node cannot connect to the data node due to a network
  failure or invalid configuration (for example, wrong port, or there is no
  way to authenticate the user).
*   If `bootstrap` is `FALSE` and the database was not previously
  bootstrapped.

#### Privileges

To add a data node, you must be a superuser or have the `USAGE`
privilege on the `timescaledb_fdw` foreign data wrapper. To grant such
privileges to a regular user role, do:

```sql
GRANT USAGE ON FOREIGN DATA WRAPPER timescaledb_fdw TO <newrole>;
```

Note, however, that superuser privileges might still be necessary on
the data node in order to bootstrap it, including creating the
TimescaleDB extension on the data node unless it is already installed.

### Sample usage

Let's assume that you have an existing hypertable `conditions` and want to use
`time` as the time partitioning column. You also want to distribute the chunks
of the hypertable on two data nodes `dn1.example.com` and `dn2.example.com`:

```sql
SELECT add_data_node('dn1', host => 'dn1.example.com');
SELECT add_data_node('dn2', host => 'dn2.example.com');
SELECT create_distributed_hypertable('conditions', 'time');
```

If you want to create a distributed database with the two data nodes
local to this instance, you can write:

```sql
SELECT add_data_node('dn1', host => 'localhost', database => 'dn1');
SELECT add_data_node('dn2', host => 'localhost', database => 'dn2');
SELECT create_distributed_hypertable('conditions', 'time');
```

Note that this does not offer any performance advantages over using a
regular hypertable, but it can be useful for testing.

[attach_data_node]: /api/:currentVersion:/distributed-hypertables/attach_data_node/
[distributed_exec]: /api/:currentVersion:/distributed-hypertables/distributed_exec/
[multinode]: /self-hosted/:currentVersion:/multinode-timescaledb/multinode-auth/
