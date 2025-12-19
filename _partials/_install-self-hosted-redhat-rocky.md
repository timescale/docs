
1.  **Install TimescaleDB**

    To avoid errors, **do not** install $TDB_APACHE and $TDB_COMMUNITY at the same time.

    ```bash
    sudo dnf install -y postgresql16-server postgresql16-contrib timescaledb-2-postgresql-16
    ```
    
 1.  **Initialize the $PG instance**

    ```bash
    sudo /usr/pgsql-16/bin/postgresql-16-setup initdb
    ```   

1.  **Tune your $PG instance for TimescaleDB**

    ```bash
    sudo timescaledb-tune --pg-config=/usr/pgsql-16/bin/pg_config 
    ```   

    This script is included with the `timescaledb-tools` package when you install TimescaleDB.
    For more information, see [configuration][config].

1.  **Enable and start $PG**

    ```bash
    sudo systemctl enable postgresql-16
    sudo systemctl start postgresql-16
    ```

1.  **Log in to $PG as `postgres`**

    ```bash
    sudo -u postgres psql
    ```
    You are now in the psql shell. 
    
1. **Set the password for `postgres`**

    ```bash
    \password postgres
    ```

    When you have set the password, type `\q` to exit psql.

[config]: /self-hosted/:currentVersion:/configuration/
