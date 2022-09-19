---
title: Install TimescaleDB on Red Hat and CentOS
nav-title: Red Hat and CentOS
excerpt: Install self-hosted TimescaleDB on Red Hat-based systems
section: install
subsection: self-hosted
keywords: [install, self-hosted, Red Hat]
---

import Debian from "versionContent/_partials/_psql-installation-centos.mdx";

# Install self-hosted TimescaleDB on Red Hat-based systems

You can host TimescaleDB yourself on your Red Hat, CentOS, or Fedora system.
These instructions use the `yum` package manager on these
distributions:

*   Red Hat Enterprise Linux 7
*   Red Hat Enterprise Linux 8
*   CentOS 7
*   CentOS 8
*   Fedora 33
*   Fedora 34
*   Fedora 35

<highlight type="warning">
If you have already installed PostgreSQL using a method other than the `yum` or
`dnf` package manager, you could encounter errors following these instructions.
It is safest to remove any existing PostgreSQL installations before you begin.
If you want to keep your current PostgreSQL installation, do not install
TimescaleDB using this method.
[Install from source](/install/latest/self-hosted/installation-source/)
instead.
</highlight>

<procedure>

### Installing self-hosted TimescaleDB on Red Hat-based systems

1.  At the command prompt, as root, add the PostgreSQL third party repository
    to get the latest PostgreSQL packages:
    <terminal>

    <tab label='Red Hat'>

    ```bash
    sudo yum install https://download.postgresql.org/pub/repos/yum/reporpms/EL-$(rpm -E %{rhel})-x86_64/pgdg-redhat-repo-latest.noarch.rpm
    ```

    </tab>

    <tab label="Fedora">

    ```bash
    sudo yum install https://download.postgresql.org/pub/repos/yum/reporpms/F-$(rpm -E %{fedora})-x86_64/pgdg-fedora-repo-latest.noarch.rpm
    ```

    </tab>

    <tab label="CentOS">

    ```bash
    sudo yum install https://download.postgresql.org/pub/repos/yum/reporpms/EL-$(rpm -E %{centos})-x86_64/pgdg-redhat-repo-latest.noarch.rpm
    ```

    </tab>

    </terminal>
1.  Create the Timescale repository:
    <terminal>

    <tab label='Red Hat'>

    ```bash
    sudo tee /etc/yum.repos.d/timescale_timescaledb.repo <<EOL
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
    sudo tee /etc/yum.repos.d/timescale_timescaledb.repo <<EOL
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

    <tab label="CentOS">

    ```bash
    sudo tee /etc/yum.repos.d/timescale_timescaledb.repo <<EOL
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

    </terminal>
1.  Update your local repository list:

    ```bash
    sudo yum update
    ```

1.  Install TimescaleDB:

    ```bash
    sudo yum install timescaledb-2-postgresql-14
    ```

     <highlight type="note">
     When installing on CentOS 8 or Red Hat Enterprise Linux 8 you need
     to disable the built-in PostgreSQL module in the system using the
     `sudo dnf -qy module disable postgresql`command.

</highlight>

1.  Initialize the database:

    ```bash
    sudo /usr/pgsql-14/bin/postgresql-14-setup initdb

</procedure>

When you have completed the installation, you need to configure your database so
that you can use it. The easiest way to do this is to run the `timescaledb-tune`
script, which is included with the `timescaledb-tools` package. Run the
`timescaledb-tune` script using the
`sudo timescaledb-tune --pg-config=/usr/pgsql-14/bin/pg_config` command. For more
information, see the [configuration][config] section.

## Set up the TimescaleDB extension

When you have PostgreSQL and TimescaleDB installed, you can connect to it using
the `psql` command-line utility.

<CentOS />

<procedure>

### Setting up the TimescaleDB extension

1.  Enable and start the service:

    ```bash
    sudo systemctl enable postgresql-14
    sudo systemctl start postgresql-14
    ```

1.  Connect to the PostgreSQL instance as the `postgres` superuser:

    ```bash
    sudo -u postgres psql
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
    postgres=#\password postgres 
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
[install-psql]: /timescaledb/latest/how-to-guides/connecting/psql/
[tsdb-docs]: /timescaledb/:currentVersion:/
[tutorials]: /timescaledb/:currentVersion:/tutorials/
[config]: /timescaledb/:currentVersion:/how-to-guides/configuration/
