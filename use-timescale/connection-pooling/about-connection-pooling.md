---
title: About connection pooling
excerpt: Learn how connection pooling works in
Timescale products: [cloud] keywords: [connection pooling, connection pooler,
pooler, connections]
cloud_ui:
    path:
        - [services, :serviceId]
---

import EarlyAccess from "versionContent/_partials/_early_access.mdx";

# Connection pooling

You can scale your Timescale connections and improve your database performance
using connection poolers. Timescale uses pgBouncer for connection pooling.

<EarlyAccess />

Connection pooling rapidly opens and closes connections, while the pooler
maintains a set of long-running connections to the database. This improves
performance because the pooler allows the application to open many short-lived
connections, while the database opens few, long-lived connections.

If your database needs a large number of short-lived connections, a connection
pooler is a great way to improve performance. For example, web, serverless, and
IoT applications often use an event-based architecture where data is read or
written from the database for very short amount of time.
