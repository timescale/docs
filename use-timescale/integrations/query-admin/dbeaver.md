---
title: DBeaver
excerpt: Connect to your Timescale database with DBeaver
products: [cloud, mst, self_hosted]
keywords: [connect]
---

# Connect to Timescale using DBeaver

[DBeaver][dbeaver] is a free and open source database tool that is available for
Microsoft Windows, Apple macOS, and many Linux versions. DBeaver provides a
powerful SQL editor, administration features, ability to migrate data and
schema, and the ability to monitor database connection sessions. You can connect
to Timescale hosted on your local machine or on a remote server or a Timescale
service.

## Before you begin

*   Download and install [DBeaver][dbeaver-downloads].

<Tabs label="Connect to Timescale with DBeaver">

<Tab title="Timescale">

<Procedure>

1.  Sign in to the [Timescale portal][tsc-portal].
1.  In the `Services` tab, find the service you want to connect to, and check
    it is marked as `Running`.
1.  Click the name of the service you want to connect to, and take a note
     of the `Host`, `Port`, `Database name`, and `Username`.
1.  [](#)<Optional />If you do not know the password for the service, navigate to the
    `Operations` tab, and click `Reset password`. You can choose
    your own password for the service, or allow Timescale to generate a
    secure password for you. Take a note of your new password.
1.  Start `DBeaver`.
1.  In the `Database` menu, click `New Database Connection`.
1.  In the `Connect to a database` window, search for `TimescaleDB`.
1.  Select `TimescaleDB` and click `Next` to continue.
1.  In the `Main` tab type the details for your connection, including the
    `Host`, `Port`,`Database`, `Username` and `Password`. For more information
    about these settings, see [the connection settings section][connection-settings].

    <Highlight type="note">
    If you configured your Timescale service to connect using
    [SSL mode](/use-timescale/latest/security/strict-ssl/),
    then in the `SSL` tab enable `Use SSL`, set `SSL mode` to `verify-full`, and
    in the `CA Certificate` field, type the location of the SSL root CA
    certificate to use.
    </Highlight>

1.  Click the `Test Connection` button to check if the connection is successful.
1.  Click the `Finish` button to connect to the database server. The server is
    listed in the `Database Navigator` pane.

    <img class="maincontent__illustration"
    src="https://s3.amazonaws.com/assets.timescale.com/docs/images/timescale_cloud_dbeaver.webp"
    alt="Connecting to Timescale using DBeaver"/>

</Procedure>

</Tab>

<Tab title="Self-hosted Timescale">

<Procedure>

1.  Start `DBeaver`.
1.  In the `Database` menu, click `New Database Connection`.
1.  In the `Connect to a database` window, search for `TimescaleDB`.
1.  Select `TimescaleDB` and click `Next` to continue.
1.  In the `Main` tab, type the details for your connection, including the
    `Host`, `Port`,`Database`, `Username` and `Password`. For more information
    about these settings, see [the connection settings section][connection-settings].
1.  Click the `Test Connection` button to check if the connection is successful.
1.  Click the `Finish` button to connect to the database server. The server is
    listed in the `Database Navigator` pane.

    <img class="maincontent__illustration"
    src="https://s3.amazonaws.com/assets.timescale.com/docs/images/on_premise_dbeaver.webp"
    alt="Connecting to Timescale using DBeaver"/>

</Procedure>

</Tab>

</Tabs>

## Connection settings in `Connect to a database`

This table provides the description and example values for the fields that
appear in the `Main` tab of `Connection settings`.

|Setting|Example value|Description|
|-|-|-|
|Host|localhost, postgresql.example.com, <REMOTE_HOST>.tsdb.cloud.timescale.com|The fully qualified server name. The host name of your Timescale service.|
|Port|5432|The port number of the TimescaleDB server, Timescale service.|
|Username|`postgres`, `tsdbadmin`|The user name you want to log in with. Use `tsdbadmin` for Timescale services|
|Password|*password*|The password for the database user you are connecting to.|
|Save password locally|*Check*|Check this box if you don't want to enter the password each time you connect.|
|Database|`tsdb`|This option connects to the default database. The database name for a Timescale service is `tsdb`. You can also specify the name of the database to connect to.|

[dbeaver]: https://dbeaver.io/
[dbeaver-downloads]: https://dbeaver.io/download/
[connection-settings]: #connection-settings-in-connect-to-a-database
[tsc-portal]: https://console.cloud.timescale.com/
