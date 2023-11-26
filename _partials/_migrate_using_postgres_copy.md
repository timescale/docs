<Procedure>

### Restoring data into Timescale with COPY

1.  Connect to your Timescale database:

    ```sql
    psql "postgres://tsdbadmin:<PASSWORD>@<HOST>:<PORT>/tsdb?sslmode=require"
    ```

1.  Restore the data to your Timescale database:

    ```sql
    \copy <TABLE_NAME> FROM '<TABLE_NAME>.csv' WITH (FORMAT CSV);
    ```

    Repeat for each table and hypertable you want to migrate.

</Procedure>
