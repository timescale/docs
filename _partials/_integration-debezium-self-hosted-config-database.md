
1. **Configure your self-hosted $PG deployment**

   1. Open `postgresql.conf`.

      The $PG configuration files are usually located in:

      - Docker: `/home/postgres/pgdata/data/`
      - Linux: `/etc/postgresql/<version>/main/` or `/var/lib/pgsql/<version>/data/`
      - MacOS: `/opt/homebrew/var/postgresql@<version>/`
      - Windows: `C:\Program Files\PostgreSQL\<version>\data\`

   1. Enable logical replication

      Modify the following settings in `postgresql.conf`:

      ```ini
      wal_level = logical
      max_replication_slots = 10
      max_wal_senders = 10
      ```

   1. Open `pg_hba.conf` and enable host replication:

      To allow replication connections, add the following:

      ```
      local replication debezium                         trust  
      ```
      This permission is for the `debezium` $PG user running on a local or Docker deployment. For more about replication 
      permissions, see [Configuring PostgreSQL to allow replication with the Debezium connector host][debezium-replication-permissions].

   1. Restart $PG.


1. **Connect to your $SELF_LONG instance**

   Use [`psql`][psql-connect]. 

1. **Create a Debezium user in PostgreSQL**

   Create a user with the `LOGIN` and `REPLICATION` permissions:

    ```sql
    CREATE ROLE debezium WITH LOGIN REPLICATION PASSWORD '<debeziumpassword>';
    ```

1. **Enable a replication spot for Debezium**

   1. Create a table for Debezium to listen to

      ```sql
      CREATE TABLE accounts (created_at TIMESTAMPTZ DEFAULT NOW(),
       name TEXT,
       city TEXT);
      ```

   1. Turn the table into a hypertable

      ```sql
      SELECT create_hypertable('accounts', 'created_at');
      ```

      Debezium also works with [$CAGGs][caggs].

   1. Create a publication and enable a replication slot 
  
      ```sql
      CREATE PUBLICATION dbz_publication FOR ALL TABLES WITH (publish = 'insert, update');
      ```
      
[caggs]: /use-timescale/:currentVersion:/continuous-aggregates/
[run-queries]: /getting-started/:currentVersion:/run-queries-from-console/
[open-console]: https://console.cloud.timescale.com/dashboard/services
[psql-connect]: /integrations/:currentVersion:/psql/#connect-to-your-service
[debezium-replication-permissions]: https://debezium.io/documentation/reference/3.1/connectors/postgresql.html#postgresql-host-replication-permissions
