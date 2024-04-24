<Procedure>

1. **Install the latest PostgreSQL packages**

    ```bash
    sudo apt install gnupg postgresql-common apt-transport-https lsb-release wget
    ```

1.  **Run the PostgreSQL package setup script**

    ```bash
    sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh
    ```

1.  **Add the TimescaleDB package**

    <Terminal>

    <tab label='Debian'>

    ```bash
    echo "deb https://packagecloud.io/timescale/timescaledb/debian/ $(lsb_release -c -s) main" | sudo tee /etc/apt/sources.list.d/timescaledb.list
    ```

    </tab>

    <tab label="Ubuntu">

    ```bash
    echo "deb https://packagecloud.io/timescale/timescaledb/ubuntu/ $(lsb_release -c -s) main" | sudo tee /etc/apt/sources.list.d/timescaledb.list
    ```

    </tab>

    </Terminal>

1.  **Install the TimescaleDB GPG key**

    ```bash
    wget --quiet -O - https://packagecloud.io/timescale/timescaledb/gpgkey | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/timescaledb.gpg
    ```

    For Ubuntu 21.10 and earlier use the following command:
    
    `wget --quiet -O - https://packagecloud.io/timescale/timescaledb/gpgkey | sudo apt-key add -`

1.  **Update your local repository list**

    ```bash
    sudo apt update
    ```

1.  **Install TimescaleDB**

    ```bash
    sudo apt install timescaledb-2-postgresql-14 postgresql-client
    ```
    
    To install a specific TimescaleDB [release][releases-page], set the version. For example:
    
    `sudo apt-get install timescaledb-2-postgresql-12='2.6.0*' timescaledb-2-loader-postgresql-12='2.6.0*'`

    Older versions of TimescaleDB may not support all the OS versions listed on this page.

1.  **Tune your PostgreSQL instance for TimescaleDB**

    ```bash
    sudo timescaledb-tune
    ```   

    This script is included with the `timescaledb-tools` package when you install TimescaleDB.
    For more information, see [configuration][config].

1.  **Restart PostgreSQL**

    ```bash
    systemctl restart postgresql
    ```
    
1.  **Login to PostgreSQL as `postgres`**

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
[releases-page]: https://packagecloud.io/timescale/timescaledb