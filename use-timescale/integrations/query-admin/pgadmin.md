---
title: pgAdmin
excerpt: Connect to your Timescale database with pgAdmin
products: [cloud, mst, self_hosted]
keywords: [connect]
---

# Connect to Timescale using pgAdmin

The `pgAdmin` tool is a database administration tool that can be run on the
desktop, or in your browser. It is available for Chrome, Firefox, Edge, and
Safari browsers, or can be installed on Microsoft Windows, Apple macOS, or
various Linux flavors.

For more information about `pgAdmin`, including download and installation
instructions, see [pgadmin.org][pgadmin].

## Before you begin

*   Download and install `pgAdmin`. For the instructions to download and
    install, see [pgadmin.org][pgadmin].

<Tabs label="Connect to Timescale with pgAdmin">

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
1.  Start `pgAdmin`.
1.  In the `Quick Links` section of the `Dashboard` tab, click `Add New Server`.
1.  In the `Register - Server` page go to the `General` tab.
1.  In the `Name` field, type a name for the server, and the description in the
    `Comments` field.
1.  In the `Connection` tab, fill in the fields using the server name, database,
    user name, port, and password for your Timescale service. For more
    information about these settings,
    see [the connection section][connection-details].
1.  Click `Save` to save the configuratiosn that you set.

    <Highlight type="note">
    If you configured your Timescale service to connect using [SSL
    mode](https://docs.timescale.com/use-timescale/latest/security/strict-ssl/),
    in the `Parameters` tab, set `SSL mode` to `Verify-Full`, and set the
    location of the SSL root CA certificate to use.
    </Highlight>

1.  Click `Save`.

    <img class="main-content__illustration"
    width={1375} height={944}
    src="https://s3.amazonaws.com/assets.timescale.com/docs/images/pgadmin_timescale_cloud.webp"
    alt="Connecting to Timescale using pgAdmin"/>

</Procedure>

</Tab>

<Tab title="Self-hosted Timescale">

<Procedure>

1.  Start `pgAdmin`.
1.  In the `Quick Links` section of the `Dashboard` tab, click `Add New Server`.
1.  In the `Register - Server` page go to the `General` tab.
1.  In the `Name` field, type a name for the server, and the description in the
    `Comments` field.
1.  In the `Connection` tab, fill in the fields using the server name, database,
    user name, port, and password for your Timescale service. For more
    information about these settings,
    see [the connection section][connection-details].
1.  Click `Save` to save the configuratiosn that you set.

    <img class="maincontent__illustration"
    width={1375} height={944}
    src="https://s3.amazonaws.com/assets.timescale.com/docs/images/pgadmin_self_hosted.webp"
    alt="Connecting to Timescale using pgAdmin"/>

</Procedure>

</Tab>

</Tabs>

## Settings in the `Connection`

This table provides the description and example values for the fields in the
`Connection` dialog.

|Setting|Example value|Description|
|-|-|-|
|Host name/address|`localhost`,`127.0.0.1` `postgresql.example.com`, `<REMOTE_HOST>.tsdb.cloud.timescale.com`|The fully qualified server name or IP address of your TimescaleDB server or the host name of your Timescale service.|
|Port|`5432`|The port number of the TimescaleDB server or the Timescale service.|
|Username|`postgres`, `tsdbadmin`|The user name you want to log in with. Use `tsdbadmin` for Timescale services|
|Password|*password*|The password for the account you are logging in with|
|Save password|*Toggle*|Enable if you don't want to enter the password each time you connect.|
|Maintenance database name|`postgres`, `tsdb`|This option is used to specify the initial database that pgAdmin connects to. The database name for a Timescale service is `tsdb`. You can also specify the name of the database to connect to.|

[pgadmin]: https://www.pgadmin.org/
[connection-details]: #settings-in-the-connection
[tsc-portal]: https://console.cloud.timescale.com/
