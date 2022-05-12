# Install self-hosted TimescaleDB on Windows systems
You can host TimescaleDB yourself on your Microsoft Windows system.
These instructions use a `zip` installer on these versions:
*   Microsoft Windows 10
*   Microsoft Windows 11
*   Microsoft Windows Server 2019

For the latest Windows releases, see the [Windows releases
page][windows-releases].

<highlight type="important">
Before you begin installing TimescaleDB, make sure you have installed PostgreSQL
version 12 or later.
</highlight>

<highlight type="warning">
If you have already installed PostgreSQL using a method other than the `zip`
installer provided here, you could encounter errors following these
instructions. It is safest to remove any existing PostgreSQL installations
before you begin. If you want to keep your current PostgreSQL installation, do
not install TimescaleDB using this method.
[Install from source](/install/latest/self-hosted/installation-source/)
instead.
</highlight>

<procedure>

### Installing self-hosted TimescaleDB on Windows-based systems
1.  Download and install the Visual C++ Redistributable for Visual Studio from
    [www.microsoft.com][ms-download].
1.  Download and install PostgreSQL from [www.postgresql.org][pg-download].
1.  In the Windows Search tool, search for `system environment variables`. In
    the `System Properties` dialog, navigate to the `Advanced` tab, and
    click `Environment Variables...`. Locate the `Path` variable and
    click `Edit...`. In the `Edit environment variable` dialog, click `New` and
    type the path to your PostgreSQL `pg_config` file. It should
    be `C:\Program Files\PostgreSQL\14\bin\`. Click `OK` to save your changes.
1.  Download the TimescaleDB installation `.zip` file from our
    [Windows releases page][windows-releases].
1.  Locate the downloaded file on your local file system, and extract the files.
1.  In the extracted TimescaleDB directory, right-click the `setup.exe` file and
    select `Run as Administrator` to start the installer.

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
    ```powershell
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
    ```powershell
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
Version     | 2.4.1
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


[config]: timescaledb/:currentVersion:/how-to-guides/configuration/
[contact]: https://www.timescale.com/contact
[install-psql]: timescaledb/:currentVersion:/how-to-guides/connecting/psql/
[tsdb-docs]: timescaledb/:currentVersion:/index/
[tutorials]: /timescaledb/:currentVersion:/tutorials/
[ms-download]: https://www.microsoft.com/en-us/download/details.aspx?id=48145
[pg-download]: https://www.postgresql.org/download/windows/
[windows-releases]: self-hosted/installation-windows/windows-releases/
