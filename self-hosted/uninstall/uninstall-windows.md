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

1.  **Uninstall TimescaleDB**

    1.  Open the Windows Control Panel:
        - Press `Win + R`, type `control`, and press Enter
        - Or search for "Control Panel" in the Start menu

    1.  Navigate to `Programs and Features` (or `Apps & features` in Windows 10/11)

    1.  Find `TimescaleDB` in the list of installed programs

    1.  Right-click `TimescaleDB` and select `Uninstall`, or click `Uninstall/Change`

    1.  Follow the uninstallation wizard to complete the process

    Alternatively, you can uninstall from PowerShell (run as Administrator):

    ```powershell
    Get-WmiObject -Class Win32_Product -Filter "Name LIKE '%TimescaleDB%'" | ForEach-Object { $_.Uninstall() }
    ```

1.  **Remove TimescaleDB files manually (if needed)**

    If the uninstaller doesn't remove all files, manually delete the TimescaleDB directory:

    ```
    C:\Program Files\PostgreSQL\<version>\lib\timescaledb*
    C:\Program Files\PostgreSQL\<version>\share\extension\timescaledb*
    ```

    You may need Administrator privileges to delete these files.

1.  **Remove TimescaleDB tools (if installed)**

    If you installed `timescaledb-tune` or other TimescaleDB tools separately, uninstall them through Programs and Features or delete them manually.

1.  **Clean up the system PATH (optional)**

    If TimescaleDB added any directories to your system PATH:

    1.  Search for "environment variables" in the Windows Search tool
    1.  Click `Edit the system environment variables`
    1.  Click `Environment Variables`
    1.  Under `System variables`, select `Path` and click `Edit`
    1.  Remove any entries related to TimescaleDB
    1.  Click `OK` to save

</Procedure>

## Verify uninstallation

After completing the uninstallation steps, verify that TimescaleDB has been removed:

1.  **Check that the extension is not loaded**

    Connect to PostgreSQL:

    ```bash
    psql -U postgres
    ```

    List installed extensions:

    ```sql
    \dx
    ```

    TimescaleDB should not appear in the list. You should only see default PostgreSQL extensions like `plpgsql`.

1.  **Verify the files are removed**

    Check that the TimescaleDB DLL files are no longer in the PostgreSQL directory:

    ```powershell
    dir "C:\Program Files\PostgreSQL\*\lib\timescaledb*"
    ```

    This command should return no results if TimescaleDB has been successfully uninstalled.

1.  **Check Programs and Features**

    Open `Programs and Features` and verify that TimescaleDB is no longer listed.
