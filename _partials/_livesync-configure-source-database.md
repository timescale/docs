import EnableReplication from "versionContent/_partials/_migrate_live_setup_enable_replication.mdx";

1. **Tune the Write Ahead Log (WAL) on the $PG source database**

   ```sql
   psql $SOURCE <<EOF
   ALTER SYSTEM SET wal_level='logical';
   ALTER SYSTEM SET max_wal_senders=10;
   ALTER SYSTEM SET wal_sender_timeout=0;
   EOF
   ```
   * [GUC “wal_level” as “logical”][guc-wal_level-as-logical]
   * [GUC “max_wal_senders” as 10][guc-max_wal_senders-as-10]
   * [GUC “wal_sender_timeout” as 0][guc-wal_sender_timeout-as-0]

   This will require a restart of the $PG source database.

1. **Create a user for the connector and assign permissions**

   1. Create `<pg connector username>`:

      ```sql
      psql $SOURCE -c "CREATE USER <pg connector username> PASSWORD '<password>'"
      ```

      You can use an existing user. However, you must ensure that the user has the following permissions.

   1. Grant permissions to create a replication slot:

      ```sql
      psql $SOURCE -c "ALTER ROLE <pg connector username> REPLICATION"
      ```

   1. Grant permissions to create a publication:

      ```sql
      psql $SOURCE -c "GRANT CREATE ON DATABASE <database name> TO <pg connector username>"
      ```

   1. Assign the user permissions on the source database:

      ```sql
      psql $SOURCE <<EOF
      GRANT USAGE ON SCHEMA "public" TO <pg connector username>;
      GRANT SELECT ON ALL TABLES IN SCHEMA "public" TO <pg connector username>;
      ALTER DEFAULT PRIVILEGES IN SCHEMA "public" GRANT SELECT ON TABLES TO <pg connector username>;
      EOF
      ```

      If the tables you are syncing are not in the `public` schema, grant the user permissions for each schema you are syncing:
      ```sql
      psql $SOURCE <<EOF
      GRANT USAGE ON SCHEMA <schema> TO <pg connector username>;
      GRANT SELECT ON ALL TABLES IN SCHEMA <schema> TO <pg connector username>;
      ALTER DEFAULT PRIVILEGES IN SCHEMA <schema> GRANT SELECT ON TABLES TO <pg connector username>;
      EOF
      ```

   1. On each table you want to sync, make `<pg connector username>` the owner:

      ```sql
      psql $SOURCE -c 'ALTER TABLE <table name> OWNER TO <pg connector username>;'
      ```
      You can skip this step if the replicating user is already the owner of the tables.


1. **Enable replication `DELETE` and`UPDATE` operations**

   <EnableReplication />

[guc-max_wal_senders-as-10]: https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-WAL-SENDERS
[guc-wal_level-as-logical]: https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-WAL-LEVEL
[guc-wal_sender_timeout-as-0]: https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-WAL-SENDER-TIMEOUT
