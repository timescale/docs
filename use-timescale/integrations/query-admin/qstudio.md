---
title: qStudio
excerpt: Connect to your Timescale database with qStudio
products: [cloud, mst, self_hosted]
keywords: [connect]
---

# Connect to Timescale using qStudio

[qStudio][qstudio] qStudio is a free SQL GUI, it allows running SQL scripts, easy browsing of tables, charting and exporting of results. 
It works on every operating system, with every database including Timescale. 
You can connect to Timescale hosted on your local machine or on a remote server or a Timescale
service.

## Before you begin

*   Download and install [qStudio][qstudio-downloads].

<Tabs label="Connect to Timescale with qStudio">

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
1.  Start `qStudio`.
1.  Click on the menu options `Server->Add Server` or on the add server button on the toolbar.
1.  Select Server Type: `Postgres`.
1.  Set the `Host`, `Port`,`Database`, `Username` and `Password`.
1.  Click the `Test` button to check if the connection is successful.
1.  Click the `Add` button to add the database server. The server is listed in the `Server Tree` pane.

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
|Database|`tsdb`|This option connects to the default database. The database name for a Timescale service is `tsdb`. You can also specify the name of the database to connect to.|

[qstudio]: https://www.timestored.com/qstudio
[qstudio-downloads]: https://www.timestored.com/qstudio/download
