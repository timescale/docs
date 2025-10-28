import OldCreateHypertable from "versionContent/_partials/_old-api-create-hypertable.mdx";
import CreateHypertableProcedure from "versionContent/_partials/_hypercore_create_hypertable_columnstore_policy.mdx";

<Procedure>

1. **Connect to your $SERVICE_LONG**

   In [$CONSOLE][services-portal] open an [SQL editor][in-console-editors]. You can also connect to your $SERVICE_SHORT using [psql][connect-using-psql].

<CreateHypertableProcedure />

1. **Check the $COLUMNSTORE policy**

   1. View your data space saving:
   
      When you convert data to the $COLUMNSTORE, as well as being optimized for analytics, it is compressed by more than 
      90%. This helps you save on storage costs and keeps your queries operating at lightning speed. To see the amount of space 
      saved:

      ``` sql
      SELECT 
        pg_size_pretty(before_compression_total_bytes) as before,
        pg_size_pretty(after_compression_total_bytes) as after
      FROM hypertable_columnstore_stats('crypto_ticks');
      ```
      You see something like:
   
      | before	 | after  |
      |---------|--------|
      | 194 MB  | 	24 MB |
      
   1. View the policies that you set or the policies that already exist:

      ``` sql
      SELECT * FROM timescaledb_information.jobs
      WHERE proc_name='policy_compression';
      ```
      See [timescaledb_information.jobs][informational-views].

1. **Pause a $COLUMNSTORE policy**

   ``` sql
   SELECT * FROM timescaledb_information.jobs where 
      proc_name = 'policy_compression' AND relname = 'crypto_ticks'
   
   -- Select the JOB_ID from the results
     
   SELECT alter_job(JOB_ID, scheduled => false);
   ```
   See [alter_job][alter_job].

1. **Restart a $COLUMNSTORE policy**

   ``` sql
   SELECT alter_job(JOB_ID, scheduled => true);
   ```
   See [alter_job][alter_job].

1. **Remove a $COLUMNSTORE policy**

   ``` sql
   CALL remove_columnstore_policy('crypto_ticks');
   ```
   See [remove_columnstore_policy][remove_columnstore_policy].

1. **Disable $COLUMNSTORE**

   If your table has $CHUNKs in the $COLUMNSTORE, you have to
   [convert the $CHUNKs back to the $ROWSTORE][convert_to_rowstore] before you disable the $COLUMNSTORE.
   ``` sql
   ALTER TABLE crypto_ticks SET (timescaledb.enable_columnstore = false);
   ```
   See [alter_table_hypercore][alter_table_hypercore]. 

</Procedure>

[job]: /api/:currentVersion:/actions/add_job/
[alter_table_hypercore]: /api/:currentVersion:/hypercore/alter_table/
[compression_continuous-aggregate]: /api/:currentVersion:/continuous-aggregates/alter_materialized_view/
[convert_to_rowstore]: /api/:currentVersion:/hypercore/convert_to_rowstore/
[convert_to_columnstore]: /api/:currentVersion:/hypercore/convert_to_columnstore/
[informational-views]: /api/:currentVersion:/informational-views/jobs/
[add_columnstore_policy]: /api/:currentVersion:/hypercore/add_columnstore_policy/
[hypercore_workflow]: /api/:currentVersion:/hypercore/#hypercore-workflow
[alter_job]: /api/:currentVersion:/actions/alter_job/
[remove_columnstore_policy]: /api/:currentVersion:/hypercore/remove_columnstore_policy/
[in-console-editors]: /getting-started/:currentVersion:/run-queries-from-console/
[services-portal]: https://console.cloud.timescale.com/dashboard/services
[connect-using-psql]: /integrations/:currentVersion:/psql/#connect-to-your-service
[insert]: /use-timescale/:currentVersion:/write-data/insert/
[hypertables-section]: /use-timescale/:currentVersion:/hypertables/
[hypertable-create-table]: /api/:currentVersion:/hypertable/create_table/
[hypercore]: /use-timescale/:currentVersion:/hypercore/
[secondary-indexes]: /use-timescale/:currentVersion:/hypercore/secondary-indexes/
