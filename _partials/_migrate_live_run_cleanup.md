1. **Validate the migrated data**

   The contents of both databases should be the same. To check this you could compare 
   the number of rows, or an aggregate of columns. However, the best validation method
   depends on your app.

1. **Stop app downtime**

   Once you are confident that your data is successfully replicated, configure your apps
   to use your Timescale Cloud service.

1. **Cleanup resources associated with live-migration from your migration machine**

   This command removes all resources and temporary files used in the migration process. 
   When you run this command, you can no longer resume live-migration. 

   ```shell
   docker run --rm -it --name live-migration-clean \
       -e PGCOPYDB_SOURCE_PGURI=$SOURCE \
       -e PGCOPYDB_TARGET_PGURI=$TARGET \
       --pid=host \
       -v ~/live-migration:/opt/timescale/ts_cdc \
       timescale/live-migration clean --prune
   ```
