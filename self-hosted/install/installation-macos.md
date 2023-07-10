---
title: Install TimescaleDB on macOS
excerpt: Install self-hosted TimescaleDB on macOS
products: [self_hosted]
keywords: [installation, self-hosted, macOS]
---

import Homebrew from "versionContent/_partials/_psql-installation-homebrew.mdx";
import MacPorts from "versionContent/_partials/_psql-installation-macports.mdx";
import WhereTo from "versionContent/_partials/_where-to-next.mdx";

# Install self-hosted TimescaleDB on macOS systems

You can host TimescaleDB yourself on your Apple macOS system.
These instructions use a Homebrew or MacPorts installer on these versions:

*   Apple macOS 10.15 Catalina
*   Apple macOS 11 Big Sur
*   Apple macOS 12 Monterey

<Highlight type="important">
Before you begin installing TimescaleDB, make sure you have installed PostgreSQL
version 12 or later.
</Highlight>

<Highlight type="warning">
If you have already installed PostgreSQL using a method other than Homebrew, you
could encounter errors following these instructions. It is safest to remove any
existing PostgreSQL installations before you begin. If you want to keep your
current PostgreSQL installation, do not install TimescaleDB using this method.
[Install from source](/self-hosted/latest/install/installation-source/)
instead.
</Highlight>

## Install self-hosted TimescaleDB using Homebrew

You can use Homebrew to install TimescaleDB on macOS-based systems.

<Procedure>

### Installing self-hosted TimescaleDB using Homebrew

1.  Install Homebrew, if you don't already have it:

    ```bash
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```

    For more information about Homebrew, including installation instructions,
    see the [Homebrew documentation][homebrew].
1.  At the command prompt, add the TimescaleDB Homebrew tap:

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

</Procedure>

When you have PostgreSQL and TimescaleDB installed, you can connect to it from
your local system using the `psql` command-line utility.

<Homebrew />

## Install self-hosted TimescaleDB using MacPorts

You can use MacPorts to install TimescaleDB on macOS-based systems.

<Procedure>

### Installing self-hosted TimescaleDB using MacPorts

1.  Install MacPorts by downloading and running the package installer.
    For more information about MacPorts, including installation instructions,
    see the [MacPorts documentation][macports].
1.  Install TimescaleDB:

    ```bash
    sudo port install timescaledb
    ```

1.  [](#)<Optional />View the files that were installed:

    ```bash
    port contents timescaledb
    ```

<Highlight type="important">
MacPorts does not install the `timescaledb-tools` to run the `timescaledb-tune`
script. For more information about installing and using the tool, see
[`timescaledb-tune`](/self-hosted/latest/configuration/timescaledb-tune/#timescaledb-tuning-tool)
section.
</Highlight>

</Procedure>

When you have PostgreSQL and TimescaleDB installed, you can connect to it from
your local system using the `psql` command-line utility.

<MacPorts />

## Set up the TimescaleDB extension

Connect to PostgreSQL from your local system using the `psql` command-line
utility and set up the TimescaleDB extension.

<Procedure>

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

</Procedure>

After you have created the extension and the database, you can connect to your
database directly using this command:

```bash
psql -U postgres -h localhost -d tsdb
```

## Where to next

 <WhereTo />

[homebrew]: https://docs.brew.sh/Installation
[install-psql]: /use-timescale/:currentVersion:/integrations/query-admin/about-psql/
[macports]: https://guide.macports.org/#installing.macports
