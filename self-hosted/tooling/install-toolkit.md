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

## Install TimescaleDB Toolkit on self-hosted TimescaleDB

If you're hosting the $TIMESCALE_DB extension on your self-hosted database, you can install $TOOLKIT_SHORT by:

*   Using the TimescaleDB high-availability Docker image
*   Using a package manager such as `yum`, `apt`, or `brew` on platforms where
    pre-built binaries are available
*   Building from source. For more information, see the [$TOOLKIT_SHORT developer documentation][toolkit-gh-docs]

<Tabs label="Install TimescaleDB Toolkit" persistKey="os">

<Tab title="Docker" label="docker">

Best practice for $TOOLKIT_SHORT installation is to use the
[TimescaleDB Docker image](https://github.com/timescale/timescaledb-docker-ha).
To get $TOOLKIT_SHORT, use the high availability image, `timescaledb-ha`:

```bash
docker pull timescale/timescaledb-ha:pg17
```

For more information on running $TIMESCALE_DB using Docker, see 
[Install TimescaleDB from a Docker container][docker-install].
    
</Tab>

<Tab title="Red Hat-based" label="redhat">

<Procedure>

1.  Make sure you have installed $TIMESCALE_DB and created a $TIMESCALE_DB
    repository in your `yum` `repo.d` directory. For more information, see [the
    instructions for Red Hat-based systems][red-hat-install].
1.  Update your local repository list:

    ```bash
    yum update
    ```

1.  Install $TOOLKIT_LONG:

    ```bash
    yum install timescaledb-toolkit-postgresql-17
    ```

1.  [Connect to the database][connect] where you want to use $TOOLKIT_SHORT.
1.  Create the $TOOLKIT_SHORT extension in the database:

    ```sql
    CREATE EXTENSION timescaledb_toolkit;
    ```

</Procedure>
    
</Tab>

<Tab title="Debian-based" label="ubuntu">

These instructions use the `apt` package manager. They have been tested on Ubuntu 20.04
and may also work on other Debian-based systems.

<Procedure>

1.  Make sure you have installed TimescaleDB and added the TimescaleDB
    repository and GPG key. For more information, see [the instructions for
    Debian-based systems][debian-install].
1.  Update your local repository list:

    ```bash
    apt update
    ```

1.  Install TimescaleDB Toolkit:

    ```bash
    apt install timescaledb-toolkit-postgresql-17
    ```

1.  [Connect to the database][connect] where you want to use $TOOLKIT_SHORT.
1.  Create the $TOOLKIT_SHORT extension in the database:

    ```sql
    CREATE EXTENSION timescaledb_toolkit;
    ```

</Procedure>
    
</Tab>

<Tab title="macOS" label="macos">

These instructions use the `brew` package manager. For more information on
installing or using Homebrew, see [the `brew` homepage][brew-install].

<Procedure>

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

1.  [Connect to the database][connect] where you want to use $TOOLKIT_SHORT.
1.  Create the $TOOLKIT_SHORT extension in the database:

    ```sql
    CREATE EXTENSION timescaledb_toolkit;
    ```

</Procedure>
    
</Tab>

</Tabs>

## Update Toolkit on self-hosted TimescaleDB

Update $TOOLKIT_SHORT by installing the latest version and running `ALTER EXTENSION`.

<Tabs label="Update TimescaleDB Toolkit" persistKey="os">

<Tab title="Docker" label="docker">

To get the latest version of $TOOLKIT_SHORT, [update][update-docker] the $TIMESCALE_DB HA docker image. 

</Tab>

<Tab title="Red Hat-based" label="redhat">

<Procedure>

1.  Update your local repository list:

    ```bash
    yum update
    ```

1. Install the latest version of $TOOLKIT_LONG:

    ```bash
    yum install timescaledb-toolkit-postgresql-17
    ```

1.  [Connect to the database][connect] where you want to use the new version of $TOOLKIT_SHORT.
1.  Update the $TOOLKIT_SHORT extension in the database:

    ```sql
    ALTER EXTENSION timescaledb_toolkit UPDATE;
    ```

    <Highlight type="note">
    
    For some $TOOLKIT_SHORT versions, you might need to disconnect and reconnect active
    sessions.
    
    </Highlight>

</Procedure>
    
</Tab>

<Tab title="Debian-based" label="ubuntu">

<Procedure>

1.  Update your local repository list:

    ```bash
    apt update
    ```

1. Install the latest version of $TOOLKIT_LONG:

    ```bash
    apt install timescaledb-toolkit-postgresql-17
    ```

1.  [Connect to the database][connect] where you want to use the new version of $TOOLKIT_SHORT.
1.  Update the $TOOLKIT_SHORT extension in the database:

    ```sql
    ALTER EXTENSION timescaledb_toolkit UPDATE;
    ```

    <Highlight type="note">
    
    For some $TOOLKIT_SHORT versions, you might need to disconnect and reconnect active
    sessions.
    
    </Highlight>

</Procedure>
    
</Tab>

<Tab title="macOS" label="macos">

<Procedure>

1.  Update your local repository list:

    ```bash
    brew update
    ```

1. Install the latest version of $TOOLKIT_LONG:

    ```bash
    brew upgrade timescaledb-toolkit
    ```

1.  [Connect to the database][connect] where you want to use the new version of $TOOLKIT_SHORT.
1.  Update the $TOOLKIT_SHORT extension in the database:

    ```sql
    ALTER EXTENSION timescaledb_toolkit UPDATE;
    ```

    <Highlight type="note">

    For some $TOOLKIT_SHORT versions, you might need to disconnect and reconnect active
    sessions.

    </Highlight>

</Procedure>

</Tab>

</Tabs>

[brew-install]: https://brew.sh
[cloud]: /use-timescale/:currentVersion:/services/
[debian-install]: /self-hosted/:currentVersion:/install/installation-linux/
[docker-install]: /self-hosted/:currentVersion:/install/installation-docker/
[mst]: /mst/:currentVersion:/
[red-hat-install]: /self-hosted/:currentVersion:/install/installation-linux/
[toolkit-gh-docs]: https://github.com/timescale/timescaledb-toolkit#-installing-from-source
[connect]: /integrations/:currentVersion:/find-connection-details/
[update-docker]: /self-hosted/:currentVersion:/upgrades/upgrade-docker/