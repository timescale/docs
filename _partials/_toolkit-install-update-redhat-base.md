## Prerequisites

To follow this procedure:

- [Install $TIMESCALE_DB][red-hat-install].
- Create a $TIMESCALE_DB repository in your `yum` `repo.d` directory.

## Install $TOOLKIT_LONG

These instructions use the `yum` package manager.

<Procedure>

1.  Set up the repository:

    ```bash
    curl -s https://packagecloud.io/install/repositories/timescale/timescaledb/script.deb.sh | sudo bash
    ```

1.  Update your local repository list:

    ```bash
    yum update
    ```

1.  Install $TOOLKIT_LONG:

    ```bash
    yum install timescaledb-toolkit-postgresql-18
    ```

1.  [Connect to the database][connect] where you want to use $TOOLKIT_SHORT.
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
    yum update
    ```

1.  Install the latest version of $TOOLKIT_LONG:

    ```bash
    yum install timescaledb-toolkit-postgresql-18
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