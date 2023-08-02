---
title: qStudio
excerpt: Connect to your Timescale database with qStudio
products: [cloud, mst, self_hosted]
keywords: [connect]
---

# Connect to Timescale using qStudio

You can use [qStudio][qstudio] to run queries, browse tables, and create charts 
for your Timescale database.

For more information about `qStudio`, including download and installation
instructions, see [timestored.com][qstudio-downloads].

## Before you begin

*   Download and install [qStudio][qstudio-downloads].

<Tabs label="Connect to Timescale with qStudio">

<Tab title="Timescale">

<Procedure>

1.  Sign in to the [Timescale portal][tsc-portal], and navigate to the `Services` 
     tab. For the service you want to connect to, check it is marked as `Running`, 
     and take note of the `Host`, `Port`, `Database name`, and `Username`.
1.  [](#)<Optional />If you do not know the password for the service, navigate
    to the `Operations` tab, and click `Reset password`. You can choose your own
    password for the service, or allow Timescale to generate a
    secure password for you. Take note of your new password.
1.  Start `qStudio`, navigate to the `Server` tab, and click `Add Server`.
1.  In the `Server Properties` dialog, complete these details:
    *   For `Server Type`, select `Postgres`.
    *   For `Connect By`, select `Host`.
    *   For the `Host`, `Port`, `Database`, `Username` and `Password`, use 
         your service connection details. For more information about these 
         settings, see [the connection section][connection-details].
1.  Click `Test` to check if the connection is successful.
1.  Click `Add` to add the connection.
    The server is listed in the `Server Tree` pane.

    <img class="maincontent__illustration"
    src="https://s3.amazonaws.com/assets.timescale.com/docs/images/qstudio_timescale.webp"
    alt="Connecting to Timescale service using qstudio"/>

</Procedure>

</Tab>

<Tab title="Self-hosted Timescale">

<Procedure>

1.  Start `qStudio`.
1.  In the `Server` tab click `Add Server`.
1.  In the `Server Properties` dialog, complete these details:
    *   For `Server Type`, select `Postgres`.
    *   For `Connect By`, select `Host`.
    *   For the `Host`, `Port`, `Database`, `Username` and `Password`, use 
         your service connection details. For more information about these 
         settings, see [the connection section][connection-details].
1.  Click `Test` to check if the connection is successful.
1.  Click `Add` to add the connection.
    The server is listed in the `Server Tree` pane.

    <img class="maincontent__illustration"
    src="https://s3.amazonaws.com/assets.timescale.com/docs/images/qstudio_self_hosted.webp"
    alt="Connecting to Timescale using qstudio"/>

</Procedure>

</Tab>

</Tabs>

## Connection settings

This table provides the description and example values for the fields in
`Connection` dialog of `Server Properties`.

|Setting|Example value|Description|
|-|-|-|
|Host|`localhost`, `postgresql.example.com`, `<REMOTE_HOST>.tsdb.cloud.timescale.com`|The fully qualified server name or IP address of your TimescaleDB server, or the hostname of your Timescale service.|
|Port|`5432`|The port number of the TimescaleDB server, or Timescale service.|
|Username|`postgres`, `tsdbadmin`|The user name you want to log in with. Use `tsdbadmin` for Timescale services.|
|Password||The password for the database user you are connecting to.|
|Database|`tsdb`|The name of the database to connect to. For a Timescale service, use `tsdb`.|

[qstudio]: https://www.timestored.com/qstudio
[qstudio-downloads]: https://www.timestored.com/qstudio/download
[tsc-portal]: https://console.cloud.timescale.com/
[connection-details]: #connection-settings
