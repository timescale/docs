---
title: Connection pooling
excerpt: Use a connection pool for your Timescale services
products: [cloud]
keywords: [connection pooling, connection pooler, pooler, connections]
cloud_ui:
    path:
        - [services, :serviceId]
---

import EarlyAccess from "versionContent/_partials/pooling-intro.mdx";

# Connection pooling

You can scale your Timescale connections and improve your database performance
using connection poolers. Timescale uses pgBouncer for connection pooling.

Connection pooling rapidly opens and closes connections, while the pooler
maintains a set of long-running connections to the database. This improves
performance because the pooler allows the application to open many short-lived
connections, while the database opens few, long-lived connections.

<EarlyAccess />

If your database needs a large number of short-lived connections, a connection
pooler is a great way to improve performance. For example, web, serverless, and
IoT applications often use an event-based architecture where data is read or
written from the database for very short amount of time.

## Pool types

When you create a connection pooler, there are two pools types to choose from:
session and transaction. Each pool type uses a different mode to handle
connections. Session pool connections remain open until they are closed by the
application, similar to a regular PostgreSQL connection. Transaction pools close
connections automatically at the end of each transaction. If your application
opens and closes connections frequently, choose the transaction pool type.

The number of connections available in each pool is managed by the
`max_connections` parameter. The pooler uses 60% of the total `max_connections`.
45% of `max_connections` are for the session pool, and 15% of `max_connections`
is available in the transaction pool.

## Add a connection pooler

When you create a new service, you have the option to also create a connection
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
