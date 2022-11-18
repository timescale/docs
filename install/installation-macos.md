---
title: Install TimescaleDB on macOS
nav-title: macOS
excerpt: Install self-hosted TimescaleDB on macOS
section: install
subsection: self-hosted
keywords: [install, self-hosted, macOS]
---

import Homebrew from "versionContent/_partials/_psql-installation-homebrew.mdx";
import MacPorts from "versionContent/_partials/_psql-installation-macports.mdx";

# Install self-hosted TimescaleDB on macOS systems

You can host TimescaleDB yourself on your Apple macOS system.
These instructions use a Homebrew or MacPorts installer on these versions:

*   Apple macOS 10.15 Catalina
*   Apple macOS 11 Big Sur
*   Apple macOS 12 Monterey

<highlight type="important">
Before you begin installing TimescaleDB, make sure you have installed PostgreSQL
version 12 or later.
</highlight>

<highlight type="warning">
If you have already installed PostgreSQL using a method other than Homebrew, you
could encounter errors following these instructions. It is safest to remove any
existing PostgreSQL installations before you begin. If you want to keep your
current PostgreSQL installation, do not install TimescaleDB using this method.
[Install from source](/install/latest/self-hosted/installation-source/)
instead.
</highlight>

## Install self-hosted TimescaleDB using Homebrew

You can use Homebrew to install TimescaleDB on macOS-based systems.

<procedure>

### Installing self-hosted TimescaleDB using Homebrew

1.  Install Homebrew, if you don't already have it:

    ```bash
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```

    For more information about Homebrew, including installation instructions,
    see the [Homebrew documentation][homebrew].
1.  At the command prompt, add the Timescale Homebrew tap:

    ```bash
    brew tap timescale/tap
    ```

1.  Install TimescaleDB:

    ```bash
    brew install timescaledb
    ```

1.  Run the `timescaledb-tune` script to configure your database:

   ```bash
   timescaledb-tune --quiet --yes 
   ```

1.  Change to the directory where the setup script is located. It is typically,
   located at `/opt/homebrew/Cellar/timescaledb/<VERSION>/bin/`, where
   `<VERSION>` is the version of `timescaledb` that you installed:

   ```bash
   cd /opt/homebrew/Cellar/timescaledb/<VERSION>/bin/
   ```

1.  Run the setup script to complete installation.

    ```bash
    ./timescaledb_move.sh
    ```

</procedure>

When you have PostgreSQL and TimescaleDB installed, you can connect to it from
your local system using the `psql` command-line utility.

<Homebrew />

## Install self-hosted TimescaleDB using MacPorts

You can use MacPorts to install TimescaleDB on macOS-based systems.

<procedure>

### Installing self-hosted TimescaleDB using MacPorts

1.  Install MacPorts by downloading and running the package installer.
    For more information about MacPorts, including installation instructions,
    see the [MacPorts documentation][macports].
1.  Install TimescaleDB:

    ```bash
    sudo port install timescaledb
    ```

1.  **OPTIONAL** View the files that were installed:

    ```bash
    port contents timescaledb
    ```

<highlight type="important">
MacPorts does not install the `timescaledb-tools` to run the `timescaledb-tune`
script. For more information about installing and using the tool, see
[`timescaledb-tune`](/timescaledb/latest/how-to-guides/configuration/timescaledb-tune/#timescaledb-tuning-tool)
section.
</highlight>

</procedure>

When you have PostgreSQL and TimescaleDB installed, you can connect to it from
your local system using the `psql` command-line utility.

<MacPorts />

## Set up the TimescaleDB extension
Connect to PostgreSQL from your local system using the `psql` command-line
utility and set up the TimescaleDB extension.

<procedure>

### Setting up the TimescaleDB extension

1.  On your local system, at the command prompt, connect to the PostgreSQL
    instance as the `postgres` superuser:

    ```bash
    psql -U postgres -h localhost
    ```

    If your connection is successful, you'll see a message like this, followed
    by the `psql` prompt:

    ```bash
    psql (14.4)
    Type "help" for help.
    ```

1.  At the `psql` prompt, create an empty database named `tsdb`:

    ```sql
    CREATE database tsdb;
    ```

1.  Connect to the `tsdb` database that you created:

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

## Uninstalling TimescaleDB

If you installed TimescaleDB with Homebrew or MacPorts, you can uninstall 
it without having to uninstall PostgreSQL.

<procedure>

### Uninstalling TimescaleDB using Homebrew


1.  At the `psql` prompt, remove the TimescaleDB extension:

    ```sql
    DROP EXTENSION timescaledb;
    ```

1.  At the command prompt, remove `timescaledb` from `shared_preload_libraries` 
    in the `postgresql.conf` configuration file:

    ```bash
    nano /opt/homebrew/var/postgresql@14/postgresql.conf
    shared_preload_libraries = ''
    ```

1.  Save the changes to the `postgresql.conf` file.

1.  Restart PostgreSQL:

    ```bash
    brew services restart postgresql
    ```

1.  Check that the TimescaleDB extension is uninstalled by using the `\dx`
    command at the `psql` prompt. Output is similar to:

    ```sql
    tsdb-# \dx
                                          List of installed extensions
        Name     | Version |   Schema   |                            Description                            
    -------------+---------+------------+-------------------------------------------------------------------
     plpgsql     | 1.0     | pg_catalog | PL/pgSQL procedural language
    (1 row) 
    ```

1.  Uninstall TimescaleDB:

    ```bash
    brew uninstall timescaldb
    ```

1.  Remove all the dependencies and related files:

    ```bash
    brew remove timescaledb
    ```

</procedure>

<procedure>

### Uninstalling TimescaleDB using MacPorts

To uninstall TimescaleDB installed using Macports:

1.  Remove the TimescaleDB extension:

    ```sql
    tsdb=# DROP EXTENSION timescaledb;
    ```

1.  Remove `timescaledb` from `shared_preload_libraries` in the `postgresql.conf`:

    ```bash
    nano /opt/homebrew/var/postgresql@14/postgresql.conf
    shared_preload_libraries = ''
    ```

1.  Save the changes to the `postgresql.conf` file.

1.  Restart PostgreSQL:

    ```bash
    port reload postgresql
    ```

1.  Check that the TimescaleDB extension is uninstalled by using the `\dx`
    command at the `psql` prompt. Output is similar to:

    ```sql
    tsdb-# \dx
                                          List of installed extensions
        Name     | Version |   Schema   |                            Description                            
    -------------+---------+------------+-------------------------------------------------------------------
     plpgsql     | 1.0     | pg_catalog | PL/pgSQL procedural language
    (1 row) 
    ```

1.  Uninstall TimescaleDB and the related dependencies:

    ```bash
    port uninstall timescaldb --follow-dependencies
    ```

</procedure>

## Where to next

Now that you have your first TimescaleDB database up and running, you can check
out the [TimescaleDB][tsdb-docs] section, and find out what you can do with it.

If you want to work through some tutorials to help you get up and running with
TimescaleDB and time-series data, check out the [tutorials][tutorials] section.

You can always [contact us][contact] if you need help working something out, or
if you want to have a chat.

[contact]: https://www.timescale.com/contact
[tsdb-docs]: /timescaledb/:currentVersion:/
[tutorials]: /timescaledb/:currentVersion:/tutorials/
[homebrew]: https://docs.brew.sh/Installation
[install-psql]: /timescaledb/:currentVersion:/how-to-guides/connecting/psql/
[macports]: https://guide.macports.org/#installing.macports
