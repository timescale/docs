---
title: Setting up TimescaleDB 2.0 multi-node on Managed Service for TimescaleDB
excerpt: Set up multi-node on Managed Service for TimescaleDB (deprecated)
products: [mst]
keywords: [multi-node]
---

# Setting up TimescaleDB 2.0 multi-node on Managed Service for TimescaleDB

<Highlight type="deprecation">
This section describes a feature that is deprecated on Managed Service for
TimescaleDB. If you want to use multi-node, you can
[self-host](/self-hosted/latest/install/) a TimescaleDB installation.
</Highlight>

TimescaleDB 2.0 [introduces a number of new features][changes-in-tsdb2] to
supercharge time-series data even further. One of the most anticipated new
features is what we call **multi-node** - the ability to create a cluster of
TimescaleDB instances to scale both reads and writes.

This section shows you how to create a multi-node cluster in your
Managed Service for TimescaleDB account with TimescaleDB 2.0 as a
"do-it-yourself" (DIY) multi-node experience.

## Overview of multi-node setup

Multi-node clusters consist of at least two or more TimescaleDB instances
(called **Services** in Managed Service for TimescaleDB). Each cluster has one
access node (AN) and one or more data nodes (DN). As outlined in these
[architecture blog posts][distributed-architecture], the access node is intended
to be the only TimescaleDB instance that you or your applications connect to
once the cluster is set up. It becomes the "brains" and traffic controller of
all distributed hypertable activity. In contrast, data nodes are not intended to
be accessed directly once joined to a multi-node cluster.

<Highlight type="tip">
A proper TimescaleDB cluster should have at least two data nodes to begin
realizing the benefits of distributed hypertables. While it is technically
possible to add just one data node to a cluster, this configuration performs
worse than a single-node TimescaleDB instance and is not recommended.
</Highlight>

### Create services for access and data node services

First, you need to create new Services within your Cloud account. As mentioned
earlier, you should create _at least_ three Services to set up a multi-node
cluster: one access node and two data nodes.

There is currently no way to visually distinguish between the access node and
data nodes within the Managed Service for TimescaleDB console, **so we strongly
recommend that you include "AN" and "DN" in the names of each service,
respectively (eg. "an-mycluster," "dn1-mycluster," "dn2-mycluster," etc.)**.
Services can only assume one role in a cluster (access or data node), and only
one Service can act as the access node.

For simplicity you can start with the same hardware configuration for all
Services. On Managed Service for TimescaleDB, Service plans can be upgraded
later to better tune access and data node requirements.

<Highlight type="tip">
More advanced users might consider using larger disks on data nodes (this is
where the distributed hypertable data is stored) and more memory and CPU for the
access node.
</Highlight>

<Highlight type="warning">
To set up your first multi-node instance in Managed Service for TimescaleDB, you
need to create new Services for the Access Node and Data Nodes.
</Highlight>

### Modify access node settings

The hard work of handling distributed queries in a multi-node cluster is
handled by TimescaleDB for you. Some queries, however, perform better in a
distributed environment when TimescaleDB is configured to more efficiently push
down some types of queries to the data nodes.

To that end, we highly recommend the following settings be modified for the
**Access Node** only using the **Advanced Configuration** section in the
Managed Service for TimescaleDB console.

*   `pg.jit` = off
*   `pg.max_prepared_transactions` > 0 (150 is a recommended starting value)
*   `enable_partitionwise_aggregate` should be set to `on` on the access node for good query performance. Otherwise, queries are not pushed down to the data nodes.

<img class="main-content__illustration" src="https://assets.timescale.com/docs/images/timescale-cloud-adv-config.webp" alt="Managed TimescaleDB advanced configuration"/>

### Add data nodes to the cluster

Once you've created your new Services, you'll enable communication between the
access node and all data nodes. The currently supported method for securing
communication between nodes is through **user mapping authentication**.

This is a one-time, manual process that must be completed for each data node.

#### About user mapping authentication

User mapping authentication allows users to continue connecting with the
`tsdbadmin` PostgreSQL user for all data access and cluster management. It also
allows you to continue making secure (SSL) connections to your Managed Service
for TimescaleDB Access node.

With user mapping authentication, you don't need to manage any new users,
however, **you need to have the passwords for the `tsdbadmin` user from each
data node you are adding to the cluster**.

The main limitation of this approach is that any password changes to the
connected `tsdbadmin` user on a data node breaks the mapping connection
and impact normal cluster operations. Any time a password is changed on a data
node, you'll need to complete the mapping process outlined below to re-establish
the connection between the access node and the affected data node. You can read
about user mapping in the [PostgreSQL documentation][postgres-user-mapping].

### Add each data node using the host URI

For this step, you'll need to copy the `Host`, `Password`, and `Port` details
listed under the `Connection Information` section of the Service details to use
with the `add_data_node` command in the next section.

<img class="main-content__illustration" src="https://assets.timescale.com/docs/images/timescale-cloud-connection-info.webp" alt="Managed Service for TimescaleDB multi-node connection information"/>

When you have the `password` and `host` for each data node Service, connect to
the access node using the `tsdbadmin` user. On Managed Service for TimescaleDB,
you can do this by copying the `Service URI` (after clicking
`CLICK_TO:REVEAL_PASSWORD`). It should look something like the following, but
with different ports, password and Service URI.

Connect using `psql`:

```bash
psql postgres://tsdbadmin:abcd1234@dn1-cloud-demo-support-50d0.a.timescaledb.io:12345/defaultdb?sslmode=require
```

Then add a data node:

```sql
SELECT add_data_node('dn1', host => 'your_DN1_hostname', port => 12345
 password => 'tsdbadmin_user_password_for_DN1');
```

To list added data nodes we can run `\des+` command if using `psql`:

```bash
tsdb=> \des+
List of foreign servers
-[ RECORD 1 ]--------+------------------------------------------------------------------------------------
Name                 | dn1
Owner                | multinode
Foreign-data wrapper | timescaledb_fdw
Access privileges    |
Type                 |
Version              |
FDW options          | (host 'dn1-cloud-demo-support-50d0.a.timescaledb.io', port '12345', dbname 'defaultdb')
Description          |
```

### Add a user mapping for each data node

Now you can create a `USER MAPPING` that enables communication between the
access node and data node:

```SQL
CREATE USER MAPPING FOR tsdbadmin SERVER dn1 OPTIONS (user 'tsdbadmin', password 'tsdbadmin_user_password_for_DN1');
```

Repeat these steps for each additional data node that you want to add to the
cluster. **Always invoke these commands from the access node!**

### Create a distributed hypertable

Finally, you can create a distributed hypertable and add data to verify that
everything is set up and working correctly.

```SQL
-- Create your regular table
CREATE TABLE sensor_data (
  time TIMESTAMPTZ NOT NULL,
  sensor_id INTEGER,
  temperature DOUBLE PRECISION,
  cpu DOUBLE PRECISION
);

-- Convert the table to a distributed hypertable
SELECT create_distributed_hypertable('sensor_data', 'time', 'sensor_id');

-- Insert some test data to verify you are error free
INSERT INTO sensor_data VALUES  ('2020-12-09',1,32.2,0.45);
```

One major point to recognize about the SQL above is the declaration of
a partition column (`sensor_id`) for the distributed hypertable. This is
intentional, and **recommended**, for distributed hypertable setups. Previously,
with regular, single-node hypertables, there was often little benefit in
specifying a partition key when creating the hypertable. With distributed
hypertables, however, adding a partition key is essential to ensure that data
is efficiently distributed across data nodes. Otherwise, all data for a specific
time range goes to one chunk on one node, rather than being distributed
across all available data nodes for the same time range.

## Adding additional database users (optional)

One of the other advantages of the user-mapping-based approach is that it allows
us to add additional users to the multi-node cluster.

From the **access node**, create a new user and GRANT all privileges.

```SQL
CREATE ROLE mn_user1 LOGIN PASSWORD 'password';
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO mn_user1;
```

While connected to the access node we can use a specially designed function
to execute SQL commands against data nodes. Notice that the list of nodes is
included and for this example, it is assumed that both data nodes exist and are
added to the access node.

```SQL
CALL distributed_exec(query => 'CREATE ROLE mn_user1 LOGIN PASSWORD $$password$$', node_list => '{dn1,dn2}');
CALL distributed_exec(query => 'GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO mn_user1;', node_list => '{dn1,dn2}');
```

Finally we add a user mapping for our newly added user so that the AN can
connect to the DN with the new user:

```SQL
CREATE USER MAPPING FOR mn_user1 SERVER dn1 OPTIONS (user 'mn_user1', password 'password');
```

A few final reminders as you begin to explore the opportunities of a multi-node
server:

1.  Multi-node clusters can still use _regular_, non-distributed features like
    regular hypertables, PostgreSQL tables, and continuous aggregations. The
  data stored in any of these objects reside only on the access node.
1.  There is no limitation on the number of distributed hypertables a user can
  create on the access node.
1.  Finally, remember that once a Service is marked as an access node or data
   node, it cannot be used as part of another multi-node cluster.

## Maintenance tasks

A multi-node setup requires regular maintenance; in particular, the distributed
transaction log needs to be cleaned up and non-completed transactions should be
"healed." Refer to the [multi-node documentation][maintenance-tasks] for
instructions on how to configure a user-defined action for this task.

[changes-in-tsdb2]: /about/:currentVersion:/release-notes/changes-in-timescaledb-2/
[distributed-architecture]: https://blog.timescale.com/blog/building-a-distributed-time-series-database-on-postgresql/
[maintenance-tasks]: /self-hosted/:currentVersion:/multinode-timescaledb/multinode-setup/
[postgres-user-mapping]: https://www.postgresql.org/docs/current/view-pg-user-mappings.html
[slack]: https://slack.timescale.com/
