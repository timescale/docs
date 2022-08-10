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
can also connect to Timescale Cloud service and Managed Service for TimescaleDB
service.

## Before you begin

*   Download and install [Azure Data Studio][ms-azure-data-studio].
*   Install the [PostgreSQL extension for Azure Data Studio][postgresql-azure-data-studio].

## Connecting to TimescaleDB hosted locally, or on a remote server

<procedure>

1.  Start `Azure Data Studio`.
1.  Click the `New Connection` icon in the `SERVERS`page.
1.  In the form that pops up, go to `Connection type` and select `PostgreSQL`
    from the drop-down. Fill in the fields using the server name, user name, and
    password for your TimescaleDB server.

   <img class="main-content__illustration"src="https://s3.amazonaws.com/assets.timescale.com/docs/images/local_remote_connection_screen.png"alt="Connection screen for local or remote timescaledb"/>

   | Setting       | Example value | Description |
   | ------------ | ------------------ | ------------------------------------------------- |
   |Server name|localhost, postgresql.example.com|The fully qualified server name|
   |Authentication type|Password|The authentication type to log in with|
   |User name|postgres|The user name you want to log in with|
   |Password|*password*|The password for the account you are logging in with|
   |Remember password|*Check*|Check this box if you don't want to enter the password each time you connect.|
   |Database name|\<Default\>|This option connnects to a specific database|
   |Server group| \<Default\> |This option lets you assign this connection to a specific server group you create.|
   |Name (optional)|*leave blank*|This option lets you specify a friendly name for your server|

1.  Click `Advanced`.
1.  Type the port number in the `Port` field and click `OK`.
1.  Click `Connect`.

After successfully connecting, your server opens in the `SERVERS`sidebar.

</procedure>

## Connecting to Timescale Cloud service

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
1.  In the form that pops up, go to `Connection type`and select `PostgreSQL`from
   the drop-down. Fill in the fields using the server name, user name, and
   password for your TimescaleDB Cloud service.

   <img class="main-content__illustration"src="https://s3.console.aws.amazon.com/assets.timescale.com/docs/images/timescale_cloud_connection_screen.png"alt="Connection screen for Timescale Cloud service"/>

   | Setting       | Example value | Description |
   | ------------ | ------------------ | ------------------------------------------------- |
   |Server name|<REMOTE_HOST>.tsdb.cloud.timescale.com|Host name of your Timescale Cloud service|
   |Authentication type|Password|The authentication type to log in with|
   |User name|tsdbadmin|The user name to log into your Timescale Cloud service|
   |Password|*password*|The password to log into your Timescale Cloud service|
   |Remember password|*Check*|Check this box if you don't want to enter the password each time you connect.|
   |Database name|\<Default\>|This option connnects to a specific database|
   |Server group| \<Default\>|This option lets you assign this connection to a specific server group you create.|
   |Name (optional)|*leave blank*|This option lets you specify a friendly name for your server|

1.  Click `Advanced`.
1.  Type the port number in the `Port` field and click `OK`.
1.  Select `Connect`.

After successfully connecting, your server opens in the `SERVERS`sidebar.

</procedure>

## Connecting to Managed Service for TimescaleDB service

<procedure>

1.  Sign in to the [Managed Service for TimescaleDB portal][mst-portal].
1.  In the `Services` tab, find the service you want to connect to, and check
    it is marked as `Running`.
1.  Click the name of the service you want to connect to see the connection
    information. Take a note of the `Host`, `Port`, `Database Name`, `User`, and
    `Password`.
1.  Start `Azure Data Studio`.
1.  Click the `New Connection` icon in the `SERVERS`page.
1.  In the form that pops up, go to `Connection type` and select `PostgreSQL`
   from the drop-down. To connect to the TimescaleDB hosted on your local
   machine or on a remote server. Fill in the fields using the server name, user
   name, and password for your Managed Service for TimescaleDB service.

   <img class="main-content__illustration"src="https://s3.console.aws.amazon.com/assets.timescale.com/docs/images/mst_connection_screen.png"alt="Connection screen for Managed Service for TimescaleDB service"/>

   | Setting       | Example value | Description |
   | ------------ | ------------------ | ------------------------------------------------- |
   |Server name|<REMOTE_HOST>.timescaledb.io|Host name of your Managed Service for TimescaleDB service|
   |Authentication type|Password|The authentication type to log in with|
   |User name|tsdbadmin|The user name to log into your Managed Service for TimescaleDB service|
   |Password| *password* |The password to log into your Managed Service for TimescaleDB service|
   |Remember password| *Check* |Check this box if you don't want to enter the password each time you connect|
   |Database name|defaultdb|This option connects to the `defatltdb` database|
   |Server group| \<Default\> |This option lets you assign this connection to a specific server group you create|
   |Name (optional)| *leave blank* |This option lets you specify a friendly name for your server|

1.  Select `Connect`.

After successfully connecting, your server opens in the `SERVERS`sidebar.

</procedure>

[ms-azure-data-studio]: https://docs.microsoft.com/en-us/sql/azure-data-studio/download-azure-data-studio?view=sql-server-ver16#install-azure-data-studio
[postgresql-azure-data-studio]: https://docs.microsoft.com/en-us/sql/azure-data-studio/extensions/postgres-extension?view=sql-server-ver16
[tsc-portal]: https://console.cloud.timescale.com/
[mst-portal]: https://portal.managed.timescale.com
