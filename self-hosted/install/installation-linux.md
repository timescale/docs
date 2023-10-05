---
title: Install TimescaleDB on Linux
excerpt: Install self-hosted TimescaleDB on Linux
products: [self_hosted]
keywords: [installation, self-hosted, Debian, Ubuntu, RHEL, Fedora]
---

import Linux from "versionContent/_partials/_psql-installation-linux.mdx";
import WhereTo from "versionContent/_partials/_where-to-next.mdx";

# Install TimescaleDB on Linux

You can host TimescaleDB yourself, on your Debian-based, Red Hat-based, or Arch
Linux-based systems. These instructions use the `apt`, `yum`, and `pacman`
package manager on these distributions:

|Debian|Ubuntu|Red Hat Enterprise|Rocky Linux|Fedora|
|-|-|-|-|-|
|Debian 10 Buster|Ubuntu 20.04 LTS Focal Fossa|Red Hat Enterprise Linux 7|Rocky Linux 8|Fedora 33|
|Debian 11 Bullseye|Ubuntu 22.04 LTS Jammy Jellyfish|Red Hat Enterprise Linux 8|Rocky Linux 9|Fedora 34|
|Debian 12 Bookworm|Ubuntu 23.04 Lunar Lobster|Red Hat Enterprise Linux 9| |Fedora 35|

<Highlight type="warning">
If you have already installed PostgreSQL using a method other than the `apt`
package manager maintained by Debian or Ubuntu archive, `yum`, or `pacman` package
manager, you could encounter errors following these instructions. It is safest
to remove any existing PostgreSQL installations before you begin. If you want to
keep your current PostgreSQL installation, do not install TimescaleDB using this
method. [Install from source](/self-hosted/latest/install/installation-source/)
instead.
</Highlight>

<Tabs label="Install TimescaleDB">

<Tab title="Debian">

<Procedure>

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

1.  Install TimescaleDB GPG key

    ```bash
    wget --quiet -O - https://packagecloud.io/timescale/timescaledb/gpgkey | sudo apt-key add -
    ```

    <Highlight type="note">
    For Ubuntu 21.10 and later use this command to install TimescaleDB
    GPG key
    `wget --quiet -O - https://packagecloud.io/timescale/timescaledb/gpgkey | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/timescaledb.gpg`
    </Highlight>

1.  Update your local repository list:

    ```bash
    apt update
    ```

1.  Install TimescaleDB:

    ```bash
    apt install timescaledb-2-postgresql-14
    ```

    <Highlight type="note">
    If you want to install a specific version of TimescaleDB, instead of the
    most recent, you can specify the version like this:
    `apt-get install timescaledb-2-postgresql-12='2.6.0*' timescaledb-2-loader-postgresql-12='2.6.0*'`

    You can see the full list of TimescaleDB releases by visiting the
    [releases page][releases-page]. Note that older versions of TimescaleDB
    don't always support all the OS versions listed above.
    </Highlight>

1.  Configure your database by running the `timescaledb-tune` script, which is
    included with the `timescaledb-tools` package. Run the `timescaledb-tune` script
    using the `sudo timescaledb-tune` command. For more information, see the
    [configuration][config] section.

</Procedure>

</Tab>

<Tab title="Red Hat">

<Procedure>

## Installing self-hosted TimescaleDB on Red Hat-based systems

1.  At the command prompt, as root, add the PostgreSQL third party repository
    to get the latest PostgreSQL packages:
    <Terminal>

    <tab label='Red Hat'>

    ```bash
    yum install https://download.postgresql.org/pub/repos/yum/reporpms/EL-$(rpm -E %{rhel})-x86_64/pgdg-redhat-repo-latest.noarch.rpm
    ```

    </tab>

    <tab label="Fedora">

    ```bash
    yum install https://download.postgresql.org/pub/repos/yum/reporpms/F-$(rpm -E %{fedora})-x86_64/pgdg-fedora-repo-latest.noarch.rpm
    ```

    </tab>
    </Terminal>
1.  Create the TimescaleDB repository:
    <Terminal>

    <tab label='Red Hat'>

    ```bash
    tee /etc/yum.repos.d/timescale_timescaledb.repo <<EOL
    [timescale_timescaledb]
    name=timescale_timescaledb
    baseurl=https://packagecloud.io/timescale/timescaledb/el/$(rpm -E %{rhel})/\$basearch
    repo_gpgcheck=1
    gpgcheck=0
    enabled=1
    gpgkey=https://packagecloud.io/timescale/timescaledb/gpgkey
    sslverify=1
    sslcacert=/etc/pki/tls/certs/ca-bundle.crt
    metadata_expire=300
    EOL
    ```

    </tab>

    <tab label="Fedora">

    ```bash
    tee /etc/yum.repos.d/timescale_timescaledb.repo <<EOL
    [timescale_timescaledb]
    name=timescale_timescaledb
    baseurl=https://packagecloud.io/timescale/timescaledb/el/8/$basearch
    repo_gpgcheck=1
    gpgcheck=0
    enabled=1
    gpgkey=https://packagecloud.io/timescale/timescaledb/gpgkey
    sslverify=1
    sslcacert=/etc/pki/tls/certs/ca-bundle.crt
    metadata_expire=300
    EOL
    ```

    </tab>
    </Terminal>
1.  Update your local repository list:

    ```bash
    yum update
    ```

1.  Install TimescaleDB:

    ```bash
    yum install timescaledb-2-postgresql-14
    ```

    <!-- hack until we have bandwidth to rewrite this linting rule -->

    <!-- markdownlint-disable TS007 -->
    <Highlight type="note">
    When installing on Red Hat Enterprise Linux 8 you need
    to disable the built-in PostgreSQL module in the system using the
    `sudo dnf -qy module disable postgresql`command.
    </Highlight>

    <!-- markdownlint-enable TS007 -->

1.  Initialize the database:

    ```bash
    /usr/pgsql-14/bin/postgresql-14-setup initdb
    ```

1.  Configure your database by running the `timescaledb-tune` script, which is
    included with the `timescaledb-tools` package. Run the `timescaledb-tune`
    script using the
    `sudo timescaledb-tune --pg-config=/usr/pgsql-14/bin/pg_config` command.
    For more information, see the [configuration][config] section.

</Procedure>

</Tab>

<Tab title="ArchLinux">

<Procedure>

## Installing self-hosted TimescaleDB on ArchLinux-based systems

1.  Install TimescaleDB and timescaledb-tune:

    ```bash
    sudo pacman -Syu timescaledb timescaledb-tune
    ```

1.  Initialize the database as the postgres user:

    ```bash
    sudo -u postgres initdb --locale=en_US.UTF-8 --encoding=UTF8 -D /var/lib/postgres/data --data-checksums
    ```

1.  Run timescaledb-tune to adjust your `postgresql.conf` file, to use TimescaleDB
    as PostgreSQL extension:

    ```bash
    sudo timescaledb-tune
    ```

1.  Enable and start the service:

    ```bash
    sudo systemctl enable postgresql.service
    sudo systemctl start postgresql.service
    ```

</Procedure>

</Tab>

</Tabs>

## Set up the TimescaleDB extension

When you have PostgreSQL and TimescaleDB installed, you can connect to it from
your local system using the `psql` command-line utility.

<Linux />

<Tabs lable="TimescaleDB extension">

<Tab title="Debian">

<Procedure>

### Setting up the TimescaleDB extension on Debian-based systems

Restart PostgreSQL and create the TimescaleDB extension:

1.  Restart the service after enabling TimescaleDB with `timescaledb-tune`:

    ```bash
    systemctl restart postgresql
    ```

1.  On your local system, at the command prompt, open the `psql` command-line
    utility as the `postgres` superuser:

    ```bash
    sudo -u postgres psql
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

</Procedure>

</Tab>

<Tab title="Red Hat">

<Procedure>

### Setting up the TimescaleDB extension on Red Hat-based systems

1.  Enable and start the service:

    ```bash
    systemctl enable postgresql-14
    systemctl start postgresql-14
    ```

1.  Connect to the PostgreSQL instance as the `postgres` superuser:

    ```bash
    -u postgres psql
    ```

    If your connection is successful, you see a message similar to this, followed
    by the `psql` prompt:

    ```bash
    could not change directory to "/root": Permission denied
    psql (14.5)
    Type "help" for help.

    postgres=#
    ```

1.  Set the password for the `postgres` user using:

    ```sql
    \password postgres
    ```

1.  Exit from PostgreSQL using the command `\q`.
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

</Procedure>

</Tab>

<Tab title="ArchLinux">

<Procedure>

### Setting up the TimescaleDB extension on ArchLinux-based systems

1.  On your local system, at the command prompt, connect to the PostgreSQL
    instance as the `postgres` superuser:

    ```bash
    sudo -u postgres psql
    ```

    If your connection is successful, you'll see a message like this, followed
    by the `psql` prompt:

    ```bash
    psql (14.3)
    Type "help" for help.
    ```

1.  At the `psql` prompt, create an empty database. This database is
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

1.  You can now connect to your database using this command:

    ```bash
    sudo -u postgres psql tsdb
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

</Procedure>

</Tab>

</Tabs>

After you have created the extension and the database, you can connect to your
database directly using this command:

```bash
psql -U postgres -h localhost -d tsdb
```

## Where to next

<WhereTo />

[config]: /self-hosted/:currentVersion:/configuration/
[releases-page]: https://packagecloud.io/timescale/timescaledb
