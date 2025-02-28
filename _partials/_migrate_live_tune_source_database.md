import EnableReplication from "versionContent/_partials/_migrate_live_setup_enable_replication.mdx";

You need admin rights to to update the configuration on your source database. If you are using
a managed service, follow the instructions in the `From MST` tab on this page. 

1. **Install the `wal2json` extension on your source database**

   [Install wal2json][install-wal2json] on your source database.

1. **Prevent PostgreSQL from treating the data in a snapshot as outdated**

   ```shell
   psql -X -d $SOURCE -c 'alter system set old_snapshot_threshold=-1'
   ```
   This is not applicable if the source database is PostgreSQL 17 or later.

1. **Set the write-Ahead Log (WAL) to record the information needed for logical decoding**
   ```shell
   psql -X -d $SOURCE -c 'alter system set wal_level=logical'
   ```

1. **Restart the source database** 

   Your configuration changes are now active. However, verify that the
   settings are live in your database.  

1. **Enable live-migration to replicate `DELETE` and`UPDATE` operations**

   <EnableReplication />

[install-wal2json]: https://github.com/eulerto/wal2json
