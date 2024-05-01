---
title: FAQ
excerpt: Live-migration Frequently Asked Questions
products: [cloud]
keywords: [migration, low-downtime, live-migration, FAQ]
tags: [migration, logical backup, replication]
---

# Frequently Asked Questions

This document addresses frequently asked questions and common scenarios you may
encounter during live migration.


## Where can I find logs for processes running during live migration?

Live migration involves several background processes to manage different stages of
the migration. The logs of these processes can be helpful for troubleshooting
unexpected behavior. You can find these logs in the `<volume_mount>/logs` directory.


## Why does live migration log "no tuple identifier" warning?

Live migration logs a warning `WARNING: no tuple identifier for UPDATE in table`
when it cannot determine which specific rows should be updated after receiving an
`UPDATE` statement from the source database during replication. This occurs when tables
in the source database that receive `UPDATE` statements lack either a `PRIMARY KEY` or
a `REPLICA IDENTITY` setting. For live migration to successfully replicate `UPDATE` and
`DELETE` statements, tables must have either a `PRIMARY KEY` or `REPLICA IDENTITY` set
as a prerequisite.


## Set REPLICA IDENTITY on PostgreSQL partitioned tables

If your PostgreSQL tables use native partitioning, setting `REPLICA IDENTITY` on the
root (parent) table will not automatically apply it to the partitioned child tables.
You must manually set `REPLICA IDENTITY` on each partitioned child table.


## Can I use read/failover replicas as source database for live migration?

Live migration does not support replication from read or failover replicas. You must
provide a connection string that points directly to your source database for
live migration.


## Can I use Timescale Cloud instance as source for live migration?

No, Timescale Cloud cannot be used as a source database for live migration.


## How can I exclude a schema/table from being replicated in live migration?

At present, live migration does not allow for excluding schemas or tables from
replication, but this feature is expected to be added in future releases.
