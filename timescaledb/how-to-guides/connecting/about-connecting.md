---
title: Connecting to TimescaleDB
excerpt: How to connect to a TimescaleDB instance
keywords: [connect, Managed Service for TimescaleDB, Timescale Cloud]
---

# Connecting to TimescaleDB

Regardless of the tool you use to connect to your database, you need to make
sure you have these details:

*   Hostname
*   Port
*   Username
*   Password
*   Database name

For more information about using these details to connect with `psql`, see the
[About psql][about-psql] section.

## Find connection details in Timescale Cloud

To retrieve your connection details from a running Timescale Cloud service:

<Procedure>

### Finding connection details in Timescale Cloud

1.  Sign in to the [Timescale Cloud portal][tsc-portal].
1.  In the `Services` tab, find the service you want to connect to, and check
    it is marked as `Running`.
1.  Click the name of the service to see its connection information. Copy the
    `Service URL`, which you will need when connecting.
1.  If you don't know the password for the service, navigate to the `Operations`
    tab, and click `Reset password`. You can choose your own password or allow
    Timescale Cloud to generate a secure password for you. Keep a copy of your
    new password, which you will need when connecting.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-connection-info.png" alt="View Timescale Cloud connection info"/>

</Procedure>

## Find connection details in Managed Service for TimescaleDB

To retrieve your connection details from a running Managed Service for
TimescaleDB service:

<Procedure>

### Finding connection details in Managed Service for TimescaleDB

1.  Sign in to the [Managed Service for TimescaleDB portal][mst-portal].
1.  In the `Services` tab, find the service you want to connect to, and check
    it is marked as `Running`.
1.  Click the name of the service to see its connection information. Copy the
    `host`, `port`, and `password`. You need these to connect.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/mst-connection-info.png" alt="View Managed Service for TimescaleDB connection info"/>

</Procedure>

## Find connection details in self-hosted TimescaleDB

If you have installed your database on your local system, you can use the
`localhost` hostname to log in as the PostgreSQL root user `postgres`. When you
have connected using these details, we strongly recommend that you set up an
additional user for accessing your database, and add additional authentication
requirements.

[about-psql]: /timescaledb/:currentVersion:/how-to-guides/connecting/about-psql/
[mst-portal]: https://portal.managed.timescale.com
[tsc-portal]: https://console.cloud.timescale.com/
