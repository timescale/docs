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
1.  Run the setup script to complete installation:
    ```bash
    /usr/local/bin/timescaledb_move.sh
    ```

</procedure>

## Install self-hosted TimescaleDB using MacPorts
You can use MacPorts to install TimescaleDB on macOS-based systems.

<procedure>

#### Installing self-hosted TimescaleDB using MacPorts
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
 MacPorts does not install the `timescaledb-tools` to run the `timescaledb-tune` script.
 For more information about installing and using the tool, see [`timescaledb-tune`](/timescaledb/latest/how-to-guides/configuration/timescaledb-tune/#timescaledb-tuning-tool) section.
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
1.  On your local system, at the command prompt, connect to the PostgreSQL
    instance as the `postgres` superuser:
    ```bash
    psql -U postgres -h localhost
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
    psql -U postgres -h localhost -d example
    ```

</procedure>

You can check that the TimescaleDB extension is installed by using the `\dx`
command at the `psql` prompt. It looks like this:
```sql
tsdb=> \dx
List of installed extensions
-[ RECORD 1 ]------------------------------------------------------------------
Name        | pg_stat_statements
Version     | 1.7
Schema      | public
Description | track execution statistics of all SQL statements executed
-[ RECORD 2 ]------------------------------------------------------------------
Name        | plpgsql
Version     | 1.0
Schema      | pg_catalog
Description | PL/pgSQL procedural language
-[ RECORD 3 ]------------------------------------------------------------------
Name        | timescaledb
Version     | 2.5.1
Schema      | public
Description | Enables scalable inserts and complex queries for time-series data
-[ RECORD 4 ]------------------------------------------------------------------
Name        | timescaledb_toolkit
Version     | 1.3.1
Schema      | public
Description | timescaledb_toolkit

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
[tsdb-docs]: /timescaledb/:currentVersion:/
[tutorials]: /timescaledb/:currentVersion:/tutorials/
[config]: /timescaledb/:currentVersion:/how-to-guides/configuration/
[homebrew]: https://docs.brew.sh/Installation
[install-psql]: /timescaledb/:currentVersion:/how-to-guides/connecting/psql/
[macports]: https://guide.macports.org/#installing.macports
[timescaledb-tune]: https://docs.timescale.com/timescaledb/latest/how-to-guides/configuration/timescaledb-tune/#timescaledb-tuning-tool
