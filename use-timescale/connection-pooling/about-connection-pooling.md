# Connection pooling
---
title: About connection pooling
excerpt: Learn how connection pooling works in Timescale
products: [cloud]
keywords: [connection pooling, connection pooler, pooler, connections]
cloud_ui:
    path:
        - [services, :serviceId]
---

# Connection pooling

You can add connection poolers to your services on Timescale to help scale your
connections and improve the performance of your database. Timescale uses
pgBouncer for connection pooling.

## Common use cases

Connection poolers are great for any application that opens many short-lived
connections. Examples of this include web applications, serverless
applications, and IOT applications. These use cases often use an event-based
architecture (e.g., user click, lambda, measurement) where data is read or
written from the database for very short amount of time.

These use cases are good matches for connection pooling as a pooler allows you
to rapidly open and close connections to the pooler, while the pooler is able
to maintain a set of long-running connections to the database, which improves
performance. The pooler is transparent to the application, which allows the
application to get what it wants (many short-lived connections) while allowing
the database to have what it wants (few, long-lived connections). 

## About the beta

Connection pooling on Timescale is currently in public beta. For the duration of
the beta, connection pooling will be free, but we will likely charge for
connection pooling after the beta ends. During the beta, we do not recommend
using it for production use as we may deploy changes outside of standard
maintenance windows.