---
title: Uninstall TimescaleDB on Windows
excerpt: Uninstall TimescaleDB from Windows without removing PostgreSQL
products: [self_hosted]
keywords: [uninstall, Windows]
---

# Uninstall TimescaleDB on Windows

If you installed TimescaleDB on Windows, you can uninstall it without removing PostgreSQL. This guide shows you how to completely remove TimescaleDB from your Windows system.

<Procedure>

## Uninstalling TimescaleDB from Windows

1.  **Drop the TimescaleDB extension from your databases**

    Open Command Prompt or PowerShell and connect to each database where TimescaleDB is enabled:

    ```bash
    psql -U postgres -d <database_name>
    ```

    At the `psql` prompt, remove the extension:

    ```sql
    DROP EXTENSION IF EXISTS timescaledb CASCADE;
    ```

    Repeat this for all databases with TimescaleDB enabled. To exit psql, type `\q`.

    <Highlight type="warning">

    Using `CASCADE` will drop all TimescaleDB-specific objects including hypertables, continuous aggregates, and retention policies. Ensure you have backed up any data you want to keep.

    </Highlight>

1.  **Remove TimescaleDB from shared_preload_libraries**

    Locate your PostgreSQL configuration file. The default location is:

    ```
    C:\Program Files\PostgreSQL\<version>\data\postgresql.conf
    ```

    Open the file in a text editor (you may need to run the editor as Administrator).

    Find the line with `shared_preload_libraries` and remove `timescaledb` from the list. For example, change:

    ```
    shared_preload_libraries = 'timescaledb'
    ```

    to:

    ```
    shared_preload_libraries = ''
    ```

    If there are other extensions in the list, keep them and only remove `timescaledb`.

    Save the file.

1.  **Restart the PostgreSQL service**

    Open Services (press `Win + R`, type `services.msc`, and press Enter).

    Find the PostgreSQL service (usually named `postgresql-x64-<version>`), right-click it, and select `Restart`.

    Alternatively, from an Administrator Command Prompt or PowerShell:

    ```powershell
    net stop postgresql-x64-<version>
    net start postgresql-x64-<version>
    ```

    Replace `<version>` with your PostgreSQL version number (for example, `17`).

1.  **Remove TimescaleDB files**

    Open PowerShell as Administrator and manually delete the TimescaleDB library and extension files:

    ```powershell
    Remove-Item "C:\Program Files\PostgreSQL\<version>\lib\timescaledb*"
    Remove-Item "C:\Program Files\PostgreSQL\<version>\share\extension\timescaledb*"
    ```

    Replace `<version>` with your PostgreSQL version number (for example, `17`).

</Procedure>


