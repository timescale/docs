
1.  **Update your local repository list**

    ```bash
    sudo yum update
    ```

1.  **Install TimescaleDB**

    To avoid errors, **do not** install $TDB_APACHE and $TDB_COMMUNITY at the same time.

    ```bash
    sudo yum install timescaledb-2-postgresql-18 postgresql18
    ```

    <!-- hack until we have bandwidth to rewrite this linting rule -->

    <!-- markdownlint-disable TS007 -->
    <Highlight type="note">

    On Red Hat Enterprise Linux 8 and later, disable the built-in $PG module:
    
    `sudo dnf -qy module disable postgresql`

    </Highlight>

    <!-- markdownlint-enable TS007 -->
    
 1.  **Initialize the $PG instance**

    ```bash
    sudo /usr/pgsql-18/bin/postgresql-18-setup initdb
    ```   

1.  **Tune your $PG instance for TimescaleDB**

    ```bash
    sudo timescaledb-tune --pg-config=/usr/pgsql-18/bin/pg_config 
    ```   

    This script is included with the `timescaledb-tools` package when you install TimescaleDB.
    For more information, see [configuration][config].

1.  **Enable and start $PG**

    ```bash
    sudo systemctl enable postgresql-18
    sudo systemctl start postgresql-18
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
