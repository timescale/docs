---
title: Install and update TimescaleDB Toolkit
excerpt: How to install TimescaleDB Toolkit to access more hyperfunctions and function pipelines
products: [mst, self_hosted]
keywords: [Toolkit, installation, hyperfunctions, function pipelines]
---

# Install and update TimescaleDB Toolkit

Some hyperfunctions are included by default in Timescale. For additional
hyperfunctions, you need to install the TimescaleDB Toolkit PostgreSQL
extension.

If you're using [Timescale][cloud], the Toolkit is already installed.

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

If you're hosting your own TimescaleDB database, you can install Toolkit by:

*   Using the TimescaleDB high-availability Docker image
*   Using a package manager such as `yum`, `apt`, or `brew` on platforms where
    pre-built binaries are available
*   Building from source

### Install Docker image

The recommended way to install the Toolkit is to use the
[TimescaleDB Docker image](https://github.com/timescale/timescaledb-docker-ha).
To get Toolkit, use the high availability image, `timescaledb-ha`:

```bash
docker pull timescale/timescaledb-ha:pg16
```

<Highlight type="important">
The `timescaledb-ha` image does not support ARM64. For ARM64 environments, use the
`timescaledb` Docker image. By default, this image does not contain Toolkit. You can add
Toolkit using the package installation method, or by building from source.
</Highlight>

For more information on running TimescaleDB using Docker, see the section on
[pre-built containers][docker-install].

### Install Toolkit on CentOS 7 and other Red Hat-based systems

These instructions use the `yum` package manager. They have been tested on
CentOS 7 and may also work on other Red Hat-based systems, such as Red Hat
Enterprise Linux and Fedora.

<Procedure>

#### Installing Toolkit on CentOS 7

1.  Make sure you have installed TimescaleDB and created a TimescaleDB
    repository in your `yum` `repo.d` directory. For more information, see [the
    instructions for Red Hat-based systems][red-hat-install].
1.  Update your local repository list:

    ```bash
    yum update
    ```

1.  Install TimescaleDB Toolkit:

    ```bash
    yum install timescaledb-toolkit-postgresql-14
    ```

1.  Connect to the database where you want to use Toolkit.
1.  Create the Toolkit extension in the database:

    ```sql
    CREATE EXTENSION timescaledb_toolkit;
    ```

</Procedure>

### Install Toolkit on Ubuntu and other Debian-based systems

These instructions use the `apt` package manager. They have been tested on Ubuntu 20.04
and may also work on other Debian-based systems.

<Procedure>

#### Installing Toolkit on Ubuntu 20.04

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

</Procedure>

### Install Toolkit on macOS

These instructions use the `brew` package manager. For more information on
installing or using Homebrew, see [the `brew` homepage][brew-install].

<Procedure>

#### Installing Toolkit on macOS

1.  Tap the Timescale formula repository, which also contains formulae for
    TimescaleDB and `timescaledb-tune`.

    ```bash
    brew tap timescale/tap
    ```

1.  Update your local brew installation:

    ```bash
    brew update
    ```

1.  Install TimescaleDB Toolkit:

    ```bash
    brew install timescaledb-toolkit
    ```

1.  Connect to the database where you want to use Toolkit.
1.  Create the Toolkit extension in the database:

    ```sql
    CREATE EXTENSION timescaledb_toolkit;
    ```

</Procedure>

### Install Toolkit on Windows

TimescaleDB Toolkit isn't currently supported on Windows. As a workaround, you
can run PostgreSQL in a Docker container.

## Update Toolkit on self-hosted TimescaleDB

Update Toolkit by installing the latest version and running `ALTER EXTENSION`.

<Procedure>

### Updating Toolkit on self-hosted TimescaleDB

1.  Update your local repository list:

    <Terminal>

    <tab label='CentOS 7'>

    ```bash
    yum update
    ```

    </tab>

    <tab label='Debian'>

    ```bash
    apt update
    ```

    </tab>

    <tab label='macOS'>

    ```bash
    brew update
    ```

    </tab>

    </Terminal>

1.  Install the latest version of TimescaleDB Toolkit:

    <Terminal>

    <tab label='CentOS 7'>

    ```bash
    yum install timescaledb-toolkit-postgresql-14
    ```

    </tab>

    <tab label='Debian'>

    ```bash
    apt install timescaledb-toolkit-postgresql-14
    ```

    </tab>

    <tab label='macOS'>

    ```bash
    brew upgrade timescaledb-toolkit
    ```

    </tab>

    </Terminal>

1.  Connect to the database where you want to use the new version of Toolkit.
1.  Update the Toolkit extension in the database:

    ```sql
    ALTER EXTENSION timescaledb_toolkit UPDATE;
    ```

<Highlight type="note">
For some Toolkit versions, you might need to disconnect and reconnect active
sessions.
</Highlight>

</Procedure>

### Build Toolkit from source

You can build Toolkit from source. For more information, see the [Toolkit
developer documentation][toolkit-gh-docs].

[brew-install]: https://brew.sh
[cloud]: /use-timescale/:currentVersion:/services/
[debian-install]: /self-hosted/latest/install/installation-linux/
[docker-install]: /self-hosted/latest/install/installation-docker/
[mst]: /mst/:currentVersion:/
[red-hat-install]: /self-hosted/latest/install/installation-linux/
[toolkit-gh-docs]: https://github.com/timescale/timescaledb-toolkit#-installing-from-source
