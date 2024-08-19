1. Ensure that the source and target databases are running the same version of TimescaleDB.

    1. Check the version of TimescaleDB running on your Timescale Cloud service:

       ```bash
       psql $TARGET -c "SELECT extversion FROM pg_extension WHERE extname = 'timescaledb';"
       ```

    1. Update the TimescaleDB extension in your source database to match the target source:

       If the timescaleDB extension is the same version on the source database and target service,
       you do not need to do this.

       ```bash
       psql $SOURCE -c "ALTER EXTENSION timescaledb UPDATE TO '<version here>';"
       ```

       For more information and guidance, see [Upgrade TimescaleDB].

1. Ensure that the Timescale Cloud service is running the PostgreSQL extensions used in your source database.

    1. Check the extensions on the source database:
       ```bash
       psql $SOURCE  -c "SELECT * FROM pg_extension;"
       ```
    1. For each extension, enable it on your target Timescale Cloud service:
       ```bash
       psql $TARGET  -c "CREATE EXTENSION IF NOT EXISTS <extension name> CASCADE;"
       ```
       