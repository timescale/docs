## Prerequisites

To follow this procedure:

- [Install $TIMESCALE_DB][debian-install].
- Add the $TIMESCALE_DB repository and the GPG key.

## Install $TOOLKIT_LONG

These instructions use the `apt` package manager.

<Procedure>

1.  Update your local repository list:

    ```bash
    sudo apt update
    ```

1.  Install TimescaleDB Toolkit:

    ```bash
    sudo apt install timescaledb-toolkit-postgresql-17
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
    apt update
    ```

1. Install the latest version of $TOOLKIT_LONG:

    ```bash
    apt install timescaledb-toolkit-postgresql-17
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

[connection-info]: /integrations/:currentVersion:/find-connection-details/
[debian-install]: /self-hosted/:currentVersion:/install/installation-linux/
[debian-install]: /self-hosted/:currentVersion:/install/installation-linux/
