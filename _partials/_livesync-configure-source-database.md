1. **Tune the Write Ahead Log (WAL) on the PostgreSQL source database**

   ```sql
   psql $SOURCE -c "ALTER SYSTEM SET wal_level=’logical’;"
   psql $SOURCE -c "ALTER SYSTEM SET max_wal_sender=10;"
   psql $SOURCE -c "ALTER SYSTEM SET wal_sender_timeout=0;"
   ```
   * [ GUC “wal_level” as “logical”](https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-WAL-LEVEL)
   * [GUC “max_wal_senders” as 10](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-WAL-SENDERS)
   * [GUC “wal_sender_timeout” as 0](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-WAL-SENDER-TIMEOUT)

1. **Enable update and delete replication on the source database**

   Replica identity assists data replication by identifying the rows being modified.
   By default each table and hypertable in the source database defaults to the primary key of the table being replicated.
   However, you can also have:

   - **A viable unique index**: each table has a unique, non-partial, non-deferrable index that includes only columns
      marked as `NOT NULL`. If a `UNIQUE` index does not exists, create one to assist the migration. You can delete it after
      live sync. For each table, set `REPLICA IDENTITY` to the viable unique index:

      ```sql
       psql -X -d $SOURCE -c 'ALTER TABLE <table name> REPLICA IDENTITY USING INDEX <_index_name>'
      ```

   - **No primary key or viable unique index**: use brute force. For each table, set `REPLICA IDENTITY` to `FULL`:
   
       ```sql
       psql -X -d $SOURCE -c 'ALTER TABLE <table name> REPLICA IDENTITY FULL'
       ```
      For each `UPDATE` or `DELETE` statement, PostgreSQL reads the whole table to find all matching rows.
      This results in significantly slower replication. If you are expecting a large number of `UPDATE` or `DELETE`
      operations on the table, best practice is to not use `FULL`
   
      To capture only `INSERT` and ignore `UPDATE`s and `DELETE`s, use a
      [publish config](https://www.postgresql.org/docs/current/sql-createpublication.html#SQL-CREATEPUBLICATION-PARAMS-WITH-PUBLISH)
      while [creating the publication][lives-sync-specify-tables].


1. **Restart your source database**


[lives-sync-specify-tables]: /migrate/:currentVersion:/livesync/#specify-the-tables-to-synchronize
