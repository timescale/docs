 Replica identity assists data replication by identifying the rows being modified. Your options are that
   each table and hypertable in the source database should either have:
- **A primary key**: Data replication defaults to the primary key of the table being replicated. 
  Nothing to do.   
- **A viable unique index**: each table has a unique, non-partial, non-deferrable index that includes only columns
  marked as `NOT NULL`. If a UNIQUE index does not exists, create one to assist the migration. You can delete if after
  migration. 

  For each table, set `REPLICA IDENTITY` to the viable unique index:

   ```shell
   psql -X -d $SOURCE -c 'ALTER TABLE <table name> REPLICA IDENTITY USING INDEX <_index_name>'
   ```
- **No primary key or viable unique index**: use brute force.  
   
  For each table, set `REPLICA IDENTITY` to `FULL`:
  ```shell
  psql -X -d $SOURCE -c 'ALTER TABLE {table_name} REPLICA IDENTITY FULL'
   ```
  For each `UPDATE` or `DELETE` statement, PostgreSQL reads the whole table to find all matching rows. This results
  in significantly slower replication. If you are expecting a large number of `UPDATE` or `DELETE` operations on the table,
  best practice is to not use `FULL`
