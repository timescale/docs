import EarlyAccess from "versionContent/_partials/_early_access_2_18_0.mdx";

1. **Stop the jobs that are automatically adding $CHUNKs to the $COLUMNSTORE**

   Retrieve the list of $JOBs from the [timescaledb_information.jobs][informational-views] view
   to find the $JOB you need to [alter_job][alter_job].

   ``` sql
   SELECT alter_job(JOB_ID, scheduled => false);
   ```

1. **Convert a $CHUNK to update back to the $ROWSTORE**

      ``` sql
      CALL convert_to_rowstore('_timescaledb_internal._hyper_2_2_chunk');
      ```

1. **Update the data in the $CHUNK you added to the $ROWSTORE**

   Best practice is to structure your [INSERT][insert] statement to include appropriate
   partition key values, such as the timestamp. TimescaleDB adds the data to the correct $CHUNK:

   ``` sql
   INSERT INTO metrics (time, value)
   VALUES ('2025-01-01T00:00:00', 42);
   ``` 

1. **Convert the updated $CHUNKs back to the $COLUMNSTORE**

   ``` sql
   CALL convert_to_columnstore('_timescaledb_internal._hyper_1_2_chunk');
   ```

1. **Restart the $JOBs that are automatically converting $CHUNKs to the $COLUMNSTORE**

   ``` sql
   SELECT alter_job(JOB_ID, scheduled => true);
   ```

[alter_job]: /api/:currentVersion:/actions/alter_job/
[informational-views]: /api/:currentVersion:/informational-views/jobs/
[insert]: /use-timescale/:currentVersion:/write-data/insert/
[setup-hypercore]: /use-timescale/:currentVersion:/hypercore/real-time-analytics-in-hypercore/
[compression_alter-table]: /api/:currentVersion:/hypercore/alter_table/
