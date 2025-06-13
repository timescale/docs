<Procedure>

### Restoring data into a $SERVICE_LONG with COPY

1.  Connect to your $SERVICE_LONG:

    ```sql
    psql "postgres://tsdbadmin:<PASSWORD>@<HOST>:<PORT>/tsdb?sslmode=require"
    ```

1.  Restore the data to your $SERVICE_LONG:

    ```sql
    \copy <TABLE_NAME> FROM '<TABLE_NAME>.csv' WITH (FORMAT CSV);
    ```

    Repeat for each table and hypertable you want to migrate.

</Procedure>
