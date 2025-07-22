<Procedure>

You cannot upgrade $TIMESCALE_DB and $PG at the same time. You upgrade each product in
the following steps:

1. **Upgrade TimescaleDB**

    ```sql
   psql -X -d $SOURCE -c "ALTER EXTENSION timescaledb UPDATE TO '<version number>';"
   ```

1. **If your migration path dictates it, upgrade $PG**

   Follow the procedure in [Upgrade $PG][upgrade-pg]. The version of $TIMESCALE_DB installed
   in your $PG deployment must be the same before and after the $PG upgrade.

1. **If your migration path dictates it, upgrade $TIMESCALE_DB again**

    ```sql
   psql -X -d $SOURCE -c "ALTER EXTENSION timescaledb UPDATE TO '<version number>';"
   ```

1. **Check that you have upgraded to the correct version of TimescaleDB**

    ```sql
    psql -X -d $SOURCE -c "\dx timescaledb;"
    ```
   $PG returns something like:
    ```shell
    Name     | Version | Schema |                                      Description                                      
    -------------+---------+--------+---------------------------------------------------------------------------------------
    timescaledb | 2.17.2  | public | Enables scalable inserts and complex queries for time-series data (Community Edition)
    ```

</Procedure> 

[upgrade-pg]: /self-hosted/:currentVersion:/upgrades/upgrade-pg/#upgrade-your-postgresql-instance
