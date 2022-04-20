# Install and update TimescaleDB Toolkit
Some hyperfunctions are included in the default TimescaleDB product. For
additional hyperfunctions, you need to install the TimescaleDB Toolkit PostgreSQL
extension.

If you're using [Timescale Cloud][cloud], the Toolkit is already installed.

## Install and update Toolkit on Managed Service for TimescaleDB
On [Managed Service for TimescaleDB][mst], run this command on each database you
want to use the Toolkit with:
```sql
CREATE EXTENSION timescaledb_toolkit;
```

Update an installed version of the Toolkit using this command:
```sql
ALTER EXTENSION timescaledb_toolkit UPDATE;
```

## Install Toolkit on self-hosted TimescaleDB
If you're hosting your own TimescaleDB database, you can install Toolkit as an
RPM, Debian, or Ubuntu package. You can also build Toolkit from source.

### Install Toolkit on Red Hat-based systems

These instructions use the `dnf` package manager on RHEL, CentOS, and Fedora.

<procedure>

#### Installing Toolkit on Red Hat-based systems

1.  Make sure you have installed TimescaleDB and created a TimescaleDB
    repository in your `yum` `repo.d` directory. For more information, see [the
    instructions for Red Hat-based systems][red-hat-install].
1.  Update your local repository list:
    ```bash
    dnf update
    ```
1.  Install TimescaleDB Toolkit:
    ```bash
    dnf install timescaledb-toolkit-postgresql-14
    ```
1.  Connect to the database where you want to use Toolkit.
1.  Create the Toolkit extension in the database:
    ```sql
    CREATE EXTENSION timescaledb_toolkit;
    ```

</procedure>

### Install Toolkit on Debian-based systems

These instructions use the `apt` package manager on Debian and Ubuntu.

<procedure>

#### Installing Toolkit on Debian-based systems

1.  Make sure you have installed TimescaleDB and added the TimescaleDB
    repository and GPG key. For more information, see [the instructions for
    Debian-based systems][debian-install].
1.  Update your local repository list:
    ```bash
    apt update
    ```
1.  Install TimescaleDB Toolkit:
    ```bash
    apt install timescaledb-toolkit-postgresql-14
    ```
1.  Connect to the database where you want to use Toolkit.
1.  Create the Toolkit extension in the database:
    ```sql
    CREATE EXTENSION timescaledb_toolkit;
    ```

</procedure>

## Update Toolkit on self-hosted TimescaleDB

Update Toolkit by installing the latest version and running `ALTER EXTENSION`.

<procedure>

### Updating Toolkit on self-hosted TimescaleDB

1.  Update your local repository list:

    <terminal>

    <tab label='Red Hat'>

    ```bash
    dnf update
    ```

    </tab>

    <tab label='Debian'>

    ```bash
    apt update
    ```

    </tab>

    </terminal>

1.  Install the latest version of TimescaleDB Toolkit:

    <terminal>

    <tab label='Red Hat'>

    ```bash
    dnf install timescaledb-toolkit-postgresql-14
    ```

    </tab>

    <tab label='Debian'>

    ```bash
    apt install timescaledb-toolkit-postgresql-14
    ```

    </tab>

    </terminal>
    
1.  Connect to the database where you want to use the new version of Toolkit.
1.  Update the Toolkit extension in the database:
    ```sql
    ALTER EXTENSION timescaledb_toolkit UPDATE;
    ```

<highlight type="note">
For some Toolkit versions, you might need to disconnect and reconnect active
sessions.
</highlight>

</procedure>

### Build Toolkit from source
You can build Toolkit from source. For more information, see the [Toolkit
developer documentation][toolkit-gh-docs] .

[cloud]: /cloud/:currentVersion:/
[debian-install]: /install/:currentVersion:/self-hosted/installation-debian/
[mst]: /mst/:currentVersion:/
[red-hat-install]: /install/:currentVersion:/self-hosted/installation-redhat/
[rust-install]: https://www.rust-lang.org/tools/install
[toolkit-gh-docs]: https://github.com/timescale/timescaledb-toolkit#-installing-from-source
