---
title: Connecting to Timescale
excerpt: How to connect to a Timescale instance
products: [cloud, mst, self_hosted]
keywords: [connect, Managed Service for TimescaleDB, Timescale]
---


# Connecting to Timescale

Regardless of the tool you use to connect to your database, you need to make
sure you have these details:

*   Hostname
*   Port
*   Username
*   Password
*   Database name

For more information about using these details to connect with `psql`, see the
[About psql][about-psql] section.

## Find connection details

<Tabs label="Find connection details">

<Tab title="Timescale">

<Procedure>

### Finding connection details in Timescale

1.  Sign in to the [Timescale portal][tsc-portal].
1.  In the `Services` tab, find the service you want to connect to, and check
    it is marked as `Running`.
1.  Click the name of the service to see its connection information. Copy the
    `Service URL`.
1.  If you don't know the password for the service, navigate to the `Operations`
    tab, and click `Reset password`. You can choose your own password or allow
    Timescale to generate a secure password for you. Keep a copy of your
    new password.

<img
class="main-content__illustration"
width={1375} height={944}
src="https://assets.timescale.com/docs/images/tsc-connection-info.webp"
alt="View Timescale connection info"
/>

</Procedure>

</Tab>

<Tab title="Managed Service for TimescaleDB">

<Procedure>

### Finding connection details in Managed Service for TimescaleDB

1.  Sign in to your Managed Service for TimescaleDB portal.
1.  In the `Services` tab, find the service you want to connect to, and check
    it is marked as `Running`.
1.  Click the name of the service to see its connection information. Copy the
    `host`, `port`, and `password`. You need these to connect.

<img
class="main-content__illustration"
width={1375} height={944}
src="https://assets.timescale.com/docs/images/mst-connection-info.webp"
alt="View Managed Service for TimescaleDB connection info"
/>

</Procedure>

</Tab>

<Tab title="Self-hosted Timescale">

If you have installed your database on your local system, you can use the
`localhost` hostname to log in as the PostgreSQL root user `postgres`. When you
have connected using these details, make sure that you set up an additional user
for accessing your database, and add additional authentication requirements.

</Tab>

</Tabs>

[about-psql]: /use-timescale/:currentVersion:/integrations/query-admin/about-psql/
[tsc-portal]: https://console.cloud.timescale.com/
