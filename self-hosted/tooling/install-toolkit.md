---
title: Install, update, and uninstall TimescaleDB Toolkit
excerpt: Install, update, and uninstall the TimescaleDB Toolkit extension to access more hyperfunctions and function pipelines
products: [self_hosted]
keywords: [Toolkit, installation, uninstallation, hyperfunctions, function pipelines]
---

import ToolkitDebianBase from "versionContent/_partials/_toolkit-install-update-debian-base.mdx";
import ToolkitRedhatBase from "versionContent/_partials/_toolkit-install-update-redhat-base.mdx";
import ToolkitRockyBase from "versionContent/_partials/_toolkit-install-update-rocky-base.mdx";
import ToolkitKubernetesBase from "versionContent/_partials/_toolkit-install-update-kubernetes-base.mdx";
import ToolkitSourceBase from "versionContent/_partials/_toolkit-install-update-source-base.mdx";
import ToolkitDebianUninstall from "versionContent/_partials/_toolkit-uninstall-debian-base.mdx";
import ToolkitRedhatUninstall from "versionContent/_partials/_toolkit-uninstall-redhat-base.mdx";
import ToolkitRockyUninstall from "versionContent/_partials/_toolkit-uninstall-rocky-base.mdx";
import ToolkitKubernetesUninstall from "versionContent/_partials/_toolkit-uninstall-kubernetes-base.mdx";
import ToolkitSourceUninstall from "versionContent/_partials/_toolkit-uninstall-source-base.mdx";

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

<Tab title="Docker" label="docker">

## Install $TOOLKIT_LONG

Best practice for $TOOLKIT_SHORT installation is to use the
[TimescaleDB Docker image](https://github.com/timescale/timescaledb-docker-ha).
To get $TOOLKIT_SHORT, use the high availability image, `timescaledb-ha`:

```bash
docker pull timescale/timescaledb-ha:pg17
```

The $TOOLKIT_SHORT extension is pre-installed and pre-enabled in the `timescaledb-ha` image. Once you start the container, the extension is already active in your database and ready to use. No additional installation steps are required.

For more information on running $TIMESCALE_DB using Docker, see
[Install TimescaleDB from a Docker container][docker-install].

## Update $TOOLKIT_LONG

To get the latest version of $TOOLKIT_SHORT, [update][update-docker] the $TIMESCALE_DB HA docker image.

## Uninstall $TOOLKIT_LONG

$TOOLKIT_SHORT is included in the TimescaleDB HA Docker image and cannot be uninstalled separately. To remove $TOOLKIT_SHORT, you need to remove the entire TimescaleDB container. See [Uninstall TimescaleDB from Docker][uninstall-docker].

If you only want to remove the extension from a specific database without removing the container:

<Procedure>

1.  Connect to your database:

    ```bash
    docker exec -it timescaledb psql -U postgres -d <database_name>
    ```

1.  Drop the $TOOLKIT_SHORT extension:

    ```sql
    DROP EXTENSION IF EXISTS timescaledb_toolkit CASCADE;
    ```

    <Highlight type="warning">

    Using `CASCADE` will drop all objects that depend on the $TOOLKIT_SHORT extension. Ensure you have backed up any data you want to keep.

    </Highlight>

</Procedure>

</Tab>

<Tab title="Kubernetes" label="kubernetes">

<ToolkitKubernetesBase />

<ToolkitKubernetesUninstall />

</Tab>

<Tab title="Linux" label="linux">

<Tabs label="Choose your Linux distribution" persistKey="linux-distro">

<Tab title="Debian" label="debian">

<ToolkitDebianBase />

<ToolkitDebianUninstall />

</Tab>

<Tab title="Ubuntu" label="ubuntu">

<ToolkitDebianBase />

<ToolkitDebianUninstall />

</Tab>

<Tab title="Red Hat" label="redhat">

<ToolkitRedhatBase />

<ToolkitRedhatUninstall />

</Tab>

<Tab title="Fedora" label="fedora">

<ToolkitRedhatBase />

<ToolkitRedhatUninstall />

</Tab>

<Tab title="RockyLinux" label="rocky">

<ToolkitRockyBase />

<ToolkitRockyUninstall />

</Tab>

</Tabs>

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

1.  [Connect to the database][connect] where you want to use $TOOLKIT_SHORT.
1.  Create the $TOOLKIT_SHORT extension in the database:

    ```sql
    CREATE EXTENSION timescaledb_toolkit;
    ```

    <Highlight type="warning">

    If you encounter an error like `could not access file "$libdir/timescaledb_toolkit-X.XX.X"`, you may need to create a symlink from `.so` to `.dylib` format:

    ```bash
    ln -sf $(pg_config --pkglibdir)/timescaledb_toolkit-*.so \
           $(pg_config --pkglibdir)/timescaledb_toolkit-*.dylib
    ```

    This is due to a known issue in the Homebrew formula where the library is installed with a `.so` extension, but $PG on macOS expects a `.dylib` extension.

    </Highlight>

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

## Uninstall $TOOLKIT_LONG

If you no longer need $TOOLKIT_SHORT, you can remove it without uninstalling $TIMESCALE_DB or $PG.

<Procedure>

1.  **Drop the $TOOLKIT_SHORT extension from your databases**

    Connect to each database where $TOOLKIT_SHORT is enabled and remove the extension:

    ```bash
    psql -d "postgres://<username>:<password>@<host>:<port>/<database-name>"
    ```

    At the `psql` prompt:

    ```sql
    DROP EXTENSION IF EXISTS timescaledb_toolkit CASCADE;
    ```

    Repeat this for all databases with $TOOLKIT_SHORT enabled. To exit psql, type `\q`.

    <Highlight type="warning">

    Using `CASCADE` will drop all objects that depend on the $TOOLKIT_SHORT extension. Ensure you have backed up any data you want to keep.

    </Highlight>

1.  **Uninstall the $TOOLKIT_SHORT package**

    ```bash
    brew uninstall timescaledb-toolkit
    ```

1.  **(Optional) Remove manual symlinks**

    If you created a manual `.dylib` symlink as a workaround during installation, remove it:

    ```bash
    rm $(pg_config --pkglibdir)/timescaledb_toolkit-*.dylib 2>/dev/null || true
    ```

</Procedure>

</Tab>

<Tab title="Source" label="source">

<ToolkitSourceBase />

<ToolkitSourceUninstall />

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
[macos-install]: /self-hosted/:currentVersion:/install/installation-macos/
[uninstall-docker]: /self-hosted/:currentVersion:/uninstall/