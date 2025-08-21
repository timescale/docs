
ArchLinux packages are built by the community.

<Procedure>


1.  **Install the latest $PG and $TIMESCALE_DB packages**

    ```bash
    sudo pacman -Syu timescaledb timescaledb-tune postgresql-libs
    ```

1.  **Initalize your $PG instance**

    ```bash
    sudo -u postgres initdb --locale=en_US.UTF-8 --encoding=UTF8 -D /var/lib/postgres/data --data-checksums
    ```    

1.  **Tune your $PG instance for TimescaleDB**

    ```bash
    sudo timescaledb-tune
    ```   

    This script is included with the `timescaledb-tools` package when you install TimescaleDB. For more information, see [configuration][config].

1.  **Enable and start $PG**

    ```bash
    sudo systemctl enable postgresql.service
    sudo systemctl start postgresql.service
    ```

1.  **Log in to $PG as `postgres`**

    ```bash
    sudo -u postgres psql
    ```
    You are in the psql shell. 
    
1. **Set the password for `postgres`**

    ```bash
    \password postgres
    ```

    When you have set the password, type `\q` to exit psql.


</Procedure>

[config]: /self-hosted/:currentVersion:/configuration/