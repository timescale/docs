# Install self-hosted TimescaleDB on Debian-based systems
You can host TimescaleDB yourself, on your Debian or Ubuntu system. These
instructions use the `apt` package manager on these distributions:

*   Debian 9 Stretch
*   Debian 10 Buster
*   Debian 11 Bullseye
*   Ubuntu 18.04 LTS Bionic Beaver
*   Ubuntu 20.04 LTS Focal Fossa
*   Ubuntu 21.04 Hirsute Hippo
*   Ubuntu 21.10 Impish Indri
*   Ubuntu 22.04 LTS Jammy Jellyfish

<highlight type="warning">
If you have already installed PostgreSQL using a method other than the `apt`
package manager, you could encounter errors following these instructions. It is
safest to remove any existing PostgreSQL installations before you begin. If you
want to keep your current PostgreSQL installation, do not install TimescaleDB
using this method.
[Install from source](/install/latest/self-hosted/installation-source/)
instead.
</highlight>

<procedure>

### Installing self-hosted TimescaleDB on Debian-based systems
1.  At the command prompt, as root, add the PostgreSQL third party repository
    to get the latest PostgreSQL packages:
    ```bash
    apt install gnupg postgresql-common apt-transport-https lsb-release wget
    ```
1.  Run the PostgreSQL repository setup script:
    ```bash
    /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh
    ```
1.  Add the TimescaleDB third party repository:

    <terminal>

    <tab label='Debian'>

    ```bash
    echo "deb https://packagecloud.io/timescale/timescaledb/debian/ $(lsb_release -c -s) main" > /etc/apt/sources.list.d/timescaledb.list
    ```

    </tab>

    <tab label="Ubuntu">

    ```bash
    echo "deb https://packagecloud.io/timescale/timescaledb/ubuntu/ $(lsb_release -c -s) main" > /etc/apt/sources.list.d/timescaledb.list
    ```

    </tab>

    </terminal>

1.  Install Timescale GPG key
    ```bash
    wget --quiet -O - https://packagecloud.io/timescale/timescaledb/gpgkey | apt-key add -
    ```
1.  Update your local repository list:
    ```bash
    apt update
    ```
1.  Install TimescaleDB:
    ```bash
    apt install timescaledb-2-postgresql-14
    ```

    <highlight type="note">
    If you want to install a specific version of TimescaleDB, instead of the
    most recent, you can specify the version like this:
    `apt-get install timescaledb-2-2.6.0-postgresql-12`
    
    You can see the full list of TimescaleDB releases by visiting our
    [releases page][releases-page]
    </highlight>

</procedure>

When you have completed the installation, you need to configure your database so
that you can use it. The easiest way to do this is to run the `timescaledb-tune`
script, which is included with the `timescaledb-tools` package. For more
information, see the [configuration][config] section.

## Set up the TimescaleDB extension
When you have PostgreSQL and TimescaleDB installed, you can connect to it from
your local system using the `psql` command-line utility. This is the same tool
you might have used to connect to PostgreSQL before, but if you haven't
installed it yet, check out our [installing psql][install-psql] section.

<procedure>

### Setting up the TimescaleDB extension
1.  Restart the service after enabling TimescaleDB with `timescaledb-tune`:
    ```bash
    systemctl restart postgresql
    ```

1.  On your local system, at the command prompt, connect to the PostgreSQL
    instance as the `postgres` superuser:
    ```bash
    su postgres -c psql
    ```
    If your connection is successful, you'll see a message like this, followed
    by the `psql` prompt:
    ```
    psql (13.3, server 12.8 (Ubuntu 12.8-1.pgdg21.04+1))
    SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
    Type "help" for help.
    tsdb=>
    ```
1.  At the `psql` prompt, create an empty database. Our database is
    called `example`:
    ```sql
    CREATE database example;
    ```
1.  Connect to the database you created:
    ```sql
    \c example
    ```
1.  Add the TimescaleDB extension:
    ```sql
    CREATE EXTENSION IF NOT EXISTS timescaledb;
    ```
1.  You can now connect to your database using this command:
    ```bash
    su postgres -c 'psql -d example'
    ```

</procedure>

You can check that the TimescaleDB extension is installed by using the `\dx`
command at the `psql` prompt. It looks like this:
```sql
tsdb=> \dx
List of installed extensions
-[ RECORD 1 ]------------------------------------------------------------------
Name        | plpgsql
Version     | 1.0
Schema      | pg_catalog
Description | PL/pgSQL procedural language
-[ RECORD 2 ]------------------------------------------------------------------
Name        | timescaledb
Version     | 2.6.1
Schema      | public
Description | Enables scalable inserts and complex queries for time-series data

tsdb=>
```

## Where to next
Now that you have your first TimescaleDB database up and running, you can check
out the [TimescaleDB][tsdb-docs] section in our documentation, and find out what
you can do with it.

If you want to work through some tutorials to help you get up and running with
TimescaleDB and time-series data, check out our [tutorials][tutorials] section.

You can always [contact us][contact] if you need help working something out, or
if you want to have a chat.


[contact]: https://www.timescale.com/contact
[install-psql]: /timescaledb/latest/how-to-guides/connecting/psql/
[tsdb-docs]: /timescaledb/:currentVersion:/
[tutorials]: /timescaledb/:currentVersion:/tutorials/
[config]: timescaledb/latest/how-to-guides/configuration/
[releases-page]: https://packagecloud.io/timescale/timescaledb
