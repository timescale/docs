1. **Tune the Write Ahead Log (WAL) on the PostgreSQL source database**

   ```sql
   psql $SOURCE <<EOF
   ALTER SYSTEM SET wal_level='logical';
   ALTER SYSTEM SET max_wal_sender=10;
   ALTER SYSTEM SET wal_sender_timeout=0;
   EOF
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
       psql $SOURCE -c 'ALTER TABLE <table name> REPLICA IDENTITY USING INDEX <_index_name>'
      ```

   - **No primary key or viable unique index**: use brute force. For each table, set `REPLICA IDENTITY` to `FULL`:

       ```sql
       psql $SOURCE -c 'ALTER TABLE <table name> REPLICA IDENTITY FULL'
       ```
     For each `UPDATE` or `DELETE` statement, PostgreSQL reads the whole table to find all matching rows.
     This results in significantly slower replication. If you are expecting a large number of `UPDATE` or `DELETE`
     operations on the table, best practice is to not use `FULL`

     To capture only `INSERT` and ignore `UPDATE`s and `DELETE`s, use a
     [publish config](https://www.postgresql.org/docs/current/sql-createpublication.html#SQL-CREATEPUBLICATION-PARAMS-WITH-PUBLISH)
     while [creating the publication][lives-sync-specify-tables].


1. **Create a user for livesync and assign permissions**

   1. Create `<livesync username>`:

      ```sql
      psql $SOURCE -c "CREATE USER <livesync username> PASSWORD '<password>'"
      ```
      
      You can use an existing user. However, you must ensure that the user has the following permissions.
   
   1. Assign the user permissions on the source database:

      ```sql
      psql $SOURCE <<EOF
      GRANT USAGE ON SCHEMA "public" TO <livesync username>;
      GRANT SELECT ON ALL TABLES IN SCHEMA "public" TO <livesync username>;
      ALTER DEFAULT PRIVILEGES IN SCHEMA "public" GRANT SELECT ON TABLES TO <livesync username>;
      GRANT CREATE ON DATABASE <database name> to <livesync username>;
      EOF
      ```
      
      If you are sycing from AWS RDS and Aurora to $CLOUD_LONG, run the following command:
      ```sql
      psql $SOURCE -d "GRANT rds_replication TO <livesync username>;"

   1. On each table you want to sync, make `<livesync username>` the owner:

      ```sql
      psql $SOURCE -c 'ALTER TABLE <table name> OWNER TO <livesync username>;'
      ```

1. **Create the livesync user and assign permissions**

   1. Create the livesync user:

      ```sql
      psql $SOURCE -c "CREATE USER timescale_livesync PASSWORD 'livesync1234'"
      ```
   1. Assign the user permissions on the source database:

      ```sql
      psql $SOURCE <<EOF
      GRANT USAGE ON SCHEMA "public" TO timescale_livesync;
      GRANT SELECT ON ALL TABLES IN SCHEMA "public" TO timescale_livesync;
      ALTER DEFAULT PRIVILEGES IN SCHEMA "public" GRANT SELECT ON TABLES TO timescale_livesync;
      GRANT rds_replication TO timescale_livesync;
      GRANT CREATE ON DATABASE postgres to timescale_livesync;
      EOF
      ```

   1. On each table you want to sync, make `livesync` the owner:

      ```sql
      psql $SOURCE -c 'ALTER TABLE <table name> OWNER TO timescale_livesync;'
      ```

1. **Restart your source database**


[lives-sync-specify-tables]: /migrate/:currentVersion:/livesync/#specify-the-tables-to-synchronize
