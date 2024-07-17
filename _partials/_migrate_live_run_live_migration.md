1. **Pull the live-migration docker image to you migration machine**

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

   If best practice is to make changes to the source and target, live-migration supplies information. For example:   

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
 
   After migrating the schema, live-migration prompts you to create hypertables for tables that 
   contain time-series data in your Timescale Cloud service. Run `create_hypertable()` to convert these
   table. For more information, see the [Hypertable docs][Hypertable docs].   

   During this process, you see the migration process:

   ```shell
   Live-replay will complete in 1 minute 38.631 seconds (source_wal_rate: 106.0B/s, target_replay_rate: 589.0KiB/s, replay_lag: 56MiB)
   ```

   If `migrate` stops add `--resume` and restart the command. 

   Once the data is coordinated, you see the following message:

   ```shell
   Target has caught up with source (source_wal_rate: 751.0B/s, target_replay_rate: 0B/s, replay_lag: 7KiB)
       To stop replication, hit 'c' and then ENTER
   ```

1. **Start app downtime**

   ```shell
   hit 'c' and then ENTER
   ```

   live-migration continues the remaining work. This includes copying
   TimescaleDB metadata, sequences, and run policies. When the migration completes,
   you see the following message:
   
   ```sh
   Migration successfully completed
   ```

[Hypertable docs]: /use-timescale/:currentVersion:/hypertables/
