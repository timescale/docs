<Procedure >

1. **Connect to a database on your PostgreSQL instance**

   In PostgreSQL, the default user and database are both `postgres`. To use a 
   different database, set `<database-name>` to the name of that database:

   ```bash
   psql -d "postgres://<username>:<password>@<host>:<port>/<database-name>"
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
    timescaledb | 2.15.1  | public     | Enables scalable inserts and complex queries for time-series data (Community Edition)
    ```
    Press q to exit the list of extensions.

</Procedure>