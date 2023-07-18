---
title: Azure Data Studio
excerpt: Connect to your Timescale database with Microsoft Azure Data Studio
products: [cloud, mst, self_hosted]
keywords: [connect]
---

# Connect to Timescale using Azure Data Studio

Azure Data Studio is a cross-platform database tool for data professionals using
on-premises and cloud data platforms on Windows, macOS, and Linux.

## Before you begin

*   Download and install [Azure Data Studio][ms-azure-data-studio].
*   Install the
    [PostgreSQL extension for Azure Data Studio][postgresql-azure-data-studio].

<Tabs label="Connect to Timescale with Azure Data Studio">

<Tab title="Timescale">

<Procedure>

1.  Sign in to the [Timescale portal][tsc-portal].
1.  In the `Services` tab, find the service you want to connect to, and check
    it is marked as `Running`.
1.  Click the name of the service you want to connect to, and take a note
     of the `Host`, `Port`, `Database name`, and `Username`.
1.  Navigate to the `Operations` tab, and click `Reset password`. You can choose
    your own password for the service, or allow Timescale to generate a
    secure password for you. Take a note of your new password.
1.  Start `Azure Data Studio`.
1.  In the `SERVERS` page, click `New Connection`.
1.  In the `Connection Details` dialog, navigate to `Connection type`, and
    select `PostgreSQL`. Fill in the fields using the server name, database,
    user name, port, and password for your Timescale service. For more
    information about these settings, see
    [the connection details section][connection-details].
1.  Click `Advanced`.
1.  In the `Port` field, type the port number, and click `OK`.

    <Highlight type="note">
    If you configured your Timescale service to connect using [SSL
    mode](https://docs.timescale.com/use-timescale/latest/security/strict-ssl/),
    then set `SSL mode` to `Verify-Full`, and in the `SSL root certificate
    filename` field, type the location of the SSL root CA certificate to use.
    </Highlight>

1.  Click `Connect`.

    <img class="main-content__illustration"
    src="https://assets.timescale.com/docs/images/timescale_cloud_connection_screen.webp"
    alt="Connecting to Timescale using Azure Data Studio"/>

</Procedure>

</Tab>

<Tab title="Self-hosted Timescale">

<Procedure>

1.  Start `Azure Data Studio`.
1.  In the `SERVERS` page, click `New Connection`.
1.  In the `Connection Details` dialog, navigate to `Connection type`, and
    select `PostgreSQL`. Fill in the fields using the server name, database,user
    name, and password for your Timescale instance. For more information about
    these settings, see the [connection details section][connection-details].
1.  Click `Advanced`.
1.  In the `Port` field, type the port number, and click `OK`.
1.  Click `Connect`.

    <img class="maincontent__illustration"
    src="https://assets.timescale.com/docs/images/local_remote_connection_screen.webp"
    alt="Connecting to Timescale using Azure Data Studio"/>

</Procedure>

</Tab>

</Tabs>

## Settings in the `Connection Details`

This table provides the description and example values for the fields in the
`Connection Details` dialog.

|Setting|Example value|Description|
|-|-|-|
|Server name|localhost, postgresql.example.com, <REMOTE_HOST>.tsdb.cloud.timescale.com|The fully qualified server name. The host name of your Timescale service.|
|Authentication type|Password|The authentication type to log in with|
|User name|`postgres`, `tsdbadmin`|The user name you want to log in with. Use `tsdbadmin` for Timescale services|
|Password|*password*|The password for the account you are logging in with|
|Remember password|*Check*|Check this box if you don't want to enter the password each time you connect.|
|Database name|`<Default>`, `tsdb`|This option connects to the default database. The database name for a Timescale service is `tsdb`. You can also specify the name of the database to connect to.|
|Server group|`<Default>` |This option lets you assign this connection to a specific server group you create.|
|Name (optional)|*leave blank*|This option lets you specify a friendly name for your server|

[ms-azure-data-studio]: https://docs.microsoft.com/en-us/sql/azure-data-studio/download-azure-data-studio?view=sql-server-ver16#install-azure-data-studio
[postgresql-azure-data-studio]: https://docs.microsoft.com/en-us/sql/azure-data-studio/extensions/postgres-extension?view=sql-server-ver16
[tsc-portal]: https://console.cloud.timescale.com/
[connection-details]: #settings-in-the-connection-details
