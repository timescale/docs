## Install self-hosted TimescaleDB on Debian-based systems
You can host TimescaleDB yourself, on your Debian or Ubuntu system. These
instructions use the `apt` package manager on these distributions:

*   Debian 9 Stretch
*   Debian 10 Buster
*   Debian 11 Bullseye
*   Ubuntu 18.04 LTS Bionic Beaver
*   Ubuntu 18.10 Cosmic Cuttlefish
*   Ubuntu 19.04 Disco Dingo
*   Ubuntu 19.10 Eoan Ermine
*   Ubuntu 20.04 LTS Focal Fossa
*   Ubuntu 20.10 Groovy Gorilla
*   Ubuntu 21.04 Hirsute Hippo
*   Ubuntu 21.10 Impish Indri

<highlight type="warning">
If you have already installed PostgreSQL using a method other than the `apt`
package manager, you could encounter errors following these instructions. It is
safest to remove any existing PostgreSQL installations before you begin. If you
want to keep your current PostgreSQL installation, do not install TimescaleDB
using this method. [Install from source](FIXME) instead.
</highlight>

<procedure>

### Installing self-hosted TimescaleDB on Debian-based systems
1.  At the command prompt, as root, add the PostgreSQL third party repository
    to get the latest PostgreSQL packages:
    ```bash
    apt install postgresql-common
    ```
1.  Run the PostgreSQL repository setup script:
    ```bash
    sudo sh /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh
    ```
1.  Add the TimescaleDB third party repository:
    <terminal>

    <tab label='Debian'>

    ```bash
    sh -c "echo 'deb [signed-by=/usr/share/keyrings/timescale.keyring] https://packagecloud.io/timescale/timescaledb/debian/ $(lsb_release -c -s) main' > /etc/apt/sources.list.d/timescaledb.list"
    ```

    </tab>

    <tab label="Ubuntu">

    ```bash
    sudo sh -c "echo 'deb [signed-by=/usr/share/keyrings/timescale.keyring] https://packagecloud.io/timescale/timescaledb/ubuntu/ $(lsb_release -c -s) main' > /etc/apt/sources.list.d/timescaledb.list"
    ```

    </tab>

    </terminal>
1.  Get the TimescaleDB GPG signing packages, and unpack them:
    ```bash
    wget --quiet -O - https://packagecloud.io/timescale/timescaledb/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/timescale.keyring
    ```
1.  Update your local repository list:
    ```bash
    apt update
    ```
1.  Install TimescaleDB:
    ```bash
    apt install timescaledb-2-postgresql-14
    ```

</procedure>

When you have completed the installation, you need to configure your database so that you can use it. The easiest way to do this is to run the `timescaledb-tune` script, which is included with the `timescaledb-tools` package. For more information, see the [configuration][config] section.


[config]: /how-to-guides/configuration/
