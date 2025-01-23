import EnableReplication from "versionContent/_partials/_migrate_live_setup_enable_replication.mdx";

1. **Check your database is correctly tuned for migration**

   These are the default values for MST. 
 
   - Prevent PostgreSQL from treating the data in a snapshot as outdated:

    ```sh
    psql -X -d $SOURCE -c 'alter system set old_snapshot_threshold=-1'
    ```

   - Set the write-Ahead Log (WAL) to record the information needed for logical decoding:
   
     ```shell
     psql -X -d $SOURCE -c 'alter system set wal_level=logical'
     ```

1. **Restart the source database**

   Your configuration changes are now active. However, verify that the
   settings are live in your database.

1. **Enable live-migration to replicate `DELETE` and`UPDATE` operations**

   <EnableReplication />
   
[mst-portal]: https://portal.managed.timescale.com/login