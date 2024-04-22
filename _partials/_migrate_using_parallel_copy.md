<Procedure>

### Restoring data into Timescale with timescaledb-parallel-copy

1.  At the command prompt, install `timescaledb-parallel-copy`:

    ```bash
    go get github.com/timescale/timescaledb-parallel-copy/cmd/timescaledb-parallel-copy
    ```

1.  Use `timescaledb-parallel-copy` to import data into 
    your Timescale database. Set `<NUM_WORKERS>` to twice the number of CPUs in your
    database. For example, if you have 4 CPUs, `<NUM_WORKERS>` should be `8`.

    ```bash
    timescaledb-parallel-copy \
    --connection "host=<HOST> \
    user=tsdbadmin password=<PASSWORD> \
    port=<PORT> \
    sslmode=require" \
    --db-name tsdb \
    --table <TABLE_NAME> \
    --file <FILE_NAME>.csv \
    --workers <NUM_WORKERS> \
    --reporting-period 30s
    ```

    Repeat for each table and hypertable you want to migrate.

</Procedure>
