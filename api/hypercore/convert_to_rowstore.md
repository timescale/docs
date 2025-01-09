---
api_name: convert_to_rowstore()
excerpt: Move a chunk from the columnstore to the rowstore
topics: [columnstore, hypercore]
keywords: [columnstore, hypercore, rowstore, chunks, backfilling]
api:
  license: community
  type: function
---

# convert_to_rowstore() <Tag type="community">Community</Tag>

Move a chunk of data from the columnstore to the rowstore.

If you need to modify or add a lot of data to a chunk in the columnstore, best practice is to stop 
any [jobs][job] moving chunks to the columnstore, convert the chunk back to the rowstore, then modify the 
data. After the update, [convert the chunk to the columnstore][convert_to_columnstore] and restart the jobs.
This workflow is especially useful if you need to backfill old data.


**@since [TimescaleDB v2.18.0](https://github.com/timescale/timescaledb/releases/tag/2.18.0)**

## Samples

To modify or add a lot of data to a chunk:

<Procedure>

1. **Stop the [jobs][alter_job] that are automatically adding chunks to the columnstore** 
   ``` sql
   SELECT alter_job(JOB_ID, scheduled => false);
   ```
   You retrieve the list of jobs from the [timescaledb_information.jobs][informational-views] view.
   
1. **Convert the chunks to update back to the rowstore** 

   - Convert single chunk:

      ``` sql
      SELECT convert_to_rowstore('_timescaledb_internal._hyper_2_2_chunk');
      ```

   - Convert all chunks in a hypertable named `metrics`:

      ``` sql
      SELECT convert_to_rowstore(c, true) FROM show_chunks('metrics') c;
      ```

1. **[Update the data][insert] in the chunk you added to the rowstore**

    Best practice is to structure your INSERT statement to include appropriate 
    partition key values, such as the timestamp. TimescaleDB adds the data to the correct chunk:

   ``` sql
   INSERT INTO metrics (time, value)
   VALUES ('2025-01-01T00:00:00', 42);
   ``` 
   
1. **Convert the updated chunks back to the columnstore**
   ``` sql
   SELECT convert_to_columnstore('_timescaledb_internal._hyper_1_2_chunk');
   ```
   
1. **Restart the [jobs][alter_job] that are automatically adding chunks to the columnstore**
   ``` sql
   SELECT alter_job(JOB_ID, scheduled => true);
   ```

</Procedure>

## Arguments

| Name | Type | Default | Required | Description                                                                                                |
|--|--|--|--|------------------------------------------------------------------------------------------------------------|
|`chunk`|`REGCLASS`|-|✖| Name of the chunk to be moved to the rowstore.                                                             |
|`if_compressed`|`BOOLEAN`|`true`|✔| Set to `false` so this job fails with an error rather than an warning if `chunk` is not in the columnstore |

[job]: /api/:currentVersion:/actions/
[alter_job]: /api/:currentVersion:/actions/alter_job/
[convert_to_columnstore]: /api/:currentVersion:/hypercore/convert_to_columnstore/
[informational-views]: /api/:currentVersion:/informational-views/jobs/
[insert]: /use-timescale/:currentVersion:/write-data/insert/
