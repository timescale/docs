1. Ensure that the $SERVICE_LONG is running the $PG extensions used in your source database.

    1. Check the extensions on the source database:
       ```bash
       psql $SOURCE  -c "SELECT * FROM pg_extension;"
       ```
    1. For each extension, enable it on your target $SERVICE_LONG:
       ```bash
       psql $TARGET  -c "CREATE EXTENSION IF NOT EXISTS <extension name> CASCADE;"
       ```
       
[Upgrade TimescaleDB]: https://www.tigerdata.com/docs/self-hosted/:currentVersion:/upgrades/
