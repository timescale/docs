---
title: Install and update TimescaleDB Toolkit
excerpt: Install the TimescaleDB Toolkit extension to access more hyperfunctions and function pipelines
products: [self_hosted]
keywords: [Toolkit, installation, hyperfunctions, function pipelines]
---

# Install and update $TIMESCALE_DB Toolkit

Some hyperfunctions are included by default in $TIMESCALE_DB. For additional
hyperfunctions, you need to install the $TOOLKIT_LONG $PG
extension.

If you're using [$CLOUD_LONG][cloud], the $TOOLKIT_LONG is already installed.

## Install and update TimescaleDB Toolkit on Managed Service for TimescaleDB

On [$MST_LONG][mst], run this command on each database you
want to use the $TOOLKIT_SHORT with:

```sql
CREATE EXTENSION timescaledb_toolkit;
```

Update an installed version of the $TOOLKIT_SHORT using this command:

```sql
ALTER EXTENSION timescaledb_toolkit UPDATE;
```

## Install TimescaleDB Toolkit on self-hosted TimescaleDB

If you're hosting the $TIMESCALE_DB extension on your self-hosted database, you can install $TOOLKIT_SHORT by:

*   Using the TimescaleDB high-availability Docker image
*   Using a package manager such as `yum`, `apt`, or `brew` on platforms where
    pre-built binaries are available
*   Building from source

### Install Docker image

The recommended way to install the $TOOLKIT_SHORT is to use the
[TimescaleDB Docker image](https://github.com/timescale/timescaledb-docker-ha).
To get $TOOLKIT_SHORT, use the high availability image, `timescaledb-ha`:

```bash
docker pull timescale/timescaledb-ha:pg17
```

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

1.  Install $TOOLKIT_LONG:

    ```bash
    yum install timescaledb-toolkit-postgresql-16
    ```

1.  Connect to the database where you want to use $TOOLKIT_SHORT.
1.  Create the $TOOLKIT_SHORT extension in the database:

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
    apt install timescaledb-toolkit-postgresql-16
    ```

1.  Connect to the database where you want to use $TOOLKIT_SHORT.
1.  Create the $TOOLKIT_SHORT extension in the database:

    ```sql
    CREATE EXTENSION timescaledb_toolkit;
    ```

</Procedure>

### Install Toolkit on macOS

These instructions use the `brew` package manager. For more information on
installing or using Homebrew, see [the `brew` homepage][brew-install].

<Procedure>

#### Installing Toolkit on macOS

1.  Tap the $COMPANY formula repository, which also contains formulae for
    $TIMESCALE_DB and `timescaledb-tune`.

    ```bash
    brew tap timescale/tap
    ```

1.  Update your local brew installation:

    ```bash
    brew update
    ```

1.  Install $TOOLKIT_LONG:

    ```bash
    brew install timescaledb-toolkit
    ```

1.  Connect to the database where you want to use $TOOLKIT_SHORT.
1.  Create the $TOOLKIT_SHORT extension in the database:

    ```sql
    CREATE EXTENSION timescaledb_toolkit;
    ```

</Procedure>

### Install Toolkit on Windows

$TOOLKIT_LONG isn't currently supported on Windows. As a workaround, you
can run $PG in a Docker container.

## Update Toolkit on self-hosted TimescaleDB

Update $TOOLKIT_SHORT by installing the latest version and running `ALTER EXTENSION`.

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

1.  Install the latest version of $TOOLKIT_LONG:

    <Terminal>

    <tab label='CentOS 7'>

    ```bash
    yum install timescaledb-toolkit-postgresql-16
    ```

    </tab>

    <tab label='Debian'>

    ```bash
    apt install timescaledb-toolkit-postgresql-16
    ```

    </tab>

    <tab label='macOS'>

    ```bash
    brew upgrade timescaledb-toolkit
    ```

    </tab>

    </Terminal>

1.  Connect to the database where you want to use the new version of $TOOLKIT_SHORT.
1.  Update the $TOOLKIT_SHORT extension in the database:

    ```sql
    ALTER EXTENSION timescaledb_toolkit UPDATE;
    ```

<Highlight type="note">

For some $TOOLKIT_SHORT versions, you might need to disconnect and reconnect active
sessions.

</Highlight>

</Procedure>

### Build Toolkit from source

You can build $TOOLKIT_SHORT from source. For more information, see the [$TOOLKIT_SHORT
developer documentation][toolkit-gh-docs].

[brew-install]: https://brew.sh
[cloud]: /use-timescale/:currentVersion:/services/
[debian-install]: /self-hosted/:currentVersion:/install/installation-linux/
[docker-install]: /self-hosted/:currentVersion:/install/installation-docker/
[mst]: /mst/:currentVersion:/
[red-hat-install]: /self-hosted/:currentVersion:/install/installation-linux/
[toolkit-gh-docs]: https://github.com/timescale/timescaledb-toolkit#-installing-from-source
