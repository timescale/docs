---
title: Create a read-only replica of PostgreSQL
excerpt: Learn how to create and use a read-only replica for PostgreSQL service on Managed Service for TimescaleDB
products: [mst]
---

# Create a read-only replica of PostgreSQL service

PostgreSQL read-only replicas allow you to perform read-only queries against
the replica and reduce the load on the primary server. You can optimize query
response times across different geographical locations because the replica can
be created in different regions or on different cloud providers.
For information about creating a read-only replica using the Aiven client,
see the documentation on [creating a read replica using the CLI][read-replica-cli].

<Highlight type="note">
If you are running a Managed Service for TimescaleDB
[Pro plan](https://docs.timescale.com/mst/latest/about-mst/#service-configuration-plans),
you have standby nodes available in a high availability setup. The standby nodes support
read-only queries to reduce the effect of slow queries on the primary node.
</Highlight>

<Procedure>

## Creating a replica of PostgreSQL

1.  Sign in to your [Managed Service for TimescaleDB portal][mst-login]. In the
    `Services` view, click the PostgreSQL service for which you want to create a
    remote replica.

1.  In the `Overview` tab, click `Create a read replica`.

1.  In the `Create a PostgreSQL read replica` page, type a name for the remote replica,
    select the cloud provider, location, plan that you want to use, and click
    `Create`.

</Procedure>

When the read-only replica is created it is listed as a service in your
project. The `Overview` tab of the replica also lists the name of the primary
service for the replica. To promote a read-only replica as a master database,
click the `Promote to master` button.

<Procedure>

## Using read-only replica for the service on MST

1.  In the `Overview` page of the read-only replica for the service on MST, copy
    the `Service URI`.

1.  At the psql prompt, connect to the read-only service:

    ```sql
    psql <SERVICE_URI>
    ```

1.  To check whether you are connected to a primary or replica node:

    ```sql
    SELECT * FROM pg_is_in_recovery();
    ```

    If the output is `TRUE` you are connected to the replica, and if the output is
    `FALSE` you are connected to the primary server.

</Procedure>

<Highlight type="note">
Managed Service for TimescaleDB uses asynchronous replication, so some lag is
expected. When you run an `INSERT` operation on the primary node, a small
delay of less than a second is expected for the change to propagate to the
replica.
</Highlight>

[mst-login]: https://portal.managed.timescale.com
[read-replica-cli]: /mst/:currentVersion:/aiven-client/replicas-cli
