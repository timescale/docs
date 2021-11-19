# Connecting to TimescaleDB
Regardless of the tool you use to connect to your database, you need to make
sure you have these details:
*   Hostname
*   Port
*   Username
*   Password
*   Database name

## Find connection details in Timescale Cloud
To retrieve your connection details from a running Timescale Cloud service:

<procedure>

### Finding connection details in Timescale Cloud
1.  Sign in to the [Timescale Cloud portal][tsc-portal].
1.  In the `Services` tab, find the service you want to connect to, and check
    it is marked as `Running`.
1.  Click the name of the service you want to connect to, to see the connection
    information. Take a note of the `Service URL`. The URL contains all the
    information you need to connect to your service, except for the password.
1.  If you don't know the password for the service, navigate to the `Operations`
    tab, and click `Reset password`. You can choose your own password, or allow
    Timescale Cloud to generate a secure password for you. Take a note of your
    new password.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-connection-info.png" alt="View Timescale Cloud connection info"/>

</procedure>

## Find connection details in Managed Service for TimescaleDB
To retrieve your connection details from a running Managed Service for Timescale
service:

<procedure>

### Finding connection details in Managed Service for TimescaleDB
1.  Sign in to the [Managed Service for TimescaleDB portal][mst-portal].
1.  In the `Services` tab, find the service you want to connect to, and check
    it is marked as `Running`.
1.  Click the name of the service you want to connect to, to see the connection
    information. Take a note of the `host`, `port`, and `password`.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/mst-connection-info.png" alt="View Managed Service for TimescaleDB connection info"/>

</procedure>

## Find connection details in self-hosted TimescaleDB
If you have installed your database on your local system, you can use the
`localhost` hostname to log in as the PostgreSQL root user `postgres`. When you
have connected using these details, we strongly recommend that you set up an
additional user for accessing your database, and add additional authentication
requirements.


[tsc-portal]: https://console.cloud.timescale.com/
[mst-portal]: https://portal.managed.timescale.com
