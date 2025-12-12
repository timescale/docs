---
title: Install and update TimescaleDB Toolkit
excerpt: Install the TimescaleDB Toolkit extension to access more hyperfunctions and function pipelines
products: [self_hosted]
keywords: [Toolkit, installation, hyperfunctions, function pipelines]
---

import ToolkitDebianBase from "versionContent/_partials/_toolkit-install-update-debian-base.mdx";
import ToolkitRedhatBase from "versionContent/_partials/_toolkit-install-update-redhat-base.mdx";

# Install and update $TIMESCALE_DB Toolkit

Some hyperfunctions are included by default in $TIMESCALE_DB. For additional
hyperfunctions, you need to install the $TOOLKIT_LONG $PG
extension.

If you're using [$CLOUD_LONG][cloud], the $TOOLKIT_LONG is already installed. If you're hosting the $TIMESCALE_DB extension on your self-hosted database, you can install $TOOLKIT_SHORT by:

*   Using the $TIMESCALE_DB high-availability Docker image
*   Using a package manager such as `yum`, `apt`, or `brew` on platforms where
    pre-built binaries are available
*   Building from source. For more information, see the [$TOOLKIT_SHORT developer documentation][toolkit-gh-docs]

<Tabs label="Install and update TimescaleDB Toolkit" persistKey="os">

<Tab title="Debian" label="debian">

<ToolkitDebianBase />

</Tab>

<Tab title="Ubuntu" label="ubuntu">

<ToolkitDebianBase />

</Tab>

<Tab title="Red Hat" label="redhat">

<ToolkitRedhatBase />

</Tab>

<Tab title="Fedora" label="fedora">

<ToolkitRedhatBase />

</Tab>

<Tab title="Docker" label="docker">

## Install $TOOLKIT_LONG

Best practice for $TOOLKIT_SHORT installation is to use the
[TimescaleDB Docker image](https://github.com/timescale/timescaledb-docker-ha).
To get $TOOLKIT_SHORT, use the high availability image, `timescaledb-ha`:

```bash
docker pull timescale/timescaledb-ha:pg17
```

For more information on running $TIMESCALE_DB using Docker, see
[Install TimescaleDB from a Docker container][docker-install].

## Update $TOOLKIT_LONG

To get the latest version of $TOOLKIT_SHORT, [update][update-docker] the $TIMESCALE_DB HA docker image.

</Tab>

<Tab title="macOS" label="macos">

## Prerequisites

To follow this procedure:

- [Install $TIMESCALE_DB][macos-install].

## Install $TOOLKIT_LONG

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

1.  [Connect to the database][connection-info] where you want to use $TOOLKIT_SHORT.
1.  Create the $TOOLKIT_SHORT extension in the database:

    ```sql
    CREATE EXTENSION timescaledb_toolkit;
    ```

</Procedure>

## Update $TOOLKIT_LONG

Update $TOOLKIT_SHORT by installing the latest version and running `ALTER EXTENSION`.

<Procedure>

1.  Update your local repository list:

    ```bash
    brew update
    ```

1. Install the latest version of $TOOLKIT_LONG:

    ```bash
    brew upgrade timescaledb-toolkit
    ```

1.  [Connect to the database][connection-info] where you want to use the new version of $TOOLKIT_SHORT.
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
[docker-install]: /self-hosted/:currentVersion:/install/installation-docker/
[toolkit-gh-docs]: https://github.com/timescale/timescaledb-toolkit#-installing-from-source
[connection-info]: /integrations/:currentVersion:/find-connection-details/
[update-docker]: /self-hosted/:currentVersion:/upgrades/upgrade-docker/
[macos-install]: /self-hosted/:currentVersion:/install/installation-macos/
