<Procedure>

You cannot upgrade TimescaleDB and PostgreSQL at the same time. You upgrade each product in
the following steps:

1. **Upgrade TimescaleDB**

    ```sql
   psql -X -d $SOURCE -c "ALTER EXTENSION timescaledb UPDATE TO '<version number>';"
   ```

1. **If your migration path dictates it, upgrade PostgreSQL**

   Follow the procedure in [Upgrade PostgreSQL][upgrade-pg]. The version of TimescaleDB installed
   in your PostgreSQL deployment must be the same before and after the PostgreSQL upgrade.

1. **If your migration path dictates it, upgrade TimescaleDB again**

    ```sql
   psql -X -d $SOURCE -c "ALTER EXTENSION timescaledb UPDATE TO '<version number>';"
   ```

1. **Check that you have upgraded to the correct version of TimescaleDB**

    ```sql
    psql -X -d $SOURCE -c "\dx timescaledb;"
    ```
    PostgreSQL returns something like:
    ```shell
    Name     | Version | Schema |                                      Description                                      
    -------------+---------+--------+---------------------------------------------------------------------------------------
    timescaledb | 2.17.2  | public | Enables scalable inserts and complex queries for time-series data (Community Edition)
    ```

</Procedure> 

[upgrade-pg]: /self-hosted/:currentVersion:/upgrades/upgrade-pg/#upgrade-your-postgresql-instance
