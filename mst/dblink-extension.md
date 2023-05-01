---
title: Using the `dblink` extension in Managed Service for TimescaleDB
excerpt: Learn how to use `dblink` extension and connect to other PostgreSQL databases
products: [mst]
tags: [extension]
---

# Use the PostgreSQL dblink extension

The `dblink` [PostgreSQL extension][dblink-extension] allows you to connect to
other PostgreSQL databases and to run arbitrary queries.

You can use [foreign data wrappers][pg-fdw] (FDWs) to define a remote
`foreign server` to access its data. The database connection details such as
hostnames are kept in a single place, and you only need to create a
`user mapping` to store remote connections credentials.

## Prerequisites

Before you begin, sign in to your [Managed Service for TimescaleDB portal][mst-login],
navigate to the `Overview` tab, and take a note of these parameters for the
PostgreSQL remote server. Alternatively, you can use the `avn service get`
command in the Aiven client:

*   `HOSTNAME`: The remote database hostname
*   `PORT`: The remote database port
*   `USER`: The remote database user to connect. The default user is `tsdbadmin`.
*   `PASSWORD`: The remote database password for the `USER`
*   `DATABASE_NAME`: The remote database name. The default database name is `defaultdb`.

<Procedure>

### Enable the dblink extension

To enable the `dblink` extension on an MST PostgreSQL service:

1.  Connect to the database as the `tsdbadmin` user:

    ```bash
    psql -x "postgres://tsdbadmin:<PASSWORD>@<HOSTNAME>:<PORT>/defaultdb?sslmode=require"
    ```

1.  Create the `dblink` extension

    ```sql
    CREATE EXTENSION dblink;
    ```

1.  Create a table named `inventory`:

   ```sql
    CREATE TABLE inventory (id int);
   ```

1.  Insert data into the `inventory` table:

   ```sql
    INSERT INTO inventory (id) VALUES (100), (200), (300);
   ```

</Procedure>

<Procedure>

### Create a foreign data wrapper using dblink_fdw

1.  Create a user `user1` who can access the `dblink`

   ```sql
    CREATE USER user1 PASSWORD 'secret1'
   ```

1.  Create a remote server definition named `mst_remote`, using `dblink_fdw` and
    the connection details of the MST service.

    ```sql

    CREATE SERVER mst_remote
        FOREIGN DATA WRAPPER dblink_fdw
        OPTIONS (
                 host 'HOST',
                 dbname 'DATABASE_NAME',
                 port 'PORT'
                 );
    ```

1.  Create a user mapping for the `user1` to automatically authenticate as the
    `tsdbadmin` when using the   `dblink`:

    ```sql

        CREATE USER MAPPING FOR user1
           SERVER mst_remote
           OPTIONS (
            user 'tsdbadmin',
            password 'PASSWORD'
            );
    ```

1.  Enable `user1` to use the remote PostgreSQL connection `mst_remote`:

   ```sql
    GRANT USAGE ON FOREIGN SERVER mst_remote TO user1;
   ```

</Procedure>

## Query data using a foreign data wrapper

In this example in the `user1` user queries the remote table `inventory` defined
in the target PostgreSQL database from the `mst_remote` server definition:

### Quering data using a foreign data wrapper

To query a foreign data wrapper, you must be a database user with the necessary
permissions on the remote server.

<Procedure>

1.  Connect to the MST service as `user1` with necessary grants to the remote server.

1.  Establish the `dblink` connection to the remote target server:

   ```sql
    SELECT dblink_connect('my_new_conn', 'mst_remote');
   ```

1.  Query using the foreign server definition as parameter:

   ```sql
    SELECT * FROM dblink('my_new_conn','SELECT * FROM inventory') AS t(a int);
   ```

Output is similar to:

   ```sql
       a
     -----
      100
      200
      300
    (3 rows)
   ```

</Procedure>

[dblink-extension]: https://www.postgresql.org/docs/current/dblink.html
[pg-fdw]: https://www.postgresql.org/docs/current/postgres-fdw.html
[mst-login]: https://portal.managed.timescale.com
