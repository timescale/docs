<Procedure >


1. **Connect to your PostgreSQL instance**

    ```bash
    psql -U postgres -h localhost
    ```

1. **Create a database**

    ```sql
    CREATE DATABASE tsdb;
    ```

1.  **Connect to the database**

    ```sql
    \c tsdb
    ```

1.  **Add TimescaleDB to the database**

    ```sql
    CREATE EXTENSION IF NOT EXISTS timescaledb;
    ```

1.  **Check that TimescaleDB is installed**
    
    ```sql
    \dx
    ```
    
    You see the list of installed extensions:

    ```sql
    List of installed extensions
    Name     | Version |   Schema   |                                      Description                                      
    -------------+---------+------------+---------------------------------------------------------------------------------------
    plpgsql     | 1.0     | pg_catalog | PL/pgSQL procedural language
    timescaledb | 2.14.2  | public     | Enables scalable inserts and complex queries for time-series data (Community Edition)
    ```
    Press q to exit the list of extensions.

</Procedure>