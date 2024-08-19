import EnableReplication from "versionContent/_partials/_migrate_live_setup_enable_replication.mdx";

You need admin rights to to update the configuration on your source database. If you are using 
a managed service, follow the instructions in the `From MST` tab on this page. 

1. **Prevent PostgreSQL from treating the data in a snapshot as outdated**
   
   ```shell
   psql -X -d $SOURCE -c 'alter system set old_snapshot_threshold=-1'
   ```

1. **Restart the source database** 
   
   Your configuration changes are now active. However, verify that the
   settings are live in your database.  

1. **Enable live-migration to replicate `DELETE` and`UPDATE` operations**

   <EnableReplication />

[install-wal2json]: https://github.com/eulerto/wal2json