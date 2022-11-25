---
title: Install TimescaleDB on Debian and Ubuntu
nav-title: Debian and Ubuntu
excerpt: Install self-hosted TimescaleDB on Debian-based systems
section: install
subsection: self-hosted
keywords: [installation, self-hosted, Debian]
---

import Debian from "versionContent/_partials/_psql-installation-debian-ubuntu.mdx";

# Install self-hosted TimescaleDB on Debian-based systems

You can host TimescaleDB yourself, on your Debian or Ubuntu system. These
instructions use the `apt` package manager on these distributions:

*   Debian 9 Stretch
*   Debian 10 Buster
*   Debian 11 Bullseye
*   Ubuntu 18.04 LTS Bionic Beaver
*   Ubuntu 20.04 LTS Focal Fossa
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

## Installing self-hosted TimescaleDB on Debian-based systems

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
    echo "deb https://packagecloud.io/timescale/timescaledb/debian/ $(lsb_release -c -s) main" | sudo tee /etc/apt/sources.list.d/timescaledb.list
    ```

    </tab>

    <tab label="Ubuntu">

    ```bash
    echo "deb https://packagecloud.io/timescale/timescaledb/ubuntu/ $(lsb_release -c -s) main" | sudo tee /etc/apt/sources.list.d/timescaledb.list
    ```

    </tab>

    </terminal>

1.  Install Timescale GPG key

    ```bash
    wget --quiet -O - https://packagecloud.io/timescale/timescaledb/gpgkey | sudo apt-key add -
    ```

    <highlight type="note">
    For Ubuntu 21.10 and later use this command to install Timescale
    GPG key
    `wget --quiet -O - https://packagecloud.io/timescale/timescaledb/gpgkey | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/timescaledb.gpg`
    </highlight>

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
    `apt-get install timescaledb-2-postgresql-12='2.6.0*' timescaledb-2-loader-postgresql-12='2.6.0*'`

    You can see the full list of TimescaleDB releases by visiting our
    [releases page][releases-page]. Note that older versions of TimescaleDB
    don't always support all the OS versions listed above.
    </highlight>

</procedure>

When you have completed the installation, you need to configure your database so
that you can use it. The easiest way to do this is to run the `timescaledb-tune`
script, which is included with the `timescaledb-tools` package. Run the
`timescaledb-tune` script using the `sudo timescaledb-tune` command. For more
information, see the [configuration][config] section.

## Set up the TimescaleDB extension

When you have PostgreSQL and TimescaleDB installed, you can connect to it from
your local system using the `psql` command-line utility.

<Debian />

<procedure>

### Setting up the TimescaleDB extension

Restart PostgreSQL and create the TimescaleDB extension:

1.  Restart the service after enabling TimescaleDB with `timescaledb-tune`:

    ```bash
    systemctl restart postgresql
    ```

1.  On your local system, at the command prompt, connect to the PostgreSQL
    instance as the `postgres` superuser:

    ```bash
    -u postgres psql
    ```

    If your connection is successful, you'll see a message like this, followed
    by the `psql` prompt:

    ```bash
    psql (15.0 (Ubuntu 15.0-1.pgdg20.04+1), server 14.5 (Ubuntu 14.5-2.pgdg20.04+2))
    SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, compression: off)
    Type "help" for help.
    ```

1.  Set the password for the `postgres` user:

    ```sql
    \password postgres 
    ```

1.  Exit from PostgreSQL:

    ```bash
    \q
    ```

1.  Use `psql` client to connect to PostgreSQL:

    ```bash
    psql -U postgres -h localhost
    ```

1.  At the `psql` prompt, create an empty database. Our database is
    called `tsdb`:

    ```sql
    CREATE database tsdb;
    ```

1.  Connect to the database you created:

    ```sql
    \c tsdb
    ```

1.  Add the TimescaleDB extension:

    ```sql
    CREATE EXTENSION IF NOT EXISTS timescaledb;
    ```

1.  Check that the TimescaleDB extension is installed by using the `\dx`
    command at the `psql` prompt. Output is similar to:

    ```sql
    tsdb-# \dx
                                          List of installed extensions
        Name     | Version |   Schema   |                            Description                            
    -------------+---------+------------+-------------------------------------------------------------------
     plpgsql     | 1.0     | pg_catalog | PL/pgSQL procedural language
     timescaledb | 2.7.0   | public     | Enables scalable inserts and complex queries for time-series data
    (2 rows)
    ```

</procedure>

After you have created the extension and the database, you can connect to your
database directly using this command:

```bash
psql -U postgres -h localhost -d tsdb
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
[install-psql]: /timescaledb/:currentVersion:/how-to-guides/connecting/psql/
[tsdb-docs]: /timescaledb/:currentVersion:/
[tutorials]: /timescaledb/:currentVersion:/tutorials/
[config]: /timescaledb/:currentVersion:/how-to-guides/configuration/
[releases-page]: https://packagecloud.io/timescale/timescaledb
