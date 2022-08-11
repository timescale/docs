---
title: Azure Data Studio
excerpt: Connect to your TimescaleDB database with Microsoft Azure Data Studio
product: mst, cloud, timescaledb
keywords: [connect]
---

# Connect to TimescaleDB using Azure Data Studio

Azure Data Studio is a cross-platform database tool for data professionals using
on-premises and cloud data platforms on Windows, macOS, and Linux. You can
connect to TimescaleDB hosted on your local machine or on a remote server. You
can also connect to Timescale Cloud, and Managed Service for TimescaleDB
services.

## Before you begin

*   Download and install [Azure Data Studio][ms-azure-data-studio].
*   Install the [PostgreSQL extension for Azure Data Studio][postgresql-azure-data-studio].

### Connecting to on-premise TimescaleDB using Azure Data Studio

<procedure>

1.  Start `Azure Data Studio`.
1.  In the `SERVERS` page, click `New Connection`.
1.  In the `Connection Details` dialog, navigate to `Connection type`, and select `PostgreSQL`.
    Fill in the fields using the server name, user name, and password for your 
    TimescaleDB instance. For more information about these settings, see 
    [the connection details section][connection-details].

   <img class="maincontent__illustration"src="https://s3.amazonaws.com/assets.timescale.com/docs/images/local_remote_connection_screen.png"alt="Connection screen for local or remote timescaledb"/>

1.  Click `Advanced`.
1.  Type the port number in the `Port` field and click `OK`.
1.  Click `Connect`.

After successfully connecting, your server opens in the `SERVERS`sidebar.

</procedure>

### Connecting to Timescale Cloud service

<procedure>

1.  Sign in to the [Timescale Cloud portal][tsc-portal].
1.  In the `Services` tab, find the service you want to connect to, and check
    it is marked as `Running`.
1.  Click the name of the service you want to connect to see the connection
    information. Take a note of the `Host`, `Port`, `Database name`, and `Username`.
1.  Navigate to the `Operations` tab, and click `Reset password`. You can choose
    your own password for the service, or allow Timescale Cloud to generate a
    secure password for you. Take a note of your new password.
1.  Start `Azure Data Studio`.
1.  Click the `New Connection` icon in the `SERVERS`page.
1.  In the `Connection Details` dialog, navigate to `Connection type`, and select `PostgreSQL`.
    Fill in the fields using the server name, user name, port, and password for your
    TimescaleDB Cloud service. For more information about these settings, see 
    [the connection details section][connection-details].

   <img class="main-content__illustration"src="https://s3.amazonaws.com/assets.timescale.com/docs/images/timescale_cloud_connection_screen.png"alt="Connection screen for Timescale Cloud service"/>

1.  Click `Advanced`.
1.  Type the port number in the `Port` field and click `OK`.
1.  Select `Connect`.

After successfully connecting, your server opens in the `SERVERS`sidebar.

</procedure>

### Connecting to Managed Service for TimescaleDB service

<highlight type="note">
To ensure a secure network access to your Managed Service for TimescaleDB
service, add the IP address of your local machine on which you have installed
Azure Data Studio to `Allowed IP Addresses`. For more information about network
security see, [Security overview][security-overview].
</highlight>

<procedure>

1.  Sign in to the [Managed Service for TimescaleDB portal][mst-portal].
1.  In the `Services` tab, find the service you want to connect to, and check
    it is marked as `Running`.
1.  Click the name of the service you want to connect to see the connection
    information. Take a note of the `Host`, `Port`, `Database Name`, `User`, and
    `Password`.
1.  Start `Azure Data Studio`.
1.  Click the `New Connection` icon in the `SERVERS`page.
1.  In the `Connection Details` dialog, navigate to `Connection type`, and select `PostgreSQL`.
    Fill in the fields using the server name, user name, port, and password for your
    Managed Service for TimescaleDB service. For more information about these settings, see 
    [the connection details section][connection-details].

   <img class="main-content__illustration"src="https://s3.amazonaws.com/assets.timescale.com/docs/images/mst_connection_screen.png"alt="Connection screen for Managed Service for TimescaleDB service"/>

1.  Click `Advanced`.
1.  In the `Port` field, type the port number, and click `OK`.
1.  Click `Connect`.


</procedure>

### Settings in the `Connection Details`

   |Setting|Example value|Description|
   |-|-|-|
   |Server name|localhost, postgresql.example.com, <REMOTE_HOST>.tsdb.cloud.timescale.com, <REMOTE_HOST>.timescaledb.io |The fully qualified server name.    The host name of your Timescale Cloud service or Managed Service for TimescaleDB service.|
   |Authentication type|Password|The authentication type to log in with|
   |User name|postgres, tsdbadmin|The user name you want to log in with. Use `tsdbadmin` for Timescale Cloud service and Managed Service for TimescaleDB      service|
   |Password|*password*|The password for the account you are logging in with|
   |Remember password|*Check*|Check this box if you don't want to enter the password each time you connect.|
   |Database name|\<Default\>, defaultdb|This option connnects to default database. The default database on your Managed Service for TimescaleDB service      is `defaultdb`. You can also specify the name of the database to connect to.|
   |Server group| \<Default\> |This option lets you assign this connection to a specific server group you create.|
   |Name (optional)|*leave blank*|This option lets you specify a friendly name for your server|

[ms-azure-data-studio]: https://docs.microsoft.com/en-us/sql/azure-data-studio/download-azure-data-studio?view=sql-server-ver16#install-azure-data-studio
[postgresql-azure-data-studio]: https://docs.microsoft.com/en-us/sql/azure-data-studio/extensions/postgres-extension?view=sql-server-ver16
[tsc-portal]: https://console.cloud.timescale.com/
[mst-portal]: https://portal.managed.timescale.com
[connection-details]: /timescaledb/:currentVersion:/how-to-guides/connecting/azure-data-studio/#settings-in-the-connection-details/
[security-overview]: /mst/:currentVersion:/security/
