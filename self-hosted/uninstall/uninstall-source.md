---
title: Uninstall TimescaleDB installed from source
excerpt: Uninstall TimescaleDB that was built and installed from source code
products: [self_hosted]
keywords: [uninstall, source]
---

# Uninstall TimescaleDB installed from source

If you installed TimescaleDB by building from source, you can uninstall it without removing PostgreSQL. This guide shows you how to remove TimescaleDB that was compiled and installed from the source code.

<Tabs label="Uninstall TimescaleDB from source" persistKey="os">

<Tab title="Linux" label="linux">

<Procedure>

## Uninstalling TimescaleDB on Linux

1.  **Drop the TimescaleDB extension from your databases**

    Connect to each database where TimescaleDB is enabled and remove the extension:

    ```bash
    sudo -u postgres psql -d <database_name>
    ```

    At the `psql` prompt:

    ```sql
    DROP EXTENSION IF EXISTS timescaledb CASCADE;
    ```

    Repeat this for all databases with TimescaleDB enabled. To exit psql, type `\q`.

    <Highlight type="warning">

    Using `CASCADE` will drop all TimescaleDB-specific objects including hypertables, continuous aggregates, and retention policies. Ensure you have backed up any data you want to keep.

    </Highlight>

1.  **Remove TimescaleDB from shared_preload_libraries**

    Locate your PostgreSQL configuration file:

    ```bash
    psql -d postgres -c "SHOW config_file;"
    ```

    Edit the configuration file (you may need sudo privileges):

    ```bash
    sudo nano /path/to/postgresql.conf
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

    Save the file.

1.  **Restart PostgreSQL**

    ```bash
    sudo service postgresql restart
    ```

    Or, depending on your system:

    ```bash
    sudo systemctl restart postgresql
    ```

1.  **Uninstall the TimescaleDB binaries**

    Navigate to your TimescaleDB build directory:

    ```bash
    cd /path/to/timescaledb/build
    ```

    Uninstall the files:

    ```bash
    sudo make uninstall
    ```

    <Highlight type="note">

    If you no longer have the build directory, you'll need to manually remove the TimescaleDB files from your PostgreSQL installation directory.

    </Highlight>

1.  **Manually remove TimescaleDB files (if make uninstall fails)**

    If the `make uninstall` command doesn't work, manually remove the files:

    Find your PostgreSQL library directory:

    ```bash
    pg_config --pkglibdir
    ```

    Remove TimescaleDB library files:

    ```bash
    sudo rm $(pg_config --pkglibdir)/timescaledb*.so
    ```

    Find your PostgreSQL extension directory:

    ```bash
    pg_config --sharedir
    ```

    Remove TimescaleDB extension files:

    ```bash
    sudo rm -rf $(pg_config --sharedir)/extension/timescaledb*
    ```

1.  **(Optional) Remove the TimescaleDB source directory**

    If you no longer need the source code:

    ```bash
    cd /path/to/parent/directory
    rm -rf timescaledb
    ```

1.  **Verify removal**

    Connect to PostgreSQL and check that the extension is not available:

    ```bash
    psql -U postgres
    ```

    Try to create the extension:

    ```sql
    CREATE EXTENSION timescaledb;
    ```

    You should see an error indicating the extension is not found. This confirms TimescaleDB has been successfully uninstalled.

</Procedure>

</Tab>

<Tab title="Windows" label="windows">

<Procedure>

## Uninstalling TimescaleDB on Windows

1.  **Drop the TimescaleDB extension from your databases**

    Open Command Prompt or PowerShell and connect to each database where TimescaleDB is enabled:

    ```powershell
    psql -U postgres -d <database_name>
    ```

    At the `psql` prompt:

    ```sql
    DROP EXTENSION IF EXISTS timescaledb CASCADE;
    ```

    Repeat this for all databases with TimescaleDB enabled. To exit psql, type `\q`.

    <Highlight type="warning">

    Using `CASCADE` will drop all TimescaleDB-specific objects including hypertables, continuous aggregates, and retention policies. Ensure you have backed up any data you want to keep.

    </Highlight>

1.  **Remove TimescaleDB from shared_preload_libraries**

    Locate your PostgreSQL configuration file:

    ```powershell
    psql -U postgres -d postgres -c "SHOW config_file;"
    ```

    Open the configuration file in a text editor (you may need Administrator privileges). The default location is:

    ```
    C:\Program Files\PostgreSQL\<version>\data\postgresql.conf
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

    Save the file.

1.  **Restart PostgreSQL**

    Open Services (press `Win + R`, type `services.msc`, and press Enter).

    Find the PostgreSQL service, right-click it, and select `Restart`.

    Alternatively, from an Administrator Command Prompt or PowerShell:

    ```powershell
    pg_ctl restart
    ```

1.  **Uninstall the TimescaleDB binaries**

    Navigate to your TimescaleDB build directory:

    ```powershell
    cd \path\to\timescaledb\build
    ```

    Uninstall the files:

    ```powershell
    cmake --build . --config Release --target uninstall
    ```

    <Highlight type="note">

    If you no longer have the build directory, you'll need to manually remove the TimescaleDB files from your PostgreSQL installation directory.

    </Highlight>

1.  **Manually remove TimescaleDB files (if cmake uninstall fails)**

    If the cmake uninstall command doesn't work, manually remove the files.

    Find your PostgreSQL library directory:

    ```powershell
    pg_config --pkglibdir
    ```

    Remove TimescaleDB DLL files:

    ```powershell
    del "C:\Program Files\PostgreSQL\<version>\lib\timescaledb*.dll"
    ```

    Find your PostgreSQL extension directory:

    ```powershell
    pg_config --sharedir
    ```

    Remove TimescaleDB extension files:

    ```powershell
    rmdir /s "C:\Program Files\PostgreSQL\<version>\share\extension\timescaledb*"
    ```

    You may need Administrator privileges to delete these files.

1.  **(Optional) Remove the TimescaleDB source directory**

    If you no longer need the source code:

    ```powershell
    cd \path\to\parent\directory
    rmdir /s timescaledb
    ```

1.  **Verify removal**

    Connect to PostgreSQL and check that the extension is not available:

    ```powershell
    psql -U postgres
    ```

    Try to create the extension:

    ```sql
    CREATE EXTENSION timescaledb;
    ```

    You should see an error indicating the extension is not found. This confirms TimescaleDB has been successfully uninstalled.

</Procedure>

</Tab>

</Tabs>

## Additional cleanup

After uninstalling, you may want to remove any additional TimescaleDB-related files:

### Remove TimescaleDB tools

If you installed `timescaledb-tune` or other tools from source, remove them:

**Linux:**
```bash
# Find where timescaledb-tune is installed
which timescaledb-tune

# Remove it
sudo rm $(which timescaledb-tune)
```

**Windows:**
```powershell
# Find where timescaledb-tune is installed
where timescaledb-tune

# Remove it
del "path\to\timescaledb-tune.exe"
```

### Clean up environment variables

If you added TimescaleDB paths to your `PATH` environment variable during installation, remove them:

**Linux:**
Edit your shell configuration file (`~/.bashrc`, `~/.bash_profile`, or `~/.zshrc`) and remove any TimescaleDB-related PATH entries.

**Windows:**
1. Search for "environment variables" in the Windows Search tool
1. Click `Edit the system environment variables`
1. Click `Environment Variables`
1. Under `System variables` or `User variables`, select `Path` and click `Edit`
1. Remove any entries related to TimescaleDB
1. Click `OK` to save
