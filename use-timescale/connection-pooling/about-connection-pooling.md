---
title: About connection pooling
excerpt: Learn how connection pooling works in
Timescale products: [cloud] keywords: [connection pooling, connection pooler,
pooler, connections]
cloud_ui:
    path:
        - [services, :serviceId]
---

import PoolingIntro from "versionContent/_partials/_early_access.mdx";
import EarlyAccess from "versionContent/_partials/pooling-intro.mdx";

# Connection pooling

<PoolingIntro />

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
