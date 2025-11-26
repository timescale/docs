---
title: Uninstall TimescaleDB on Linux
excerpt: Uninstall TimescaleDB from Debian, Ubuntu, Red Hat, Fedora, Rocky Linux, or ArchLinux
products: [self_hosted]
keywords: [uninstall, Linux, Debian, Ubuntu, RHEL, Fedora]
---

# Uninstall TimescaleDB on Linux

If you installed TimescaleDB on Linux using a package manager, you can uninstall it without removing PostgreSQL. This guide covers uninstalling TimescaleDB from Debian-based systems (Debian, Ubuntu) and Red Hat-based systems (RHEL, Fedora, Rocky Linux), as well as ArchLinux.

<Tabs label="Uninstall TimescaleDB" persistKey="os">

<Tab title="Debian" label="debian">

<Procedure>

1.  **Drop the TimescaleDB extension from your databases**

    Connect to each database where TimescaleDB is enabled and remove the extension:

    ```bash
    sudo -u postgres psql -d <database_name>
    ```

    At the `psql` prompt:

    ```sql
    DROP EXTENSION IF NOT EXISTS timescaledb CASCADE;
    ```

    Repeat this for all databases with TimescaleDB enabled. To exit psql, type `\q`.

    <Highlight type="warning">

    Using `CASCADE` will drop all TimescaleDB-specific objects including hypertables, continuous aggregates, and retention policies. Ensure you have backed up any data you want to keep.

    </Highlight>

1.  **Remove TimescaleDB from `shared_preload_libraries`**

    Edit the $PG configuration file:

    ```bash
    sudo nano /etc/postgresql/17/main/postgresql.conf
    ```

    Find the line with `shared_preload_libraries` and remove `timescaledb` from the list. For example, change:

    ```
    shared_preload_libraries = 'timescaledb'
    ```

    to:

    ```
    shared_preload_libraries = ''
    ```

    If there are other extensions in the list, keep them and only remove `timescaledb`.

1.  **Restart $PG**

    ```bash
    sudo systemctl restart postgresql
    ```

1.  **Uninstall the TimescaleDB package**

    ```bash
    sudo apt remove timescaledb-2-postgresql-17
    ```

    Replace `17` with your PostgreSQL version if different.

1.  **Remove the TimescaleDB repository configuration**

    ```bash
    sudo rm /etc/apt/sources.list.d/timescaledb.list
    sudo rm /etc/apt/trusted.gpg.d/timescaledb.gpg
    ```

1.  **Update the package list**

    ```bash
    sudo apt update
    ```

1.  **(Optional) Remove TimescaleDB dependencies**

    If you want to remove packages that were installed as dependencies:

    ```bash
    sudo apt autoremove
    ```

</Procedure>

</Tab>

<Tab title="Ubuntu" label="ubuntu">

<Procedure>

1.  **Drop the TimescaleDB extension from your databases**

    Connect to each database where TimescaleDB is enabled and remove the extension:

    ```bash
    sudo -u postgres psql -d <database_name>
    ```

    At the `psql` prompt:

    ```sql
    DROP EXTENSION IF NOT EXISTS timescaledb CASCADE;
    ```

    Repeat this for all databases with TimescaleDB enabled. To exit psql, type `\q`.

    <Highlight type="warning">

    Using `CASCADE` will drop all TimescaleDB-specific objects including hypertables, continuous aggregates, and retention policies. Ensure you have backed up any data you want to keep.

    </Highlight>

1.  **Remove TimescaleDB from `shared_preload_libraries`**

    Edit the PostgreSQL configuration file:

    ```bash
    sudo nano /etc/postgresql/17/main/postgresql.conf
    ```

    Find the line with `shared_preload_libraries` and remove `timescaledb` from the list. For example, change:

    ```
    shared_preload_libraries = 'timescaledb'
    ```

    to:

    ```
    shared_preload_libraries = ''
    ```

    If there are other extensions in the list, keep them and only remove `timescaledb`.

1.  **Restart PostgreSQL**

    ```bash
    sudo systemctl restart postgresql
    ```

1.  **Uninstall the TimescaleDB package**

    ```bash
    sudo apt remove timescaledb-2-postgresql-17
    ```

    Replace `17` with your PostgreSQL version if different.

1.  **Remove the TimescaleDB repository configuration**

    ```bash
    sudo rm /etc/apt/sources.list.d/timescaledb.list
    sudo rm /etc/apt/trusted.gpg.d/timescaledb.gpg
    ```

    For Ubuntu 21.10 and earlier, also remove the old GPG key:

    ```bash
    sudo apt-key del timescaledb 2>/dev/null || true
    ```

1.  **Update the package list**

    ```bash
    sudo apt update
    ```

1.  **(Optional) Remove TimescaleDB dependencies**

    If you want to remove packages that were installed as dependencies:

    ```bash
    sudo apt autoremove
    ```

</Procedure>

</Tab>

<Tab title="Red Hat" label="redhat">

<Procedure>

## Uninstalling TimescaleDB from Red Hat

1.  **Drop the TimescaleDB extension from your databases**

    Connect to each database where TimescaleDB is enabled and remove the extension:

    ```bash
    sudo -u postgres psql -d <database_name>
    ```

    At the `psql` prompt:

    ```sql
    DROP EXTENSION IF NOT EXISTS timescaledb CASCADE;
    ```

    Repeat this for all databases with TimescaleDB enabled. To exit psql, type `\q`.

    <Highlight type="warning">

    Using `CASCADE` will drop all TimescaleDB-specific objects including hypertables, continuous aggregates, and retention policies. Ensure you have backed up any data you want to keep.

    </Highlight>

1.  **Remove TimescaleDB from shared_preload_libraries**

    Edit the PostgreSQL configuration file:

    ```bash
    sudo vi /var/lib/pgsql/17/data/postgresql.conf
    ```

    Find the line with `shared_preload_libraries` and remove `timescaledb` from the list. For example, change:

    ```
    shared_preload_libraries = 'timescaledb'
    ```

    to:

    ```
    shared_preload_libraries = ''
    ```

    If there are other extensions in the list, keep them and only remove `timescaledb`.

1.  **Restart PostgreSQL**

    ```bash
    sudo systemctl restart postgresql-17
    ```

    Replace `17` with your PostgreSQL version if different.

1.  **Uninstall the TimescaleDB package**

    ```bash
    sudo yum remove timescaledb-2-postgresql-17
    ```

    Replace `17` with your PostgreSQL version if different.

    <Highlight type="warning">

    On some Red Hat systems, this command may try to remove `postgresql17-server` as an unused dependency. If you see PostgreSQL server in the removal list, type `N` to cancel. TimescaleDB is already functionally uninstalled (extension dropped and configuration removed), so leaving the packages installed is safe.

    </Highlight>

1.  **Remove the TimescaleDB repository configuration**

    ```bash
    sudo rm /etc/yum.repos.d/timescale_timescaledb.repo
    ```

1.  **Clean the YUM cache**

    ```bash
    sudo yum clean all
    ```

</Procedure>

</Tab>

<Tab title="Fedora" label="fedora">

<Procedure>

1.  **Drop the TimescaleDB extension from your databases**

    Connect to each database where TimescaleDB is enabled and remove the extension:

    ```bash
    sudo -u postgres psql -d <database_name>
    ```

    At the `psql` prompt:

    ```sql
    DROP EXTENSION IF NOT EXISTS timescaledb CASCADE;
    ```

    Repeat this for all databases with TimescaleDB enabled. To exit psql, type `\q`.

    <Highlight type="warning">

    Using `CASCADE` will drop all TimescaleDB-specific objects including hypertables, continuous aggregates, and retention policies. Ensure you have backed up any data you want to keep.

    </Highlight>

1.  **Remove TimescaleDB from `shared_preload_libraries`**

    Edit the PostgreSQL configuration file:

    ```bash
    sudo vi /var/lib/pgsql/17/data/postgresql.conf
    ```

    Find the line with `shared_preload_libraries` and remove `timescaledb` from the list. For example, change:

    ```
    shared_preload_libraries = 'timescaledb'
    ```

    to:

    ```
    shared_preload_libraries = ''
    ```

    If there are other extensions in the list, keep them and only remove `timescaledb`.

1.  **Restart PostgreSQL**

    ```bash
    sudo systemctl restart postgresql-17
    ```

    Replace `17` with your PostgreSQL version if different.

1.  **Uninstall the TimescaleDB package**

    ```bash
    sudo dnf remove timescaledb-2-postgresql-17
    ```

    Replace `17` with your PostgreSQL version if different.

    <Highlight type="warning">

    On some Fedora systems, this command may try to remove `postgresql17-server` as an unused dependency. If you see PostgreSQL server in the removal list, type `N` to cancel. TimescaleDB is already functionally uninstalled (extension dropped and configuration removed), so leaving the packages installed is safe.

    </Highlight>

1.  **Remove the TimescaleDB repository configuration**

    ```bash
    sudo rm /etc/yum.repos.d/timescale_timescaledb.repo
    ```

1.  **Clean the DNF cache**

    ```bash
    sudo dnf clean all
    ```

</Procedure>

</Tab>

<Tab title="RockyLinux" label="rocky">

<Procedure>

1.  **Drop the TimescaleDB extension from your databases**

    Connect to each database where TimescaleDB is enabled and remove the extension:

    ```bash
    sudo -u postgres psql -d <database_name>
    ```

    At the `psql` prompt:

    ```sql
    DROP EXTENSION IF NOT EXISTS timescaledb CASCADE;
    ```

    Repeat this for all databases with TimescaleDB enabled. To exit psql, type `\q`.

    <Highlight type="warning">

    Using `CASCADE` will drop all TimescaleDB-specific objects including hypertables, continuous aggregates, and retention policies. Ensure you have backed up any data you want to keep.

    </Highlight>

1.  **Remove TimescaleDB from `shared_preload_libraries`**

    Edit the PostgreSQL configuration file:

    ```bash
    sudo vi /var/lib/pgsql/17/data/postgresql.conf
    ```

    Find the line with `shared_preload_libraries` and remove `timescaledb` from the list. For example, change:

    ```
    shared_preload_libraries = 'timescaledb'
    ```

    to:

    ```
    shared_preload_libraries = ''
    ```

    If there are other extensions in the list, keep them and only remove `timescaledb`.

1.  **Restart PostgreSQL**

    ```bash
    sudo systemctl restart postgresql-17
    ```

    Replace `17` with your PostgreSQL version if different.

1.  **Uninstall the TimescaleDB package**

    ```bash
    sudo yum remove timescaledb-2-postgresql-17
    ```

    Replace `17` with your PostgreSQL version if different.

1.  **Remove the TimescaleDB repository configuration**

    ```bash
    sudo rm /etc/yum.repos.d/timescale_timescaledb.repo
    ```

1.  **Clean the YUM cache**

    ```bash
    sudo yum clean all
    ```

</Procedure>

</Tab>

</Tabs>

