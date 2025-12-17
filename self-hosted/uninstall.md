---
title: Uninstall TimescaleDB
excerpt: Uninstall TimescaleDB without uninstalling PostgreSQL
products: [self_hosted]
keywords: [uninstall]
---

# Uninstall TimescaleDB

You can uninstall $TIMESCALE_DB without uninstalling $PG. Choose your platform below.

<Tabs label="Choose your platform or installation method" persistKey="uninstall-method">

<Tab title="Docker" label="docker">

If you installed $TIMESCALE_DB using Docker, you can completely remove the $TIMESCALE_DB container, image, and optionally the data volumes.

<Procedure>

1.  **Stop the running container**

    ```bash
    docker stop timescaledb
    ```

    If you named your container differently when you created it, replace `timescaledb` with your container name. 

1.  **Remove the container**

    ```bash
    docker rm timescaledb
    ```

    This removes the container but preserves the data volume and the Docker image.

1.  **List and remove the Docker image**

    1. See which $TIMESCALE_DB images you have installed:

       ```bash
       docker images | grep timescale
       ```
       You see something like:
       ```bash
       timescale/timescaledb-ha               pg18      1ec79f20f47d   9 hours ago    6.2GB
       ```

    1. Remove the $TIMESCALE_DB image:

       <Tabs label="Choose your platform or installation method" persistKey="docker-image">

        <Tab title="TimescaleDB-HA" label="ha">
       
        ```bash
        docker rmi timescale/timescaledb-ha:pg18
        ```
       
        </Tab>
        <Tab title="TimescaleDB light" label="light">
       
        ```bash
        docker rmi timescale/timescaledb:latest-pg18
        ```
    
        </Tab>
    
        </Tabs>
       
        Replace `pg18` with your $PG version.
    
1.  **(Optional) Remove the data**

    <Highlight type="warning">

    This step permanently deletes all your database data. Only proceed if you're sure you no longer need this data or have backed it up.

    </Highlight>

    List all Docker volumes:

    ```bash
    docker volume ls
    ```

    If you used a named volume when creating your container, remove it:

    ```bash
    docker volume rm <volume-name>
    ```

    If you used a host directory mount (with the `-v </a/local/data/folder>:/pgdata` flag), you can manually delete that directory:

    ```bash
    rm -rf </a/local/data/folder>
    ```

</Procedure>

</Tab>

<Tab title="Kubernetes" label="kubernetes">

If you deployed $TIMESCALE_DB on Kubernetes, you can completely remove all associated resources including the StatefulSet, Service, PersistentVolumeClaim, Secret, and application deployments.

<Procedure>

1.  **Back up any important data from your $TIMESCALE_DB instance**~~~~

    ```shell
    kubectl exec -it timescaledb-0 -- pg_dump -U postgres postgres > backup.sql
    ```

1.  **If you created a test pod during installation, delete it**

    ```shell
    kubectl delete pod test-pod
    ```

1.  **Remove any application deployments that connect to $TIMESCALE_DB**

    ```shell
    kubectl delete deployment timescale-app
    ```

1.  **Remove the service that exposes $TIMESCALE_DB within the cluster**

    ```shell
    kubectl delete service timescaledb
    ```

1.  **Delete the StatefulSet managing the $TIMESCALE_DB pods**

    ```shell
    kubectl delete statefulset timescaledb
    ```
    
    This terminates the $TIMESCALE_DB pod.

1.  **Delete the PersistentVolumeClaim**

    <Highlight type="warning">

    Deleting the PersistentVolumeClaim permanently deletes all your database data. Ensure you have backed up any data 
    you need before proceeding.

    </Highlight>

    ```shell
    kubectl delete pvc timescale-pvc
    ```

1.  **Remove the Kubernetes secret containing database credentials**

    ```shell
    kubectl delete secret timescale-secret
    ```

1.  **(Optional) Delete the namespace**

    If you created a dedicated namespace for $TIMESCALE_DB, you can remove it as well.

     <Highlight type="warning">

    Only delete the namespace if you're certain no other resources are using it. This will delete all resources in the namespace.

    </Highlight>

    ```shell
    kubectl delete namespace timescale
    ```


</Procedure>

</Tab>

<Tab title="Linux" label="linux">

Take the following steps to uninstall $TIMESCALE_DB based on your distribution:

<Tabs label="Choose your Linux distribution" persistKey="linux-distro">

<Tab title="Debian" label="debian">

<Procedure>

1.  **Drop the $TIMESCALE_DB extension from your databases**

    1. Connect to each database where $TIMESCALE_DB is enabled and remove the extension:

       ```bash
       sudo -u postgres psql -d <database_name>
       ```

    1. At the `psql` prompt:

       ```sql
       DROP EXTENSION timescaledb CASCADE;
       ```

    Repeat this for all databases with $TIMESCALE_DB enabled. To exit psql, type `\q`.

    <Highlight type="warning">

    Using `CASCADE` will drop all $TIMESCALE_DB-specific objects including hypertables, continuous aggregates, and retention policies. Ensure you have backed up any data you want to keep.

    </Highlight>

1.  **Remove $TIMESCALE_DB from `shared_preload_libraries`**

    Edit the $PG configuration file:

    ```bash
    sudo vi /etc/postgresql/18/main/postgresql.conf
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

1.  **Uninstall the $TIMESCALE_DB package**

    ```bash
    sudo apt remove timescaledb-2-postgresql-18
    ```

    Replace `18` with your $PG version if different.

1.  **Remove the $TIMESCALE_DB repository configuration**

    ```bash
    sudo rm /etc/apt/sources.list.d/timescaledb.list
    sudo rm /etc/apt/trusted.gpg.d/timescaledb.gpg
    sudo apt update
    ```

1.  **Remove dependencies**

    Remove unused dependencies installed with $TIMESCALE_DB:

    <Highlight type="warning">

    This step may also remove PostgreSQL as a dependency.

    </Highlight>

    ```bash
    sudo apt autoremove
    ```

</Procedure>

</Tab>

<Tab title="Ubuntu" label="ubuntu">

<Procedure>

1.  **Drop the $TIMESCALE_DB extension from your databases**

    1. Connect to each database where $TIMESCALE_DB is enabled and remove the extension:

       ```bash
       sudo -u postgres psql -d <database_name>
       ```

    1. At the `psql` prompt:

       ```sql
       DROP EXTENSION timescaledb CASCADE;
       ```

    Repeat this for all databases with $TIMESCALE_DB enabled. To exit psql, type `\q`.

    <Highlight type="warning">

    Using `CASCADE` will drop all $TIMESCALE_DB-specific objects including hypertables, continuous aggregates, and retention policies. Ensure you have backed up any data you want to keep.

    </Highlight>

1.  **Remove $TIMESCALE_DB from `shared_preload_libraries`**

    Edit the $PG configuration file:

    ```bash
    sudo vi /etc/postgresql/18/main/postgresql.conf
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

1.  **Uninstall the $TIMESCALE_DB package**

    ```bash
    sudo apt remove timescaledb-2-postgresql-18
    ```

    Replace `18` with your $PG version if different.

1.  **Remove the $TIMESCALE_DB repository configuration**

    ```bash
    sudo rm /etc/apt/sources.list.d/timescaledb.list
    sudo rm /etc/apt/trusted.gpg.d/timescaledb.gpg
    sudo apt update
    ```

1.  **Remove dependencies**

    Remove unused dependencies installed with $TIMESCALE_DB:

    <Highlight type="warning">

    This step may also remove PostgreSQL as a dependency.

    </Highlight>

    ```bash
    sudo apt autoremove
    ```

</Procedure>

</Tab>

<Tab title="RHEL" label="rhel">

<Procedure>

1.  **Drop the $TIMESCALE_DB extension from your databases**

    1. Connect to each database where $TIMESCALE_DB is enabled and remove the extension:

       ```bash
       sudo -u postgres psql -d <database_name>
       ```

    1. At the `psql` prompt:

       ```sql
       DROP EXTENSION timescaledb CASCADE;
       ```

    Repeat this for all databases with $TIMESCALE_DB enabled. To exit psql, type `\q`.

    <Highlight type="warning">

    Using `CASCADE` will drop all $TIMESCALE_DB-specific objects including hypertables, continuous aggregates, and retention policies. Ensure you have backed up any data you want to keep.

    </Highlight>

1.  **Remove $TIMESCALE_DB from `shared_preload_libraries`**

    Edit the $PG configuration file:

    ```bash
    sudo vi /var/lib/pgsql/18/data/postgresql.conf
    ```

    Press `/` to search, type `shared_preload_libraries`, and press Enter. Press `i` to edit. Find the line with `shared_preload_libraries` and remove `timescaledb` from the list. For example, change:

    ```
    shared_preload_libraries = 'timescaledb'
    ```

    to:

    ```
    shared_preload_libraries = ''
    ```

    If there are other extensions in the list, keep them and only remove `timescaledb`. Press `Esc`, then type `:wq` and press Enter to save.

1.  **Restart $PG**

    ```bash
    sudo systemctl restart postgresql-18
    ```

    Replace `18` with your $PG version if different.

1.  **Uninstall the $TIMESCALE_DB package**

    ```bash
    sudo dnf remove timescaledb-2-postgresql-18
    ```

    Replace `18` with your $PG version if different.

1.  **Remove the $TIMESCALE_DB repository configuration**

    ```bash
    sudo rm /etc/yum.repos.d/timescale_timescaledb.repo
    ```

1.  **Remove dependencies**

    Remove unused dependencies installed with $TIMESCALE_DB:

    <Highlight type="warning">

    This step may also remove PostgreSQL as a dependency.

    </Highlight>

    ```bash
    sudo dnf autoremove
    ```

</Procedure>

</Tab>

<Tab title="Fedora" label="fedora">

<Procedure>

1.  **Drop the $TIMESCALE_DB extension from your databases**

    1. Connect to each database where $TIMESCALE_DB is enabled and remove the extension:

       ```bash
       sudo -u postgres psql -d <database_name>
       ```

    1. At the `psql` prompt:

       ```sql
       DROP EXTENSION timescaledb CASCADE;
       ```

    Repeat this for all databases with $TIMESCALE_DB enabled. To exit psql, type `\q`.

    <Highlight type="warning">

    Using `CASCADE` will drop all $TIMESCALE_DB-specific objects including hypertables, continuous aggregates, and retention policies. Ensure you have backed up any data you want to keep.

    </Highlight>

1.  **Remove $TIMESCALE_DB from `shared_preload_libraries`**

    Edit the $PG configuration file:

    ```bash
    sudo vi /var/lib/pgsql/18/data/postgresql.conf
    ```

    Press `/` to search, type `shared_preload_libraries`, and press Enter. Press `i` to edit. Find the line with `shared_preload_libraries` and remove `timescaledb` from the list. For example, change:

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
    sudo systemctl restart postgresql-18
    ```

    Replace `18` with your $PG version if different.

1.  **Uninstall the $TIMESCALE_DB package**

    ```bash
    sudo dnf remove timescaledb-2-postgresql-18
    ```

    Replace `18` with your $PG version if different.

1.  **Remove the $TIMESCALE_DB repository configuration**

    ```bash
    sudo rm /etc/yum.repos.d/timescale_timescaledb.repo
    ```

1.  **Remove dependencies**

    Remove unused dependencies installed with $TIMESCALE_DB:

    <Highlight type="warning">

    This step may also remove PostgreSQL as a dependency.

    </Highlight>

    ```bash
    sudo dnf autoremove
    ```

</Procedure>

</Tab>

<Tab title="Rocky" label="rocky">

<Procedure>

1.  **Drop the $TIMESCALE_DB extension from your databases**

    1. Connect to each database where $TIMESCALE_DB is enabled and remove the extension:

       ```bash
       sudo -u postgres psql -d <database_name>
       ```

    1. At the `psql` prompt:

       ```sql
       DROP EXTENSION timescaledb CASCADE;
       ```

    Repeat this for all databases with $TIMESCALE_DB enabled. To exit psql, type `\q`.

    <Highlight type="warning">

    Using `CASCADE` will drop all $TIMESCALE_DB-specific objects including hypertables, continuous aggregates, and retention policies. Ensure you have backed up any data you want to keep.

    </Highlight>

1.  **Remove $TIMESCALE_DB from `shared_preload_libraries`**

    Edit the $PG configuration file:

    ```bash
    sudo vi /var/lib/pgsql/18/data/postgresql.conf
    ```

    Press `/` to search, type `shared_preload_libraries`, and press Enter. Press `i` to edit. Find the line with `shared_preload_libraries` and remove `timescaledb` from the list. For example, change:

    ```
    shared_preload_libraries = 'timescaledb'
    ```

    to:

    ```
    shared_preload_libraries = ''
    ```

    If there are other extensions in the list, keep them and only remove `timescaledb`. Press `Esc`, then type `:wq` and press Enter to save.

1.  **Restart $PG**

    ```bash
    sudo systemctl restart postgresql-18
    ```

    Replace `18` with your $PG version if different.

1.  **Uninstall the $TIMESCALE_DB package**

    ```bash
    sudo dnf remove timescaledb-2-postgresql-18
    ```

    Replace `18` with your $PG version if different.

1.  **Remove the $TIMESCALE_DB repository configuration**

    ```bash
    sudo rm /etc/yum.repos.d/timescale_timescaledb.repo
    ```

1.  **Remove dependencies**

    Remove unused dependencies installed with $TIMESCALE_DB:

    <Highlight type="warning">

    This step may also remove PostgreSQL as a dependency.

    </Highlight>

    ```bash
    sudo dnf autoremove
    ```

</Procedure>

</Tab>

</Tabs>

</Tab>

<Tab title="macOS" label="macos">

Uninstall $SELF_LONG with Homebrew or MacPorts. 

<Tabs label="Choose your package manager" persistKey="macos-pm">

<Tab title="Homebrew" label="homebrew">

<Procedure>

1.  **Drop the $TIMESCALE_DB extension from your databases**

    At the `psql` prompt, remove the $TIMESCALE_DB extension:

    ```sql
    DROP EXTENSION timescaledb CASCADE;
    ```
    Repeat this for all databases with $TIMESCALE_DB enabled. To exit psql, type `\q`.
2. 
1.  **Remove $TIMESCALE_DB from `shared_preload_libraries`**

    Edit the $PG configuration file:

    ```bash
    sudo vi /opt/homebrew/var/postgresql@17/postgresql.conf
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
    brew services restart postgresql@17
    ```

1.  **Uninstall $TIMESCALE_DB**

    ```bash
    brew uninstall timescaledb-tools timescaledb
    ```

1.  **Remove all the dependencies and related files**

    ```bash
    brew untap timescale/tap
    ```

</Procedure>

</Tab>

<Tab title="MacPorts" label="macports">

<Procedure>

1.  **Drop the $TIMESCALE_DB extension from your databases**

    At the `psql` prompt, remove the $TIMESCALE_DB extension:

    ```sql
    DROP EXTENSION timescaledb CASCADE;
    ```

1.  **Remove $TIMESCALE_DB from `shared_preload_libraries`**

    At the command prompt, remove `timescaledb` from `shared_preload_libraries` in the `postgresql.conf` configuration file:

    ```bash
    nano /opt/homebrew/var/postgresql@14/postgresql.conf
    shared_preload_libraries = ''
    ```

1.  **Save the changes to the `postgresql.conf` file**
1.  **Restart $PG**

    ```bash
    port reload postgresql
    ```

1.  **Uninstall $TIMESCALE_DB and the related dependencies**

    ```bash
    port uninstall timescaledb --follow-dependencies
    ```

</Procedure>

</Tab>

</Tabs>

</Tab>

<Tab title="Source" label="source">

If you installed $TIMESCALE_DB by building from source, you can uninstall it without removing $PG.

<Procedure>

1.  **Drop the $TIMESCALE_DB extension from your databases**

    Connect to each database where $TIMESCALE_DB is enabled and remove the extension:

    <Tabs label="Connect to database" persistKey="os-source-connect">

    <Tab title="Linux" label="linux">

    ```bash
    sudo -u postgres psql -d <database_name>
    ```

    </Tab>

    <Tab title="macOS" label="macos">

    ```bash
    psql -U postgres -d <database_name>
    ```

    </Tab>

    <Tab title="Windows" label="windows">

    ```powershell
    psql -U postgres -d <database_name>
    ```

    </Tab>

    </Tabs>

    At the `psql` prompt:

    ```sql
    DROP EXTENSION timescaledb CASCADE;
    ```

    Repeat this for all databases with $TIMESCALE_DB enabled. To exit psql, type `\q`.

    <Highlight type="warning">

    Using `CASCADE` will drop all $TIMESCALE_DB-specific objects including hypertables, continuous aggregates, and retention policies. Ensure you have backed up any data you want to keep.

    </Highlight>

1.  **Remove $TIMESCALE_DB from `shared_preload_libraries`**

    Locate your $PG configuration file:

    <Tabs label="Locate config file" persistKey="os-source-config">

    <Tab title="Linux" label="linux">

    ```bash
    psql -d postgres -c "SHOW config_file;"
    ```

    </Tab>

    <Tab title="macOS" label="macos">

    ```bash
    psql -d postgres -c "SHOW config_file;"
    ```

    </Tab>

    <Tab title="Windows" label="windows">

    ```powershell
    psql -U postgres -d postgres -c "SHOW config_file;"
    ```

    </Tab>

    </Tabs>

    Edit the configuration file. You may need sudo/Administrator privileges:

    <Tabs label="Edit config file" persistKey="os-source-edit-config">

    <Tab title="Linux" label="linux">

    ```bash
    sudo vi /path/to/postgresql.conf
    ```

    </Tab>

    <Tab title="macOS" label="macos">

    ```bash
    sudo vi /path/to/postgresql.conf
    ```

    </Tab>

    <Tab title="Windows" label="windows">

    Open the configuration file in a text editor as Administrator. The default location is:
    ```
    C:\Program Files\PostgreSQL\<version>\data\postgresql.conf
    ```

    </Tab>

    </Tabs>

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

1.  **Restart $PG**

    <Tabs label="Restart Postgres" persistKey="os-source-restart">

    <Tab title="Linux" label="linux">

    ```bash
    sudo service postgresql restart
    ```

    Or, depending on your system:

    ```bash
    sudo systemctl restart postgresql
    ```

    </Tab>

    <Tab title="macOS" label="macos">

    ```bash
    brew services restart postgresql@<version>
    ```

    </Tab>

    <Tab title="Windows" label="windows">

    Open Services (press `Win + R`, type `services.msc`, and press Enter).

    Find the PostgreSQL service, right-click it, and select `Restart`.

    Alternatively, from an Administrator Command Prompt or PowerShell:

    ```powershell
    pg_ctl restart
    ```

    </Tab>

    </Tabs>

1.  **Remove $TIMESCALE_DB binaries**

    Manually remove the $TIMESCALE_DB files from your $PG installation directory.

    Find your $PG library directory:

    <Tabs label="Find library directory" persistKey="os-source-pkglibdir">

    <Tab title="Linux" label="linux">

    ```bash
    pg_config --pkglibdir
    ```

    </Tab>

    <Tab title="macOS" label="macos">

    ```bash
    pg_config --pkglibdir
    ```

    </Tab>

    <Tab title="Windows" label="windows">

    ```powershell
    pg_config --pkglibdir
    ```

    </Tab>

    </Tabs>

    Remove $TIMESCALE_DB library files:

    <Tabs label="Remove library files" persistKey="os-source-rm-lib">

    <Tab title="Linux" label="linux">

    ```bash
    sudo rm $(pg_config --pkglibdir)/timescaledb*.so
    ```

    </Tab>

    <Tab title="macOS" label="macos">

    ```bash
    sudo rm $(pg_config --pkglibdir)/timescaledb*.so
    ```

    <Highlight type="note">

    On macOS, you may also need to remove `.dylib` files:

    ```bash
    sudo rm $(pg_config --pkglibdir)/timescaledb*.dylib
    ```

    </Highlight>

    </Tab>

    <Tab title="Windows" label="windows">

    ```powershell
    del "C:\Program Files\PostgreSQL\<version>\lib\timescaledb*.dll"
    ```

    </Tab>

    </Tabs>

    Find your $PG extension directory:

    <Tabs label="Find extension directory" persistKey="os-source-sharedir">

    <Tab title="Linux" label="linux">

    ```bash
    pg_config --sharedir
    ```

    </Tab>

    <Tab title="macOS" label="macos">

    ```bash
    pg_config --sharedir
    ```

    </Tab>

    <Tab title="Windows" label="windows">

    ```powershell
    pg_config --sharedir
    ```

    </Tab>

    </Tabs>

    Remove $TIMESCALE_DB extension files:

    <Tabs label="Remove extension files" persistKey="os-source-rm-ext">

    <Tab title="Linux" label="linux">

    ```bash
    sudo rm -rf $(pg_config --sharedir)/extension/timescaledb*
    ```

    </Tab>

    <Tab title="macOS" label="macos">

    ```bash
    sudo rm -rf $(pg_config --sharedir)/extension/timescaledb*
    ```

    </Tab>

    <Tab title="Windows" label="windows">

    ```powershell
    rmdir /s "C:\Program Files\PostgreSQL\<version>\share\extension\timescaledb*"
    ```

    You may need Administrator privileges to delete these files.

    </Tab>

    </Tabs>

1.  **(Optional) Remove the $TIMESCALE_DB source directory**

    If you no longer need the source code:

    <Tabs label="Remove source directory" persistKey="os-source-rm-dir">

    <Tab title="Linux" label="linux">

    ```bash
    cd /path/to/parent/directory
    rm -rf timescaledb
    ```

    </Tab>

    <Tab title="macOS" label="macos">

    ```bash
    cd /path/to/parent/directory
    rm -rf timescaledb
    ```

    </Tab>

    <Tab title="Windows" label="windows">

    ```powershell
    cd \path\to\parent\directory
    rmdir /s timescaledb
    ```

    </Tab>

    </Tabs>

</Procedure>

</Tab>

<Tab title="Windows" label="windows">

If you installed $TIMESCALE_DB on Windows using a package manager, you can uninstall it without removing $PG.

<Procedure>

1.  **Drop the $TIMESCALE_DB extension from your databases**

    1. Open Command Prompt or PowerShell and connect to each database where $TIMESCALE_DB is enabled:

       ```bash
       psql -U postgres -d <database_name>
       ```

    1. At the `psql` prompt, remove the extension:

       ```sql
       DROP EXTENSION timescaledb CASCADE;
       ```

    Repeat this for all databases with $TIMESCALE_DB enabled. To exit psql, type `\q`.

    <Highlight type="warning">

    Using `CASCADE` will drop all $TIMESCALE_DB-specific objects including hypertables, continuous aggregates, and retention policies. Ensure you have backed up any data you want to keep.

    </Highlight>

1.  **Remove $TIMESCALE_DB from `shared_preload_libraries`**

    1. Open your $PG configuration file. The default location is:

       ```
       C:\Program Files\PostgreSQL\<version>\data\postgresql.conf
       ```

       You may need to run the editor as Administrator.

    1. Find the line with `shared_preload_libraries` and remove `timescaledb` from the list. For example, change:

       ```
       shared_preload_libraries = 'timescaledb'
       ```

       to:

       ```
       shared_preload_libraries = ''
       ```

       If there are other extensions in the list, keep them and only remove `timescaledb`.

    1. Save the file.

1.  **Restart $PG**

    ```powershell
    Restart-Service postgresql-x64-18
    ```

    Replace `18` with your $PG version if different.

1.  **Remove $TIMESCALE_DB binaries**

    Manually remove the $TIMESCALE_DB files from your $PG installation directory.

    1. Remove $TIMESCALE_DB library files. You may need to run PowerShell as Administrator:

       ```powershell
       Remove-Item "C:\Program Files\PostgreSQL\18\lib\timescaledb*.dll"
       ```

       Replace `18` with your $PG version if different.

    1. Remove $TIMESCALE_DB extension files:

       ```powershell
       Remove-Item -Recurse "C:\Program Files\PostgreSQL\18\share\extension\timescaledb*"
       ```

       Replace `18` with your $PG version if different.

    <Highlight type="note">

    If you encounter permission errors, ensure you're running PowerShell as Administrator.

    </Highlight>

</Procedure>

</Tab>

</Tabs>