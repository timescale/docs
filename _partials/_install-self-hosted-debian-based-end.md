
1.  **Update your local repository list**

    ```bash
    sudo apt update
    ```

1.  **Install TimescaleDB**

    ```bash
    sudo apt install timescaledb-2-postgresql-18 postgresql-client-18
    ```
    
    To install a specific $TIMESCALE_DB [release][releases-page], set the version. For example:
    
    `sudo apt-get install timescaledb-2-postgresql-14='2.6.0*' timescaledb-2-loader-postgresql-14='2.6.0*'`

    Older versions of $TIMESCALE_DB may not support all the OS versions listed on this page.

1.  **Tune your $PG instance for TimescaleDB**

     ```bash
     sudo timescaledb-tune
     ```   

    By default, this script is included with the `timescaledb-tools` package when you install TimescaleDB. Use the prompts to tune your development or production environment. For more information on manual configuration, see [Configuration][config]. If you have an issue, run `sudo apt install timescaledb-tools`.

1.  **Restart $PG**

    ```bash
    sudo systemctl restart postgresql
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


[config]: /self-hosted/:currentVersion:/configuration/
[releases-page]: https://packagecloud.io/timescale/timescaledb