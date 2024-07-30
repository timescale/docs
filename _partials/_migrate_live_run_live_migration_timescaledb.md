2. **Pull the live-migration docker image to you migration machine**

   ```shell
   sudo docker pull timescale/live-migration
   ```
   To list the available commands, run:
   ```shell
   sudo docker run --rm -it -e PGCOPYDB_SOURCE_PGURI=$SOURCE  timescale/live-migration --help
   ```
   To see the available flags for each command, run `--help` for that command. For example:
   ```shell
   sudo docker run --rm -it -e PGCOPYDB_SOURCE_PGURI=$SOURCE  timescale/live-migration migrate --help
   ```
 
1. **Create a snapshot image of your source database in your Timescale Cloud service**

   This process checks that you have tuned your source database and target service correctly for replication, 
   then creates a snapshot of your data on the migration machine:

   ```shell
   docker run --rm -it --name live-migration-snapshot \
       -e PGCOPYDB_SOURCE_PGURI=$SOURCE \
       -e PGCOPYDB_TARGET_PGURI=$TARGET \
       --pid=host \
       -v ~/live-migration:/opt/timescale/ts_cdc \
       timescale/live-migration:v0.0.20 snapshot
   ```

   Live-migration supplies information about updates you need to make to the source database and target service. For example:   

   ```shell
   2024-03-25T12:40:40.884 WARNING: The following tables in the Source DB have neither a primary key nor a REPLICA IDENTITY (FULL/INDEX)
   2024-03-25T12:40:40.884 WARNING: UPDATE and DELETE statements on these tables will not be replicated to the Target DB
   2024-03-25T12:40:40.884 WARNING:        - public.metrics
   Press 'c' and ENTER to continue
   ```

   If you have warnings, stop live-migration, make the suggested changes and start again.

1. **Synchronize data between your source database and your Timescale Cloud service**

    This command migrates data from the snapshot to your Timescale Cloud service, then streams 
    transactions from the source to the target. 

   ```shell
   docker run --rm -it --name live-migration-migrate \
       -e PGCOPYDB_SOURCE_PGURI=$SOURCE \
       -e PGCOPYDB_TARGET_PGURI=$TARGET \
       --pid=host \
       -v ~/live-migration:/opt/timescale/ts_cdc \
       timescale/live-migration:v0.0.20 migrate
   ```
   
   During this process, you see the migration process:

   ```shell
   Live-replay will complete in 1 minute 38.631 seconds (source_wal_rate: 106.0B/s, target_replay_rate: 589.0KiB/s, replay_lag: 56MiB)
   ```

   If `migrate` stops add `--resume` to start from where it left off. 

   Once the data in your target Timescale Cloud service has almost caught up with the source database, 
   you see the following message:

   ```shell
   Target has caught up with source (source_wal_rate: 751.0B/s, target_replay_rate: 0B/s, replay_lag: 7KiB)
       To stop replication, hit 'c' and then ENTER
   ```
   
   Wait until `replay_lag` is down to a few kilobytes before you move to the next step. Otherwise, data 
   replication may not have finished.

1. **Start app downtime**

   1. Stop your app writing to the source database, then let the the remaining transactions 
      finish to fully sync with the target. You can use tools like the `pg_top` CLI or 
      `pg_stat_activity` to view the current transaction on the source database. 

   1. Stop Live-migration. 
   
      ```shell
      hit 'c' and then ENTER
      ```

      Live-migration continues the remaining work. This includes copying
      TimescaleDB metadata, sequences, and run policies. When the migration completes,
      you see the following message:
   
      ```sh
      Migration successfully completed
      ```

[Hypertable docs]: /use-timescale/:currentVersion:/hypertables/
