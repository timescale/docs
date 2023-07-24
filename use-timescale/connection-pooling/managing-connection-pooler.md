---
title: Managing connection pooler
excerpt: Learn how to add, delete, and manage your connection pooler
products: [cloud]
keywords: [connection pooling, connection pooler, pooler, connections]
cloud_ui:
    path:
        - [services, :serviceId]
---

# Managing a connection pooler

Timescale makes managing a connection pooler seamless, with adding and deleting a connection pooler possible with the click of a button.

<Procedure>

### Adding a connection pooler

1.  [Log in to your Timescale account][cloud-login] and click the service
    you want to replicate.
1.  Navigate to the service you would like to add a connection pooler
 to.
1.  Under `Connection info`, click the `Connection pooler` tab and
click `+ Add connection pooler`.
1.  Confirm the modal by clicking `Add pooler`.
1.  You can now select which pool you would like to connect to and get
 information on how to connect by clicking `How to connect?`

</Procedure>

<Procedure>

### Removing a connection pooler

1.  [Log in to your Timescale account][cloud-login] and click the service
    you want to replicate.
1.  Navigate to the service you would like to remove a connection
pooler from.
1.  Under `Connection info`, click the `Connection pooler` tab.
1.  In the bottom right corner, click `Remove connection pooler`
1.  Confirm the modal by clicking `Remove pooler`.
1.  Make sure you update your application to adjust the port used to
connect to your service if you were connecting through the pooler.
1.  If you add a pooler back in the future, it will have the same
connection string (and port) that was used before.

</Procedure>

### About connection pools

By default, the pooler has two pools available: session and transaction.
Each pool uses a different mode to handle connections. Session pools
handle connections similar to a standard Postgres connection. Session pool
connections remain open until they are closed by the application.
Transaction pools close connections automatically at the end of each
transaction. For improved performance for applications that open and close
connections frequently, it is recommended to primarily use the transaction pool.

The number of connections available in each pool is a function of
`max_connections`. The pooler will use 60% of the total `max_connections`. 3/4
of these (45% of `max_connections`) will be for the session pool, and 1/4 of
these (15% of `max_connections`) will be available in the transaction pool.



[cloud-login]: https://console.cloud.timescale.com
