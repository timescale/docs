
1. **Install the latest $PG packages**

    ```bash
    sudo apt install gnupg postgresql-common apt-transport-https lsb-release wget
    ```

1.  **Run the $PG package setup script**

    ```bash
    sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh
    ```

    If you want to do some development on $PG, add the libraries:
    ```
    sudo apt install postgresql-server-dev-17
    ```



[config]: /self-hosted/:currentVersion:/configuration/
[releases-page]: https://packagecloud.io/timescale/timescaledb