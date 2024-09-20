---
title: Connection pooling
excerpt: Use a connection pool for your Timescale services
products: [cloud]
keywords: [connection pooling, pooler, connections, services]
cloud_ui:
    path:
        - [services, :serviceId]
---

import Beta from "versionContent/_partials/_beta.mdx";

# Connection pooling

You can scale your Timescale connections and improve your database performance
using connection poolers. Timescale uses `pgBouncer` for connection pooling.

If your database needs a large number of short-lived connections, a connection
pooler is a great way to improve performance. For example, web, serverless, and
IoT applications often use an event-based architecture where data is read or
written from the database for very short amount of time.

Your application rapidly opens and closes connections while the pooler
maintains a set of long-running connections to the database. This improves
performance because the pooler open the connections in advance,  allowing the
application to open many short-lived connections, while the database opens few,
long-lived connections.

## User authentication

By default, the poolers have authentication to the database, so you can use any
custom users you already have set up without further configuration. You can
continue using the `tsdbadmin` user if that is your preferred method. However,
you might need to add custom configurations for some cases such as
`statement_timeout` for a pooler user.

<Procedure>

### Creating a new user with custom settings

1.  Log in to your database as the `tsdbadmin` user, and create a new role named
    `<MY_APP>` with the password as `<PASSWORD>`:

    ```sql
    CREATE ROLE <MY_APP> LOGIN PASSWORD '<PASSWORD>';
    ```

1.  Change the `statement_timeout` settings to 2 seconds for this user

    ```sql
    ALTER ROLE my_app SET statement_timeout TO '2s';
    ```

1.  In a new terminal window, connect on the pooler with the new user `<MY_APP>`:

    ```bash
    ❯ PGPASSWORD=<NEW_PASSWORD> psql 'postgres://my_app@service.project.tsdb.cloud.timescale.com:30477/tsdb?sslmode=require'
    ```

    The output looks something like this:

    <CodeBlock canCopy={false}
    showLineNumbers={true}
    children={`
    psql (15.3 (Homebrew), server 15.4 (Ubuntu 15.4-1.pgdg22.04+1))
    SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, compression: off)
    Type "help" for help.
    `} />

1.  Check that the settings are correct by logging in as the `<MY_APP>` user:

    ```sql
    SELECT current_user;

    ┌──────────────┐
    │ current_user │
    ├──────────────┤
    │ my_app       │
    └──────────────┘
    (1 row)
    ```

    Check the `statement_timeout` setting is correct for the `<MY_APP>` user:
    ```
    tsdb=> show statement_timeout;
    ┌───────────────────┐
    │ statement_timeout │
    ├───────────────────┤
    │ 2s                │
    └───────────────────┘
    (1 row)
    ```

</Procedure>

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

By default, the pooler supports both modes simultaneously. However, the
connection string you use to connect your application is different, depending on
whether you want a session or transaction pool type. When you create a
connection pool in the Timescale console, you are given the correct connection
string for the mode you choose.

For example, a connection string to connect directly to your database looks a
bit like this:

<CodeBlock canCopy={false} showLineNumbers={false} children={`
postgres://<USERNAME>:<PASSWORD>@service.example.cloud.timescale.com:30133/tsdb?sslmode=require
`} />

A session pool connection string is the same, but uses a different port number,
like this:

<CodeBlock canCopy={false} showLineNumbers={false} children={`
postgres://<USERNAME>:<PASSWORD>@service.example.cloud.timescale.com:29303/tsdb?sslmode=require
`} />

The transaction pool connection string uses the same port number as a session
pool connection, but uses a different database name, like this:

<CodeBlock canCopy={false} showLineNumbers={false} children={`
postgres://<USERNAME>:<PASSWORD>@service.example.cloud.timescale.com:29303/tsdb_transaction?sslmode=require
`} />

Make sure you check the Timescale console output for the correct connection
string to use in your application.

## Connection pool sizes

A connection pooler manages connections to both the database itself, and the
client application. It keeps a fixed number of connections open with the
database, while allowing clients to open and close connections. Clients can 
request a connection from the session pool or the transaction pool. The 
connection pooler will then allocate the connection if there is one free.

The number of client connections allowed to each pool is proportional to the
`max_connections` parameter set for the database. The session pool can have a 
maximum of `max_connections - 17` client connections, while the transaction 
pool can have a maximum of `(max_connections - 17) * 20` client connections. 

Of the 17 reserved connections that are not allocated to either pool, 12 are 
reserved for superuser by default, and another 5 for Timescale operations. 

For example, if `max_connections` is set to 500, the maximum number of client 
connections for your session pool is `483 (500 - 17)` and `9,660 (483 * 20)` for 
your transaction pool. The default value of `max_connections` varies depending 
on your service's compute size.

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
1.  By default, you are shown the connection string for the session pool. You
    can change this to see the details for a transaction pool instead, by
    selecting it from the drop-down menu. For more information about the
    different pool types, see the [pool types][about-connection-pooling-types]
    section.

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

1. In [Timescale Cloud Console][tsc-portal], select the service you want to remove a connection pooler from. 
1. Select `Operations`, then `Connection pooling`. 
1. Select the pooler to remove, then click `Remove connection pooler`.

   Confirm that you want to remove the connection pooler. 

After you have removed a pooler, if you add it back in the future, it uses the
same connection string and port that was used before.

</Procedure>

### pgBouncer statistics commands

<Procedure>

1.  Connect to your database.
1.  Switch to the `pgbouncer` database: `\c pgbouncer`
1.  Run any read-only command for the pgBouncer cli (e.g., `SHOW STATS;`).
1.  For full options, see the pgBouncer [docs here][pgbouncer].

</Procedure>

### VPC and connection pooling
VPCs are supported with connection pooling. It does not matter the order you 
add the pooler or connect to a VPC. Your connection strings will automatically 
be updated to use the VPC connection string.

[cloud-login]: https://console.cloud.timescale.com
[about-connection-pooling-types]: /use-timescale/:currentVersion:/services/connection-pooling#pool-types
[pgbouncer]: https://www.pgbouncer.org/usage.html