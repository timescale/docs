---
title: Connection pooling
excerpt: Use a connection pool for your Timescale services
products: [cloud]
keywords: [connection pooling, pooler, connections, services]
cloud_ui:
    path:
        - [services, :serviceId]
---

import EarlyAccess from "versionContent/_partials/_early_access.mdx";

# Connection pooling

You can scale your Timescale connections and improve your database performance
using connection poolers. Timescale uses `pgBouncer` for connection pooling.

If your database needs a large number of short-lived connections, a connection
pooler is a great way to improve performance. For example, web, serverless, and
IoT applications often use an event-based architecture where data is read or
written from the database for very short amount of time.

<EarlyAccess />

Your application rapidly opens and closes connections while the pooler
maintains a set of long-running connections to the database. This improves
performance because the pooler open the connections in advance,  allowing the
application to open many short-lived connections, while the database opens few,
long-lived connections.

## Pool types

When you create a connection pooler, there are two pool types to choose from:
session or transaction. Each pool type uses a different mode to handle
connections.

Session pools allocate a connection from the pool until they are closed by the
application, similar to a regular PostgreSQL connection. When the application
closes the connection, it is sent back to the pool.

Transaction pool connections are allocated only for the duration of the
transaction, releasing the connection back to the pool when the transaction
ends. If your application opens and closes connections frequently, choose the
transaction pool type.

## Connection allocations

A connection pooler manages connections to both the database itself, and the
client application.

The number of database connections allocated in each pool is managed by the
`max_connections` parameter set in the service. The pooler keeps allocating
connections until 60% of the total `max_connections`. 45% of the
`max_connections` parameter is used for the session pool, and the remaining 15%
is available for the transaction pool.

The connection pooler can then allocate connections for the client application.
Up to 45% of `max_connections` is available for the session pool, and up to 100%
of `max_connections` is available for the transaction pool.

For example, if `max_connections` is set to 500, the maximum number of database
connections is 300, or 60% of `max_connections`. For the client application, in
session mode, the maximum number of connections is 225, which limits the total
number of database connections to 225. In transaction mode, the maximum number
of connections is 500, which limits the total number of database connections to
75.

## Add a connection pooler

When you create a new service, you can also create a connection
pooler. Alternatively, you can add a connection pooler to an existing service in
the Timescale portal.

<Procedure>

### Adding a connection pooler

1.  [Log in to the Timescale portal][cloud-login] and click the service
    you want to add a connection pooler to.
1.  In the `Connection info` section, navigate to the `Connection pooler` tab,
    and click `Add connection pooler`.
1.  When the pooler has been added, your pooler connection details are displayed
    in the `Connection pooler` tab. Use this information to connect to your
    pooler.
1.  By default, your pooler is started as a session pool. You can change this to
    a transaction pool by selecting it from the drop-down menu. For more
    information about the different pool types, see the
    [pool types][about-connection-pooling-types] section.

    <img class="main-content__illustration"
    src="https://assets.timescale.com/docs/images/connection_pooler.webp"
    width={1375} height={944}
    alt="Timescale Service Connection Info section, the Connection Pooler tab, showing information for a transaction pool" />

</Procedure>

## Remove a connection pooler

If you no longer need a connection pooler, you can remove it in the Timescale
portal. When you have removed your connection pooler, make sure that you also
update your application to adjust the port it uses to connect to your service.

<Procedure>

### Removing a connection pooler

1.  [Log in to the Timescale portal][cloud-login] and click the service
    you want to remove a connection pooler from.
1.  In the `Connection info` section, navigate to the `Connection pooler` tab,
    and click `Remove connection pooler`.
1.  Confirm that you want to remove the connection pooler.

    <Highlight type="note">
    After you have removed a pooler, if you add it back in the future, it uses the
    same connection string and port that was used before.
    </Highlight>

</Procedure>

[cloud-login]: https://console.cloud.timescale.com
[about-connection-pooling-types]: /use-timescale/:currentVersion:/services/connection-pooling#pool-types
