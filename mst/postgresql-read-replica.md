---
title: Create a read-only replica of PostgreSQL
excerpt: Learn how to create a read-only replica for PostgreSQL service on Managed Service for TimescaleDB 
product: mst
---

# Create a read-only replica of PostgreSQL service

PostgreSQL read-only replicas allow you to perform read-only queries against
the replica and reduce the load on the primary server. You can optimize query
response times across different geographical locations because the replica can
be created in different regions or on different cloud providers.

<highlight type="note">
If you are running a Managed Service for TimescaleDB 
[Pro plan](https://docs.timescale.com/mst/latest/about-mst/#service-configuration-plans),
you have standby nodes available in a high availability setup. The standby nodes support
read-only queries to reduce the effect of slow queries on the primary node.
</highlight>

<procedure>

## Creating a replica of POstgreSQL

1.  Log in to the Aiven web console.

1.  Select the PostgreSQL instance for which you want to create a remote replica.

1.  In the `Overview` tab, click `Create a read replica`.

1.  In the `Create a PostgreSQL read` page, type a name for the remote replica,
    select the cloud provider, location, plan that you want to use, and click
    `Create`.

</procedure>

After the read-only replica is created it is listed as a service in your
project. The `Overview` tab of the replica also lists the name of the primary
service for the replica. To promote a read-only replica as a master database,
click the `Promote to master` button.
