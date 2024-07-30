import EnableReplication from "versionContent/_partials/_migrate_live_setup_enable_replication.mdx";

Updating parameters on a PostgreSQL instance will cause an outage. Choose a time that will cause the least issues to tune this database.

1. **Update the DB instance parameter group for your source database**

   1. In [https://console.aws.amazon.com/rds/home#databases:](https://console.aws.amazon.com/rds/home#databases:),
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
      - `old_snapshot_threshold` set to `-1`: prevent PostgreSQL from treating the data in a snapshot as outdated.
      - `rds.logical_replication` set to `1`: record the information needed for logical decoding.
      - `tcp_keepalives_count` set to `60`:  the number of messages that can be lost before the client is considered dead.
      - `tcp_keepalives_idle` set to `10 tcp_`: the amount of time with no network activity before the IS sends a TCP keepalive message to the client.
      - `keepalives_interval` set to `10`: the amount of time before a unacknowledged TCP keepalive message is restransmitted. 
      - `wal_sender_timeout` set to `30m`: the maximum time to wait for WAL replication.


   1. In RDS, navigate back to your [databases][databases], select the RDS instance to migrate and click `Modify`.  

   1. Scroll down to `Database options` select your new parameter group and click `Continue`. 
   1. Either `Apply immediately` or choose a maintence window, then click `Modify DB instance`.

      Changing parameters will cause an outage. Wait for the database instance to reboot before continuing. 
   1. Verify that the settings are live in your database.

1. **Enable live-migration to replicate `DELETE` and`UPDATE` operations**

   <EnableReplication />
   
[mst-portal]: https://portal.managed.timescale.com/login
[databases]: "https://console.aws.amazon.com/rds/home#databases:"