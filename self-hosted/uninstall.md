---
title: Uninstall TimescaleDB
excerpt: Uninstall TimescaleDB without uninstalling PostgreSQL
products: [self_hosted]
keywords: [uninstall]
---

# Uninstall TimescaleDB

If you want to uninstall TimescaleDB, you can do so without having to uninstall PostgreSQL. Choose your platform or installation method below to see the appropriate uninstallation instructions.

<Tabs label="Choose your platform or installation method" persistKey="uninstall-method">

<Tab title="Docker" label="docker">

If you installed TimescaleDB using Docker, you can completely remove the TimescaleDB container, image, and optionally the data volumes.

<Procedure>

1.  **Stop the running container**

    ```bash
    docker stop timescaledb
    ```

    If you named your container differently when you created it, replace `timescaledb` with your container name. You can list all running containers with:

    ```bash
    docker ps
    ```

1.  **Remove the container**

    ```bash
    docker rm timescaledb
    ```

    This removes the container but preserves the data volume and the Docker image.

1.  **List and remove the Docker image**

    To see which TimescaleDB images you have installed:

    ```bash
    docker images | grep timescale
    ```

    Remove the specific TimescaleDB image:

    ```bash
    # For TimescaleDB-HA
    docker rmi timescale/timescaledb-ha:pg17

    # For TimescaleDB light
    docker rmi timescale/timescaledb:latest-pg17
    ```

    Replace `pg17` with your PostgreSQL version if different.

1.  **(Optional) Remove the data volume**

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

1.  **Verify removal**

    Confirm that the container, image, and volumes have been removed:

    ```bash
    # Check for containers
    docker ps -a | grep timescaledb

    # Check for images
    docker images | grep timescale

    # Check for volumes
    docker volume ls
    ```

</Procedure>

### Remove all unused Docker resources

If you want to clean up all unused Docker resources (not just TimescaleDB), you can use:

```bash
# Remove all stopped containers
docker container prune

# Remove all unused images
docker image prune -a

# Remove all unused volumes
docker volume prune

# Remove all unused resources (containers, images, volumes, networks)
docker system prune -a --volumes
```

<Highlight type="warning">

These commands will remove all unused Docker resources, not just TimescaleDB. Use with caution if you have other Docker containers or images you want to keep.

</Highlight>

</Tab>

<Tab title="Kubernetes" label="kubernetes">

If you deployed TimescaleDB on Kubernetes, you can completely remove all associated resources including the StatefulSet, Service, PersistentVolumeClaim, Secret, and application deployments.

<Procedure>

1.  **Back up your data (optional but recommended)**

    Before uninstalling, back up any important data from your TimescaleDB instance:

    ```shell
    kubectl exec -it timescaledb-0 -- pg_dump -U postgres postgres > backup.sql
    ```

    <Highlight type="warning">

    Deleting the PersistentVolumeClaim will permanently delete all your database data. Ensure you have backed up any data you need before proceeding.

    </Highlight>

1.  **Delete the test pod (if it exists)**

    If you created a test pod during installation:

    ```shell
    kubectl delete pod test-pod
    ```

1.  **Delete the application deployment**

    Remove any application deployments that connect to TimescaleDB:

    ```shell
    kubectl delete deployment timescale-app
    ```

1.  **Delete the TimescaleDB service**

    Remove the service that exposes TimescaleDB within the cluster:

    ```shell
    kubectl delete service timescaledb
    ```

1.  **Delete the TimescaleDB StatefulSet**

    Remove the StatefulSet managing the TimescaleDB pods:

    ```shell
    kubectl delete statefulset timescaledb
    ```

    This will terminate the TimescaleDB pod(s).

1.  **Delete the PersistentVolumeClaim**

    <Highlight type="warning">

    This step permanently deletes all database data stored in the persistent volume.

    </Highlight>

    ```shell
    kubectl delete pvc timescale-pvc
    ```

1.  **Delete the secret**

    Remove the Kubernetes secret containing database credentials:

    ```shell
    kubectl delete secret timescale-secret
    ```

1.  **(Optional) Delete the namespace**

    If you created a dedicated namespace for TimescaleDB and want to remove it:

    ```shell
    kubectl delete namespace timescale
    ```

    <Highlight type="note">

    Only delete the namespace if you're certain no other resources are using it. This will delete all resources in the namespace.

    </Highlight>

1.  **Verify removal**

    Confirm that all TimescaleDB resources have been deleted:

    ```shell
    # Check for StatefulSets
    kubectl get statefulsets

    # Check for Services
    kubectl get services

    # Check for PVCs
    kubectl get pvc

    # Check for Secrets
    kubectl get secrets

    # Check for Pods
    kubectl get pods
    ```

    TimescaleDB-related resources should not appear in these lists.

</Procedure>

### Uninstalling TimescaleDB installed with Kubernetes operators

If you installed TimescaleDB using a Kubernetes operator (StackGres, Patroni, PGO, or CloudNativePG), follow the operator-specific uninstallation instructions:

**StackGres**

```shell
kubectl delete sgcluster <cluster-name>
kubectl delete sgpgconfig <config-name>
```

For complete uninstallation:

```shell
helm uninstall stackgres-operator --namespace stackgres
kubectl delete namespace stackgres
```

**PostgreSQL Operator (Patroni/Zalando)**

```shell
kubectl delete postgresql <cluster-name>
```

To uninstall the operator:

```shell
kubectl delete -f https://raw.githubusercontent.com/zalando/postgres-operator/master/manifests/postgresql-operator.yaml
```

**PGO (Crunchy Data)**

```shell
kubectl delete postgrescluster <cluster-name>
```

To uninstall the operator:

```shell
kubectl delete -f https://raw.githubusercontent.com/CrunchyData/postgres-operator/master/installers/kubectl/postgres-operator.yml
```

**CloudNativePG**

```shell
kubectl delete cluster <cluster-name>
```

To uninstall the operator:

```shell
kubectl delete -f https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/release-1.23/releases/cnpg-1.23.0.yaml
```

### Clean up persistent volumes

After deleting the PersistentVolumeClaim, you may also want to delete the associated PersistentVolume if it was manually provisioned:

```shell
# List persistent volumes
kubectl get pv

# Delete a specific persistent volume
kubectl delete pv <pv-name>
```

<Highlight type="note">

If you're using dynamic provisioning with a storage class, the PersistentVolume should be automatically deleted when you delete the PersistentVolumeClaim, depending on your reclaim policy.

</Highlight>

</Tab>

<Tab title="Linux" label="linux">

Take the following steps based on your distribution:

<Tabs label="Choose your Linux distribution" persistKey="linux-distro">

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
    sudo apt update
    ```

1.  **(Optional) Remove dependencies**

    To also remove unused dependencies:

    ```bash
    sudo apt autoremove
    ```

1.  **Verify removal**

    Connect to PostgreSQL and verify the extension is no longer available:

    ```bash
    psql -U postgres -d <database_name>
    ```

    Try to create the extension:

    ```sql
    CREATE EXTENSION timescaledb;
    ```

    You should see an error indicating the extension is not found.

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
    sudo apt update
    ```

1.  **(Optional) Remove dependencies**

    To also remove unused dependencies:

    ```bash
    sudo apt autoremove
    ```

1.  **Verify removal**

    Connect to PostgreSQL and verify the extension is no longer available:

    ```bash
    psql -U postgres -d <database_name>
    ```

    Try to create the extension:

    ```sql
    CREATE EXTENSION timescaledb;
    ```

    You should see an error indicating the extension is not found.

</Procedure>

</Tab>

<Tab title="RHEL" label="rhel">

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
    sudo nano /var/lib/pgsql/17/data/postgresql.conf
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
    sudo dnf remove timescaledb_17
    ```

    Replace `17` with your PostgreSQL version if different.

1.  **Remove the TimescaleDB repository configuration**

    ```bash
    sudo rm /etc/yum.repos.d/timescaledb.repo
    ```

1.  **(Optional) Remove dependencies**

    To also remove unused dependencies:

    ```bash
    sudo dnf autoremove
    ```

1.  **Verify removal**

    Connect to PostgreSQL and verify the extension is no longer available:

    ```bash
    psql -U postgres -d <database_name>
    ```

    Try to create the extension:

    ```sql
    CREATE EXTENSION timescaledb;
    ```

    You should see an error indicating the extension is not found.

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
    sudo nano /var/lib/pgsql/17/data/postgresql.conf
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
    sudo dnf remove timescaledb_17
    ```

    Replace `17` with your PostgreSQL version if different.

1.  **Remove the TimescaleDB repository configuration**

    ```bash
    sudo rm /etc/yum.repos.d/timescaledb.repo
    ```

1.  **(Optional) Remove dependencies**

    To also remove unused dependencies:

    ```bash
    sudo dnf autoremove
    ```

1.  **Verify removal**

    Connect to PostgreSQL and verify the extension is no longer available:

    ```bash
    psql -U postgres -d <database_name>
    ```

    Try to create the extension:

    ```sql
    CREATE EXTENSION timescaledb;
    ```

    You should see an error indicating the extension is not found.

</Procedure>

</Tab>

<Tab title="Rocky" label="rocky">

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
    sudo nano /var/lib/pgsql/17/data/postgresql.conf
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
    sudo dnf remove timescaledb_17
    ```

    Replace `17` with your PostgreSQL version if different.

1.  **Remove the TimescaleDB repository configuration**

    ```bash
    sudo rm /etc/yum.repos.d/timescaledb.repo
    ```

1.  **(Optional) Remove dependencies**

    To also remove unused dependencies:

    ```bash
    sudo dnf autoremove
    ```

1.  **Verify removal**

    Connect to PostgreSQL and verify the extension is no longer available:

    ```bash
    psql -U postgres -d <database_name>
    ```

    Try to create the extension:

    ```sql
    CREATE EXTENSION timescaledb;
    ```

    You should see an error indicating the extension is not found.

</Procedure>

</Tab>

</Tabs>

</Tab>

<Tab title="macOS" label="macos">

Uninstall $SELF_LONG with Homebrew or MacPorts. 

<Tabs label="Choose your package manager" persistKey="macos-pm">

<Tab title="Homebrew" label="homebrew">

<Procedure>

1.  **Drop the TimescaleDB extension from your databases**

    At the `psql` prompt, remove the TimescaleDB extension:

    ```sql
    DROP EXTENSION timescaledb;
    ```

1.  **Remove TimescaleDB from shared_preload_libraries**

    At the command prompt, remove `timescaledb` from `shared_preload_libraries` in the `postgresql.conf` configuration file:

    ```bash
    nano /opt/homebrew/var/postgresql@14/postgresql.conf
    shared_preload_libraries = ''
    ```

1.  **Save the changes** to the `postgresql.conf` file.

1.  **Restart PostgreSQL**

    ```bash
    brew services restart postgresql
    ```

1.  **Verify the extension is uninstalled**

    Check that the TimescaleDB extension is uninstalled by using the `\dx` command at the `psql` prompt. Output is similar to:

    ```sql
    tsdb-# \dx
                                      List of installed extensions
        Name     | Version |   Schema   |                            Description
    -------------+---------+------------+-------------------------------------------------------------------
     plpgsql     | 1.0     | pg_catalog | PL/pgSQL procedural language
    (1 row)
    ```

1.  **Uninstall TimescaleDB**

    ```bash
    brew uninstall timescaledb
    ```

1.  **Remove all the dependencies and related files**

    ```bash
    brew remove timescaledb
    ```

</Procedure>

</Tab>

<Tab title="MacPorts" label="macports">

<Procedure>

1.  **Drop the TimescaleDB extension from your databases**

    At the `psql` prompt, remove the TimescaleDB extension:

    ```sql
    DROP EXTENSION timescaledb;
    ```

1.  **Remove TimescaleDB from shared_preload_libraries**

    At the command prompt, remove `timescaledb` from `shared_preload_libraries` in the `postgresql.conf` configuration file:

    ```bash
    nano /opt/homebrew/var/postgresql@14/postgresql.conf
    shared_preload_libraries = ''
    ```

1.  **Save the changes** to the `postgresql.conf` file.

1.  **Restart PostgreSQL**

    ```bash
    port reload postgresql
    ```

1.  **Verify the extension is uninstalled**

    Check that the TimescaleDB extension is uninstalled by using the `\dx` command at the `psql` prompt. Output is similar to:

    ```sql
    tsdb-# \dx
                                      List of installed extensions
        Name     | Version |   Schema   |                            Description
    -------------+---------+------------+-------------------------------------------------------------------
     plpgsql     | 1.0     | pg_catalog | PL/pgSQL procedural language
    (1 row)
    ```

1.  **Uninstall TimescaleDB and the related dependencies**

    ```bash
    port uninstall timescaledb --follow-dependencies
    ```

</Procedure>

</Tab>

</Tabs>

</Tab>

<Tab title="Source" label="source">

If you installed TimescaleDB by building from source, you can uninstall it without removing PostgreSQL.

<Procedure>

1.  **Drop the TimescaleDB extension from your databases**

    Connect to each database where TimescaleDB is enabled and remove the extension:

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
    DROP EXTENSION IF EXISTS timescaledb CASCADE;
    ```

    Repeat this for all databases with TimescaleDB enabled. To exit psql, type `\q`.

    <Highlight type="warning">

    Using `CASCADE` will drop all TimescaleDB-specific objects including hypertables, continuous aggregates, and retention policies. Ensure you have backed up any data you want to keep.

    </Highlight>

1.  **Remove TimescaleDB from shared_preload_libraries**

    Locate your PostgreSQL configuration file:

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

    Edit the configuration file (you may need sudo/Administrator privileges):

    <Tabs label="Edit config file" persistKey="os-source-edit-config">

    <Tab title="Linux" label="linux">

    ```bash
    sudo nano /path/to/postgresql.conf
    ```

    </Tab>

    <Tab title="macOS" label="macos">

    ```bash
    sudo nano /path/to/postgresql.conf
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

1.  **Restart PostgreSQL**

    <Tabs label="Restart PostgreSQL" persistKey="os-source-restart">

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

1.  **Remove TimescaleDB binaries**

    Manually remove the TimescaleDB files from your PostgreSQL installation directory.

    Find your PostgreSQL library directory:

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

    Remove TimescaleDB library files:

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

    Find your PostgreSQL extension directory:

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

    Remove TimescaleDB extension files:

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

1.  **(Optional) Remove the TimescaleDB source directory**

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

1.  **Verify removal**

    Connect to PostgreSQL and check that the extension is not available:

    <Tabs label="Connect to verify" persistKey="os-source-verify">

    <Tab title="Linux" label="linux">

    ```bash
    psql -U postgres
    ```

    </Tab>

    <Tab title="macOS" label="macos">

    ```bash
    psql -U postgres
    ```

    </Tab>

    <Tab title="Windows" label="windows">

    ```powershell
    psql -U postgres
    ```

    </Tab>

    </Tabs>

    Try to create the extension:

    ```sql
    CREATE EXTENSION timescaledb;
    ```

    You should see an error indicating the extension is not found. This confirms TimescaleDB has been successfully uninstalled.

</Procedure>

### Additional cleanup for source installations

After uninstalling, you may want to remove any additional TimescaleDB-related files:

**Remove TimescaleDB tools**

If you installed `timescaledb-tune` or other tools from source, remove them:

Linux/macOS:
```bash
# Find where timescaledb-tune is installed
which timescaledb-tune

# Remove it
sudo rm $(which timescaledb-tune)
```

Windows:
```powershell
# Find where timescaledb-tune is installed
where timescaledb-tune

# Remove it
del "path\to\timescaledb-tune.exe"
```

**Clean up environment variables**

If you added TimescaleDB paths to your `PATH` environment variable during installation, remove them:

Linux/macOS:
Edit your shell configuration file (`~/.bashrc`, `~/.bash_profile`, or `~/.zshrc`) and remove any TimescaleDB-related PATH entries.

Windows:
1. Search for "environment variables" in the Windows Search tool
1. Click `Edit the system environment variables`
1. Click `Environment Variables`
1. Under `System variables` or `User variables`, select `Path` and click `Edit`
1. Remove any entries related to TimescaleDB
1. Click `OK` to save

</Tab>

<Tab title="Windows" label="windows">

If you installed TimescaleDB on Windows using a package manager, you can uninstall it without removing PostgreSQL.

<Procedure>

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

1.  **Restart PostgreSQL**

    Open Services (press `Win + R`, type `services.msc`, and press Enter).

    Find the PostgreSQL service, right-click it, and select `Restart`.

    Alternatively, from an Administrator Command Prompt or PowerShell:

    ```powershell
    pg_ctl restart
    ```

1.  **Uninstall TimescaleDB**

    Open Control Panel and navigate to "Programs and Features" or "Add or Remove Programs".

    Find "TimescaleDB" in the list of installed programs, select it, and click "Uninstall".

    Follow the uninstaller prompts to complete the removal.

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