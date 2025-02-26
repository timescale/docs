
1. **Connect to your $SERVICE_LONG**

   In [$CONSOLE][services-portal] open an [SQL editor][in-console-editors]. You can also connect to your service using [psql][connect-using-psql].

1. **Enable columnstore on a hypertable**

   Create a [job][job] that automatically moves chunks in a hypertable to the columnstore at a specific time interval. 
   By default, your table is `orderedby` the time column. For efficient queries on columnstore data, remember to
   `segmentby` the column you will use most often to filter your data:

   * [Use `ALTER TABLE` for a hypertable][alter_table_hypercore]
     ```sql
     ALTER TABLE stocks_real_time SET (
        timescaledb.enable_columnstore = true, 
        timescaledb.segmentby = 'symbol');
     ```
   * [Use ALTER MATERIALIZED VIEW for a continuous aggregate][compression_continuous-aggregate]
     ```sql
     ALTER MATERIALIZED VIEW stock_candlestick_daily set (
        timescaledb.enable_columnstore = true, 
        timescaledb.segmentby = 'symbol' );
     ``` 
     Before you say `huh`, a continuous aggregate is a specialized hypertable.
 
1. **Add a policy to convert chunks to the columnstore at a specific time interval**

   For example, move data that is greater than 8 days old to the columnstor:
   ``` sql
   CALL add_columnstore_policy('stocks_real_time', after => INTERVAL '8d');
   ```
   See [add_columnstore_policy][add_columnstore_policy].
   
1. **Check the columstore policy**

   1. View your data space saving:
   
      When you convert data to the columnstore, as well as being optimized for analytics, it is compresses by more than 
      90%. This saves on storage costs and keeps your queries operating at lightning speed. To see the amount of space 
      saved:

      ``` sql
      SELECT 
        pg_size_pretty(before_compression_total_bytes) as before,
        pg_size_pretty(after_compression_total_bytes) as after
      FROM hypertable_compression_stats('stocks_real_time');
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

1. **Pause a columnstore policy**

   If you need to modify or add a lot of data to a chunk in the columnstore, best practice is to stop any jobs moving 
   chunks to the columnstore, [convert the chunk back to the rowstore][convert_to_rowstore], then modify the data. 
   After the update, [convert the chunk to the columnstore][convert_to_columnstore] and restart the jobs. 

   ``` sql
   SELECT * FROM timescaledb_information.jobs where 
      proc_name = 'policy_compression' AND relname = 'stocks_real_time'
   
   -- Select the JOB_ID from the results
     
   SELECT alter_job(JOB_ID, scheduled => false);
   ```
   See [alter_job][alter_job].

1. **Restart a columnstore policy**

   ``` sql
   SELECT alter_job(JOB_ID, scheduled => true);
   ```
   See [alter_job][alter_job].

1. **Remove a columnstore policy**

   ``` sql
   CALL remove_columnstore_policy('older_stock_prices');
   ```
   See [remove_columnstore_policy][remove_columnstore_policy].

1. **Disable columnstore**

   If your table has chunks in the columnstore, you have to
   [convert the chunks back to the rowstore][convert_to_rowstore] before you disable the columnstore.
   ``` sql
   ALTER TABLE stocks_real_time SET (timescaledb.enable_columnstore = false);
   ```
   See [alter_table_hypercore][alter_table_hypercore]. 


[job]: /api/:currentVersion:/actions/add_job/
[alter_table_hypercore]: /api/:currentVersion:/hypercore/alter_table/
[compression_continuous-aggregate]: /api/:currentVersion:/hypercore/alter_materialized_view/
[convert_to_rowstore]: /api/:currentVersion:/hypercore/convert_to_rowstore/
[convert_to_columnstore]: /api/:currentVersion:/hypercore/convert_to_columnstore/
[informational-views]: /api/:currentVersion:/informational-views/jobs/
[add_columnstore_policy]: /api/:currentVersion:/hypercore/add_columnstore_policy/
[hypercore_workflow]: /api/:currentVersion:/hypercore/#hypercore-workflow
[alter_job]: /api/:currentVersion:/actions/alter_job/
[remove_columnstore_policy]: /api/:currentVersion:/hypercore/remove_columnstore_policy/
[in-console-editors]: /getting-started/:currentVersion:/run-queries-from-console/
[services-portal]: https://console.cloud.timescale.com/dashboard/services
[connect-using-psql]: /use-timescale/:currentVersion:/integrations/query-admin/psql#connect-to-your-service
[insert]: /use-timescale/:currentVersion:/write-data/insert/
