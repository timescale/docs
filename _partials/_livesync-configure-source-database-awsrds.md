import EnableReplication from "versionContent/_partials/_migrate_live_setup_enable_replication.mdx";

Updating parameters on a $PG instance will cause an outage. Choose a time that will cause the least issues to tune this database.

1. **Tune the Write Ahead Log (WAL) on the RDS/Aurora $PG source database**

   1. In [https://console.aws.amazon.com/rds/home#databases:][databases],
      select the RDS instance to migrate.

   1. Click `Configuration`, scroll down and note the `DB instance parameter group`, then click `Parameter Groups`

      <img class="main-content__illustration"
      src="https://assets.timescale.com/docs/images/migrate/awsrds-parameter-groups.png"
      alt="Create security rule to enable RDS EC2 connection"/>

   1. Click `Create parameter group`, fill in the form with the following values, then click `Create`.
      - **Parameter group name** - whatever suits your fancy. 
      - **Description** - knock yourself out with this one. 
      - **Engine type** - `PostgreSQL`
      - **Parameter group family** - the same as `DB instance parameter group` in your `Configuration`.
   1. In `Parameter groups`, select the parameter group you created, then click `Edit`.
   1. Update the following parameters, then click `Save changes`.
      - `rds.logical_replication` set to `1`: record the information needed for logical decoding.
      - `wal_sender_timeout` set to `0`: disable the timeout for the sender process.

   1. In RDS, navigate back to your [databases][databases], select the RDS instance to migrate and click `Modify`.  

   1. Scroll down to `Database options` select your new parameter group and click `Continue`. 
   1. Either `Apply immediately` or choose a maintence window, then click `Modify DB instance`.

      Changing parameters will cause an outage. Wait for the database instance to reboot before continuing. 
   1. Verify that the settings are live in your database.

1. **Create a user for $LIVESYNC and assign permissions**

   1. Create `<livesync username>`:

      ```sql
      psql $SOURCE -c "CREATE USER <livesync username> PASSWORD '<password>'"
      ```

      You can use an existing user. However, you must ensure that the user has the following permissions.

   1. Grant permissions to create a replication slot:

      ```sql
      psql $SOURCE -c "GRANT rds_replication TO <livesync username>"
      ```

   1. Grant permissions to create a publication:

      ```sql
      psql $SOURCE -c "GRANT CREATE ON DATABASE <database name> TO <livesync username>"
      ```

   1. Assign the user permissions on the source database:

      ```sql
      psql $SOURCE <<EOF
      GRANT USAGE ON SCHEMA "public" TO <livesync username>;
      GRANT SELECT ON ALL TABLES IN SCHEMA "public" TO <livesync username>;
      ALTER DEFAULT PRIVILEGES IN SCHEMA "public" GRANT SELECT ON TABLES TO <livesync username>;
      EOF
      ```

      If the tables you are syncing are not in the `public` schema, grant the user permissions for each schema you are syncing:
      ```sql
      psql $SOURCE <<EOF
      GRANT USAGE ON SCHEMA <schema> TO <livesync username>;
      GRANT SELECT ON ALL TABLES IN SCHEMA <schema> TO <livesync username>;
      ALTER DEFAULT PRIVILEGES IN SCHEMA <schema> GRANT SELECT ON TABLES TO <livesync username>;
      EOF
      ```

   1. On each table you want to sync, make `<livesync username>` the owner:

      ```sql
      psql $SOURCE -c 'ALTER TABLE <table name> OWNER TO <livesync username>;'
      ```
      You can skip this step if the replicating user is already the owner of the tables.

1. **Enable replication `DELETE` and`UPDATE` operations**

   <EnableReplication />

[databases]: https://console.aws.amazon.com/rds/home#databases:
