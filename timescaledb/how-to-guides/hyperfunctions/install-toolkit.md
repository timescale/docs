# Install TimescaleDB Toolkit
Some hyperfunctions are included in the default TimescaleDB product. For
additional hyperfunctions, you need to install the TimescaleDB Toolkit PostgreSQL
extension.

If you're using [Timescale Cloud][cloud], the Toolkit is already installed.

## Install Toolkit on Managed Service for TimescaleDB
On [Managed Service for TimescaleDB][mst], run this command on each database you
want to use the Toolkit with:
```sql
CREATE EXTENSION timescaledb_toolkit;
```

You can update an installed version of the Toolkit using this command:
```sql
ALTER EXTENSION timescaledb_toolkit UPDATE;
```

## Install Toolkit on self-hosted TimescaleDB
If you're hosting your own TimescaleDB database, you can install Toolkit by:
*   Using the TimescaleDB high-availability Docker image
*   Using the RPM, Debian, or Ubuntu package
*   Building from source

### Install Docker image

The recommended way to install the Toolkit is to use the
[TimescaleDB Docker image](https://github.com/timescale/timescaledb-docker-ha).
To get Toolkit, use the high availability image, `timescaledb-ha`:
```bash
docker pull timescale/timescaledb-ha:pg14-latest
```

<highlight type="important">
The `timescaledb-ha` image does not support ARM64. For ARM64 environments, use the
`timescaledb` Docker image. By default, this image does not contain Toolkit. You can add
Toolkit using the package installation method, or by building from source.
</highlight>

For more information on running TimescaleDB using Docker, see the section on
[pre-built containers][docker-install].

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

### Build Toolkit from source
You can build Toolkit from source. For more information, see the [Toolkit
developer documentation][toolkit-gh-docs] .

[cloud]: /cloud/:currentVersion:/
[debian-install]: /install/:currentVersion:/self-hosted/installation-debian/
[docker-install]: /install/:currentVersion:/installation-docker/
[mst]: /mst/:currentVersion:/
[red-hat-install]: /install/:currentVersion:/self-hosted/installation-redhat/
[rust-install]: https://www.rust-lang.org/tools/install
[toolkit-gh-docs]: https://github.com/timescale/timescaledb-toolkit#-installing-from-source
