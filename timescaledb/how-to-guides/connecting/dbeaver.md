---
title: DBeaver
excerpt: Connect to your TimescaleDB database with DBeaver
product: mst, cloud, timescaledb
keywords: [connect]
---

# Connect to TimescaleDB using DBeaver

[DBeaver][dbeaver] is a free and open source database tool that is
available for Microsoft Windows, Apple macOS, or various Linux flavors. DBeaver
provides a powerful SQL-editor, administration features, ability to migrate data
and schema, monitor database connection sessions, and others. You can
connect to TimescaleDB hosted on your local machine or on a remote server. You
can also connect to Timescale Cloud, and Managed Service for TimescaleDB
services.

## Before you begin

*   Download and install [DBeaver][dbeaver-downloads].

### Connecting to on-premise TimescaleDB using DBeaver

<procedure>

1.  Start `DBeaver`.
1.  Click the `Database` menu dropdown, and select `New Database Connection`.
1.  In the `Connect to a database` window that appears, search for `TimescaleDB`.
1.  Select `TimescaleDB` and click `Next` to continue.
1.  In the `Main` tab type the details for your connection, including the
 `Host`, `Port`,`Database`, `Username` and `Password`. For more information
 about these settings, see [the connection settings section][connection-settings].
1.  Click the `Test Connection` button to check if the connection is successful.
1.  Click the `Finish` button to connect to the database server. The server is
    listed in the `Database Navigator` pane.

    <img class="maincontent__illustration"src="https://s3.amazonaws.com/assets.timescale.com/docs/images/on_premise_debeaver.png"alt="Connecting to TimescaleDB using DBeaver"/>

</procedure>

### Connecting to Timescale Cloud with DBeaver

<procedure>

1.  Sign in to the [Timescale Cloud portal][tsc-portal].
1.  In the `Services` tab, find the service you want to connect to, and check
    it is marked as `Running`.
1.  Click the name of the service you want to connect to, and take a note
     of the `Host`, `Port`, `Database name`, and `Username`.
1.  Navigate to the `Operations` tab, and click `Reset password`. You can choose
    your own password for the service, or allow Timescale Cloud to generate a
    secure password for you. Take a note of your new password.
1.  Start `DBeaver`.
1.  Click the `Database` menu dropdown, and select `New Database Connection`.
1.  In the `Connect to a database` window that appears, search for `TimescaleDB`.
1.  Select `TimescaleDB` and click `Next` to continue.
1.  In the `Main` tab type the details for your connection, including the
 `Host`, `Port`,`Database`, `Username` and `Password`. For more information
 about these settings, see [the connection settings section][connection-settings].
1.  Click the `Test Connection` button to check if the connection is successful.
1.  Click the `Finish` button to connect to the database server. The server is
    listed in the `Database Navigator` pane.

    <img class="maincontent__illustration"src="https://s3.amazonaws.com/assets.timescale.com/docs/images/timescale_cloud_dbeaver.png"alt="Connecting to Timescale Cloud using DBeaver"/>

</procedure>

### Connecting to Managed Service for TimescaleDB with DBeaver

<highlight type="important">
To ensure a secure network access to your Managed Service for TimescaleDB
service, make sure you add the IP address of the machine running DBeaver to the
`Allowed IP Addresses`. For more information about network security in Managed
Service for TimescaleDB, see [the security section][security-overview].
</highlight>

<procedure>

1.  Sign in to the [Managed Service for TimescaleDB portal][mst-portal].
1.  In the `Services` tab, find the service you want to connect to, and check
    it is marked as `Running`.
1.  Click the name of the service you want to connect to see the connection
    information. Take a note of the `Host`, `Port`, `Database Name`, `User`, and
    `Password`.
1.  Start `DBeaver`.
1.  Click the `Database` menu dropdown, and select `New Database Connection`.
1.  In the `Connect to a database` window that appears, search for `TimescaleDB`.
1.  Select `TimescaleDB` and click `Next` to continue.
1.  In the `Main` tab type the details for your connection, including the
 `Host`, `Port`,`Database`, `Username` and `Password`. For more information
 about these settings, see [the connection settings section][connection-settings].
1.  Click the `Test Connection` button to check if the connection is successful.
1.  Click the `Finish` button to connect to the database server. The server is
    listed in the `Database Navigator` pane.

    <img class="maincontent__illustration"src="https://s3.amazonaws.com/assets.timescale.com/docs/images/mst_dbeaver.png"alt="Connecting to Managed Service for TimescaleDB using Dbeaver"/>

</procedure>

## Connection Settings in `Connect to a database`

This table provides the description and example values for the fields that
appear in the `Main` tab of `Connection settings`.

   |Setting|Example value|Description|
   | ------------ | ------------------ | ------------------------------------------------- |
   |Host|localhost, postgresql.example.com, <REMOTE_HOST>.tsdb.cloud.timescale.com, <REMOTE_HOST>.timescaledb.io |The fully qualified server name. The host name of your Timescale Cloud service or Managed Service for TimescaleDB service.|
   |Port|5432|The port number of the TimescaleDB server, Timescale Cloud service or Managed Service for TimescaleDB service.|
   |Username|postgres, tsdbadmin|The user name you want to log in with. Use `tsdbadmin` for Timescale Cloud service and Managed Service for TimescaleDB service|
   |Password|*password*|The password for the account you are logging in with|
   |Save password locally|*Check*|Check this box if you don't want to enter the password each time you connect.|
   |Database|tsdb |This option connnects to default database. The database name for Timescale Cloud service and Managed Service for TimescaleDB service is `tsdb`. You can also specify the name of the database to connect to.|

[dbeaver]: https://dbeaver.io/
[dbeaver-downloads]: https://dbeaver.io/download/
[connection-details]: /timescaledb/:currentVersion:/how-to-guides/connecting/dbeaver/#connection-settings-in-connect-to-a-database/
[security-overview]: /mst/:currentVersion:/security/