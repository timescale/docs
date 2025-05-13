---
title: Enforce constraints with unique indexes
excerpt: Having a unique index on your hypertable simplifies lookup, speeds up aggregation, and makes JOINs more efficient. Learn to create a unique index in Timescale Cloud and what the related limitations are
products: [cloud, mst, self_hosted]
keywords: [hypertables, unique indexes, primary keys]
---

import OldCreateHypertable from "versionContent/_partials/_old-api-create-hypertable.mdx";

# Enforce constraints with unique indexes

You use unique indexes on a $HYPERTABLE to enforce [constraints][constraints]. If you have a primary key, 
you have a unique index. In PostgreSQL, a primary key is a unique index with a `NOT NULL` constraint.

You do not need to have a unique index on your $HYPERTABLEs. When you create a unique index,
it must contain all the partitioning columns of the $HYPERTABLE. To create a unique index on a $HYPERTABLE:

## Create a hypertable and add unique indexes

<Procedure>

1. **Determine the partitioning columns**

   Before you create a unique index, you need to determine which unique indexes are
   allowed on your $HYPERTABLE. Begin by identifying your partitioning columns.

   $TIMESCALE_DB traditionally uses the following columns to partition $HYPERTABLEs:

   *   The `time` column used to create the $HYPERTABLE. Every Timescale $HYPERTABLE
       is partitioned by time.
   *   Any space-partitioning columns. Space partitions are optional and not
       included in every $HYPERTABLE. 

1. **Create a $HYPERTABLE**

   For example:
      ```sql
      CREATE TABLE hypertable_example(
        time TIMESTAMPTZ,
        user_id BIGINT,
        device_id BIGINT,
        value FLOAT
      ) WITH (
        tsdb.hypertable,
        tsdb.partition_column='time'
      );
      ```
   <OldCreateHypertable />

1. **Create a unique index on the $HYPERTABLE**

   When you create a unique index on a $HYPERTABLE, it must contain all the partitioning columns. It may contain 
   other columns as well, and they may be arranged in any order. You cannot create a unique index without `time`, 
   because `time` is a partitioning column.

   For example:

   - Create a unique index on `time` and `device_id` with a call to `CREATE UNIQUE INDEX`: 
 
      ```sql
      CREATE UNIQUE INDEX idx_deviceid_time
        ON hypertable_example(device_id, time);
      ```

   - Create a unique index on `time`, `user_id`, and `device_id`. 
   
     `device_id` is not a partitioning column, but this still works:
   
     ```sql
     CREATE UNIQUE INDEX idx_userid_deviceid_time
       ON hypertable_example(user_id, device_id, time);
     ```

   <Highlight type="note">

   This restriction is necessary to guarantee global uniqueness in the index.

   </Highlight>   

</Procedure>

## Create a hypertable from an existing table with unique indexes

If you create a unique index on a table before turning it into a hypertable, the
same restrictions apply in reverse. You can only partition the table by columns
in your unique index.

<Procedure>

1. **Create a relational table**

    ```sql
    CREATE TABLE hypertable_example(
      time TIMESTAMPTZ,
      user_id BIGINT,
      device_id BIGINT,
      value FLOAT
    );
    ```

1. **Create a unique index on the table** 

    For example, on `device_id` and `time`:

    ```sql
    CREATE UNIQUE INDEX idx_deviceid_time
      ON hypertable_example(device_id, time);
    ```

1. **Turn the table into a partitioned hypertable**

   - On `time` alone:

       ```sql
       SELECT * from create_hypertable('hypertable_example', by_range('time'));
       ```

   - On `time` and `device_id`:

       ```sql
       SELECT * FROM create_hypertable('hypertable_example', by_range('time'));
       SELECT * FROM add_dimension('hypertable_example', by_hash('device_id', 4));
       ```

   You get an error if you try to turn the relational table into a hypertable partitioned by `time` and `user_id`.
   This is because `user_id` is not part of the `UNIQUE INDEX`. To fix the error, add `user_id` to your unique index. 

</Procedure>




[constraints]: https://www.postgresql.org/docs/current/ddl-constraints.html
