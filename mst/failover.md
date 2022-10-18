---
title: Failover
excerpt: Learn how maintenance is automatically handled on Managed Service for TimescaleDB
product: mst
keywords: [maintenance, update, upgrade, failover]
tags: [failover window]
---


# Failover in Managed Service for TimescaleDB

One standby read-only replica server is configured, for Managed Service for
TimescaleDB on a Pro plan. You can query a read-only replica server, but cannot
write to a read-only replica server. When a master server fails, the standby replica
server is automatically promoted as master. If you manually created a read-only
replica service, then if a master server fails, the read-only replica services
are not promoted as master servers.

The two distinct cases during which failovers occur are:

*   When unexpectedly master or replica fail because of the hardware hosting the
    virtual machine fails.
*   When controlled failover happens because of upgrades.

## Uncontrolled master or replica fail

When a replica server fail unexpectedly, there is no way to know
whether the server really failed, or whether there is a temporary network
glitch with cloud provider's network.

There is a 300 seconds timeout before Managed Service for TimescaleDB
automatically decides the server is gone and spins up a replica new server.
During this 300 second the `replica.servicename.timescaledb.io` points to a
server that may not serve queries anymore. DNS record pointing to the master
server `servicename.timescaledb.io` continue to serve the queries. If replica
server does not come back up within this 300 seconds,
`replica.servicename.timescaledb.io` points to the master server, until a new
replica server is built.

When the master server fails, a replica server waits for 60 seconds before
promoting itself as master. During this 60 second timeout the master server
`servicename.timescaledb.io` remains unavailable and does not respond. However,
`replica.servicename.timescaledb.io` works in read-only mode. After the replica
server promotes itself as master, `servicename.timescaledb.io` points to the new
master server, and `replica.servicename.timescaledb.io` continues to point to
the new master server. New replica server is built automatically, and after it
is in sync, `replica.servicename.timescaledb.io` points to the new replica
server.

## Controlled failover during upgrades

When applying upgrades or plan changes or business or premium plans, the standby
server are replaced:

A new server is started, and the backup is restored, and the new server starts
following the old master server. After the new server is up and running,
`replica.servicename.timescaledb.io` is updated, and old replica server is
deleted.

For premium plans this step is executed for both replica servers before master
server is replaced. Two new servers are started, backup is restored, and one new
server is synced up to old master server. When it is time to switch the master
to a new server, the old master is terminated and one of the new replica servers
is immediately promoted as a master. At this point `servicename.timescaledb.io`
is updated to point at the new master server. Similarly, the new master is
removed from `replica.servicename.timescaledb.io` record.
