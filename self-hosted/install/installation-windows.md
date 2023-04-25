---
title: Install TimescaleDB on Windows
excerpt: Install self-hosted TimescaleDB on Windows
products: [self_hosted]
keywords: [installation, self-hosted, Windows]
---

import Windows from "versionContent/_partials/_psql-installation-windows.mdx";
import WhereTo from "versionContent/_partials/_where-to-next.mdx";

# Install self-hosted TimescaleDB on Windows systems

You can host TimescaleDB yourself on your Microsoft Windows system.
These instructions use a `zip` installer on these versions:

*   Microsoft Windows 10
*   Microsoft Windows 11
*   Microsoft Windows Server 2019

The minimum supported PostgreSQL versions are:

*   PostgreSQL 12.8
*   PostgreSQL 13.5
*   PostgreSQL 14.0
*   PostgreSQL 15.0

<Highlight type="warning">
If you have already installed PostgreSQL using another method, you could
encounter errors following these instructions. It is safest to remove any
existing PostgreSQL installations before you begin. If you want to keep your
current PostgreSQL installation, do not install TimescaleDB using this method.
[Install from source](/self-hosted/latest/install/installation-source/) instead.
</Highlight>

## Prerequisites

To install PostgreSQL version 15.1.1 or later, make sure you have:

*   Installed OpenSSL 1.1.1

<Procedure>

## Installing self-hosted TimescaleDB on Windows-based systems

1.  Download and install the Visual C++ Redistributable for Visual Studio from
    [www.microsoft.com][ms-download].
1.  Download and install PostgreSQL from [www.postgresql.org][pg-download].
    You might need to add the `pg_config` file location to your path. In the Windows
    Search tool, search for `system environment variables`. The path should be
    `C:\Program Files\PostgreSQL\<version>\bin`.
2.  Download the TimescaleDB installation `.zip` file from
    [Windows releases][windows-releases].
3.  Locate the downloaded file on your local file system, and extract the files.
4.  In the extracted TimescaleDB directory, right-click the `setup.exe` file and
    select `Run as Administrator` to start the installer.

</Procedure>

When you have completed the installation, you need to configure your database so
that you can use it. The easiest way to do this is to run the `timescaledb-tune`
script, which is included with the `timescaledb-tools` package. For more
information, see the [configuration][config] section.

## Set up the TimescaleDB extension

When you have PostgreSQL and TimescaleDB installed, you can connect to it from
your local system using the `psql` command-line utility.

<Windows />

<Procedure>

### Setting up the TimescaleDB extension

1.  On your local system, at the command prompt, connect to the PostgreSQL
    instance as the `postgres` superuser:

    ```powershell
    psql -U postgres -h localhost
    ```

    If your connection is successful, you'll see a message like this, followed
    by the `psql` prompt:

    ```powershell
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

</Procedure>

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

## Windows releases

Here are the latest TimescaleDB releases for PostgreSQL 12, 13, 14, and 15. To see
information on releases, check out the
[GitHub releases page][gh-releases]. Also see the
[release notes][release-notes].

*   <Tag type="download">
    [PostgreSQL 15: Timescale release](https://github.com/timescale/timescaledb/releases/latest/download/timescaledb-postgresql-15-windows-amd64.zip)
    </Tag>
*   <Tag type="download">
    [PostgreSQL 14: Timescale release](https://github.com/timescale/timescaledb/releases/latest/download/timescaledb-postgresql-14-windows-amd64.zip)
    </Tag>
*   <Tag type="download">
    [PostgreSQL 13: Timescale release](https://github.com/timescale/timescaledb/releases/latest/download/timescaledb-postgresql-13-windows-amd64.zip)
    </Tag>
*   <Tag type="download">
    [PostgreSQL 12: Timescale release](https://github.com/timescale/timescaledb/releases/latest/download/timescaledb-postgresql-12-windows-amd64.zip)
    </Tag>

## Where to next

<WhereTo />

[gh-releases]: https://github.com/timescale/timescaledb/releases
[install-psql]: /use-timescale/:currentVersion:/connecting/psql/
[ms-download]: https://www.microsoft.com/en-us/download/details.aspx?id=48145
[pg-download]: https://www.postgresql.org/download/windows/
[release-notes]: /about/:currentVersion:/release-notes/
[tutorials]: /tutorials/:currentVersion:/
[windows-releases]: #windows-releases
