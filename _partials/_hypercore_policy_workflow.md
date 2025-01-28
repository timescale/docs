1. **Enable columnstore**

   * [Use `ALTER TABLE` for a hypertable][alter_table_hypercore]
     ```sql
     ALTER TABLE stocks_real_time SET (timescaledb.enable_columnstore = true, timescaledb.segmentby = 'symbol');
     ```
   * [Use ALTER MATERIALIZED VIEW for a continuous aggregate][compression_continuous-aggregate]
     ```sql
     ALTER MATERIALIZED VIEW stock_candlestick_daily set (timescaledb.enable_columnstore = true, timescaledb.segmentby = 'symbol' );
     ```

1. **Add a policy to move chunks to the columnstore at a specific time interval**

   For example, 60 days after the data was added to the table:
   ``` sql
   CALL add_columnstore_policy('older_stock_prices', after => INTERVAL '60d');
   ```
   See [add_columnstore_policy][add_columnstore_policy].

1. **View the policies that you set or the policies that already exist**

   ``` sql
   SELECT * FROM timescaledb_information.jobs
   WHERE proc_name='policy_compression';
   ```
   See [timescaledb_information.jobs][informational-views].

1. **Pause a columnstore policy**

   ``` sql
   SELECT * FROM timescaledb_information.jobs where proc_name = 'policy_compression' AND relname = 'stocks_real_time'
   
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


[alter_table_hypercore]: /api/:currentVersion:/hypercore/alter_table/
[alter_job]: /api/:currentVersion:/actions/alter_job/
[add_columnstore_policy]: /api/:currentVersion:/hypercore/add_columnstore_policy/
[informational-views]: /api/:currentVersion:/informational-views/jobs/
[remove_columnstore_policy]: /api/:currentVersion:/hypercore/remove_columnstore_policy/
[convert_to_rowstore]: /api/:currentVersion:/hypercore/convert_to_rowstore/
