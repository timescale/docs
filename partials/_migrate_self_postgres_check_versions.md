<Procedure>

To see the versions of PostgreSQL and TimescaleDB running in a self-hosted database instance: 

1. **Set your connection string**

   This variable holds the connection information for the database to upgrade:

   ```bash
   export SOURCE="postgres://<user>:<password>@<source host>:<source port>/<db_name>"
   ```

2. **Retrieve the version of PostgreSQL that you are running**
    ```shell
    psql -X -d $SOURCE -c "SELECT version();"
    ```
   PostgreSQL returns something like:
    ```shell
    -----------------------------------------------------------------------------------------------------------------------------------------
    PostgreSQL 17.2 (Ubuntu 17.2-1.pgdg22.04+1) on aarch64-unknown-linux-gnu, compiled by gcc (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0, 64-bit
    (1 row)
    ```

1. **Retrieve the version of TimescaleDB that you are running**
    ```sql
    psql -X -d $SOURCE -c "\dx timescaledb;"
    ```
   PostgreSQL returns something like:
    ```shell
        Name     | Version |   Schema   |                             Description
    -------------+---------+------------+---------------------------------------------------------------------
    timescaledb | 2.17.2   | public     | Enables scalable inserts and complex queries for time-series data
    (1 row)
    ```     

</Procedure> 
