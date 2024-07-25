import EnableReplication from "versionContent/_partials/_migrate_live_setup_enable_replication.mdx";

**IAIN**: I can't see how to do this in MST.

1. **Open MST Portal**

   In the [Managed Service for TimescaleDB Portal][mst-portal], update the following parameters for
   the database you want to migrate:
   
   <img class="main-content__illustration"
   src="https://assets.timescale.com/docs/images/mts-portal-configure.png"
   alt="MST configuration" />

   - Prevent PostgreSQL from treating the data in a snapshot as outdated
     ```shell
     old_snapshot_threshold=-1
     ```

   - Set the write-Ahead Log (WAL) to record the information needed for logical decoding
     ```shell
     wal_level=logical
     ```
     If this command throws an error, [install wal2json](https://github.com/eulerto/wal2json) on
     your source database. 

1. **Restart the source database**

   Your configuration changes are now active. However, verify that the
   settings are live in your database.

1. **Enable live-migration to replicate `DELETE` and`UPDATE` operations**

   <EnableReplication />
   
[mst-portal]: https://portal.managed.timescale.com/login