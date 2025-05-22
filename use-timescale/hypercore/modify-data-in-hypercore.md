---
title: Modify data in hypercore
excerpt: Update data and the table schema in the columnstore
products: [cloud, self_hosted]
keywords: [hyperscore, hypertable, compression, row-columnar storage, hypercore]
---

import PrereqCloud from "versionContent/_partials/_prereqs-cloud-and-self.mdx";
import HypercoreManualWorkflow from "versionContent/_partials/_hypercore_manual_workflow.mdx";

# Modify your data in $HYPERCORE

You [set up $HYPERCORE][setup-hypercore] to automatically convert data between the $ROWSTORE and $COLUMNSTORE
when it reaches a certain age. After you have optimized data in the $COLUMNSTORE, you may need to modify it. 
For example, to make small changes, or backfill large amounts of data. You may even have to update the schema to 
accommodate these changes to the data.

This page shows you how to update small and large amounts of new data, and update the schema in the $COLUMNSTORE.

## Prerequisites

<PrereqCloud />

- [Optimize your data][setup-hypercore] for real-time analytics.

## Modify small amounts of data

You can [`INSERT`, `UPDATE`, and `DELETE`][write] data in the $COLUMNSTORE, even if the data you are 
inserting has unique constraints. When you insert data into a $CHUNK in the $COLUMNSTORE, a small amount 
of data is decompressed to allow a speculative insertion, and block any inserts that could violate the 
constraints.

When you `DELETE` whole segments of data, filter your deletes using the column you `segment_by` 
instead of separate deletes. This considerably increases performance.

## Modify large amounts of data

If you need to modify or add a lot of data to a $CHUNK in the $COLUMNSTORE, best practice is to stop
any [$JOBs][job] moving $CHUNKs to the $COLUMNSTORE, convert the $CHUNK back to the $ROWSTORE, then modify the
data. After the update, [convert the $CHUNK to the $COLUMNSTORE][convert_to_columnstore] and restart the jobs.
This workflow is especially useful if you need to backfill old data.

<Procedure>

<HypercoreManualWorkflow />

</Procedure>

## Modify a table schema for data in the $COLUMNSTORE

You can modify the schema of a table in the $COLUMNSTORE. To do this, you need to:

<Procedure>

1. **Stop the $JOBs that are automatically adding $CHUNKs to the $COLUMNSTORE**

   Retrieve the list of $JOBs from the [timescaledb_information.jobs][informational-views] view
   to find the $JOB you need to [alter_job][alter_job].

   ``` sql
   SELECT alter_job(JOB_ID, scheduled => false);
   ```

1. **Convert a $CHUNK to update back to the $ROWSTORE**

      ``` sql
      CALL convert_to_rowstore('_timescaledb_internal._hyper_2_2_chunk');
      ```

2. **Modify the schema**:

   Possible modifications are: 

   - Add a nullable column:
   
      `ALTER TABLE <hypertable> ADD COLUMN <column_name> <datatype>;`                                 
   - Add a column with a default value and a `NOT NULL` constraint:

      `ALTER TABLE <hypertable> ADD COLUMN <column_name> <datatype> NOT NULL DEFAULT <default_value>;` 
   - Rename a column:

     `ALTER TABLE <hypertable> RENAME <column_name> TO <new_name>;` 
   - Drop a column:

     `ALTER TABLE <hypertable> DROP COLUMN <column_name>;`
   
   You cannot change the data type of an existing column.

1. **Convert the updated $CHUNKs back to the $COLUMNSTORE**

   ``` sql
   CALL convert_to_columnstore('_timescaledb_internal._hyper_1_2_chunk');
   ```

1. **Restart the $JOBs that are automatically converting $CHUNKs to the $COLUMNSTORE**

   ``` sql
   SELECT alter_job(JOB_ID, scheduled => true);
   ```

</Procedure>

[write]: /use-timescale/:currentVersion:/write-data/
[setup-hypercore]: /use-timescale/:currentVersion:/hypercore/real-time-analytics-in-hypercore/
[job]: /api/:currentVersion:/actions/
[alter_job]: /api/:currentVersion:/actions/alter_job/
[convert_to_columnstore]: /api/:currentVersion:/hypercore/convert_to_columnstore/
[informational-views]: /api/:currentVersion:/informational-views/jobs/
[insert]: /use-timescale/:currentVersion:/write-data/insert/
[setup-hypercore]: /use-timescale/:currentVersion:/hypercore/real-time-analytics-in-hypercore/
