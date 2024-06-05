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


## Source and target databases have different TimescaleDB versions

When you migrate a [self-hosted][self hosted] or [Managed Service for TimescaleDB (MST)][mst]
database to Timescale, the source database and the destination
[Timescale Service][timescale-service] must run the same version of TimescaleDB.

Before you start [live migration][live migration]:


1. Check the version of TimescaleDB running on the source database and the
   target Timescale Service:
    ```sql
    select extversion from pg_extension where extname = 'timescaledb';
    ```

1. If the version of TimescaleDB on the source database is lower than your Timescale Service, either:
   - **Downgrade**: reinstall an older version of TimescaleDB on your Timescale
      Service that matches the source database:

     1. Connect to your Timescale Service and check the versions of TimescaleDB available:
        ```sql
        SELECT version FROM pg_available_extension_versions WHERE name = 'timescaledb' ORDER BY 1 DESC;
        ```

     2. If an available TimescaleDB release matches your source database:

        1. Uninstall TimescaleDB from your Timescale Service:
           ```sql
           DROP EXTENSION timescaledb;
           ```

        1. Reinstall the correct version of TimescaleDB:
           ```sql
           CREATE EXTENSION timescaledb VERSION '<version>';
           ```

        <Highlight type="note">
        You may need to reconnect to your Timescale Service using `psql -X` when you're creating the TimescaleDB extension.
        </Highlight>

   - **Upgrade**: for self-hosted databases,
     [upgrade TimescaleDB][self hosted upgrade] to match your Timescale Service.

[live migration]: /migrate/:currentVersion:/live-migration/
[self hosted]: /self-hosted/:currentVersion:/
[self hosted upgrade]: /self-hosted/:currentVersion:/upgrades/
[mst]: /mst/:currentVersion:/
[timescale-service]: https://console.cloud.timescale.com/dashboard/services


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


## Can I use live migration with a Postgres connection pooler like PgBouncer?

Live migration does not support connection poolers. You must provide a
connection string that points directly to your source and target databases
for live migration to work smoothly.


## Can I use Timescale Cloud instance as source for live migration?

No, Timescale Cloud cannot be used as a source database for live migration.


## How can I exclude a schema/table from being replicated in live migration?

At present, live migration does not allow for excluding schemas or tables from
replication, but this feature is expected to be added in future releases.
However, a workaround is available for skipping table data using the `--skip-table-data` flag.
For more information, please refer to the help text under the `migrate` subcommand.


## "target_replay_rate" is 0B/s even after waiting for several minutes

This is a known issue with live migration. In some cases, live migration may log the
following progress information.

```sh
WARNING: live-replay not keeping up with source load (source_wal_rate: 2.0MiB/s, target_replay_rate: 0B/s, replay_lag: 288MiB)
```

This means that live migration is not replicating changes to the target, causing the
replay lag to keep increasing. If you see the `target_replay_rate` at `0B/s` for more
than 10 minutes, a workaround is to stop the live migration using `CTRL + C` and
resume it using the resume flag: `./live-migration migrate --resume`.
This will restart the `migrate` process from where it left, and the `target_replay_rate` should no
longer be `0B/s`. If the issue persists, please reach out to the Timescale migration team
or share it in the `#migration` channel on Timescale community Slack.
