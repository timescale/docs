# Install Timescale Cloud
Timescale Cloud is a hosted, cloud-native TimescaleDB service that allows you to
quickly spin up new TimescaleDB instances. You can
[try Timescale Cloud for free][sign-up], no credit card required.

Powered by [TimescaleDB][timescale-features], Timescale Cloud is an innovative
and cost-effective way to store and analyze your time-series data. Get started
super fast with demo data, or your own dataset, and enjoy the security of
automated upgrades and backups.

Each Timescale Cloud service can have a single database. The database must be
named `tsdb`. To create a second database, you need to create a second service.

<procedure>

### Installing Timescale Cloud
1.  Sign up for a [Timescale Cloud account][sign-up] with your
    name and email address. You do not need to provide payment details to
    get started. A confirmation email is sent to the email address you provide.
1.  Verify your email by clicking on the link in the email you received. Don't
    forget to check your spam folder in case the email ends up there.
1.  Sign in to the [Timescale Cloud portal][tsc-portal] with the
    password you set:
    <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-portal-noservices.png" alt="Timescale Cloud Portal"/>

<highlight type="important">
Your Timescale Cloud trial is completely free for you to use for the first
thirty days. This gives you enough time to complete all our tutorials and run a
few test projects of your own.
</highlight>

</procedure>

## Create your first service
A service in Timescale Cloud is a cloud instance which you can install your
database on.

<procedure>

### Creating your first service
1.  Sign in to the [Timescale Cloud portal][tsc-portal].
1.  Click `Create service`.
1.  You can choose to build your service with or without demo data. If this is
    your first service, we recommend that you choose the `With demo data`,
    because it is the best way to see how Timescale Cloud works in the real
    world.
1.  Click `Start demo` to create your service with demo data, and launch
    the `Allmilk Factory` interactive demo. You can exit the demo at any time,
    and revisit it from the same point later on. You can also re-run the demo
    after you have completed it.

    <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-new-service.png" alt="Create a new service in the Timescale Cloud portal"/>

<highlight type="important">
Your Timescale Cloud trial is completely free for you to use for the first
thirty days. This gives you enough time to complete all our tutorials and run a
few test projects of your own.
</highlight>

</procedure>

## Connect to your service from the command prompt
When you have a service up and running, you can connect to it from your local
system using the `psql` command-line utility. This is the same tool you might
have used to connect to PostgreSQL before, but if you haven't installed it yet,
check out our [installing psql][install-psql] section.

<procedure>

### Connecting to your service from the command prompt
1.  Sign in to the [Timescale Cloud portal][tsc-portal].
1.  In the `Services` tab, find the service you want to connect to, and check
    it is marked as `Running`.
1.  Click the name of the service you want to connect to see the connection
    information. Take a note of the `Service URL`.
1.  Navigate to the `Operations` tab, and click `Reset password`. You can choose
    your own password for the service, or allow Timescale Cloud to generate a
    secure password for you. Take a note of your new password.
1.  On your local system, at the command prompt, connect to the service using
    the service URL. When you are prompted for the password, enter the password
    you just created:
    ```bash
    psql -x "postgres://tsdbadmin@t9aggksc24.gspnhi29bv.tsdb.cloud.timescale.com:33251/tsdb?sslmode=require"
    Password for user tsdbadmin:
    ```
    If your connection is successful, you'll see a message like this, followed
    by the `psql` prompt:
    ```
    psql (13.3, server 12.8 (Ubuntu 12.8-1.pgdg21.04+1))
    SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
    Type "help" for help.
    tsdb=>
    ```

</procedure>

## Check that you have the TimescaleDB extension
TimescaleDB is provided as an extension to your PostgreSQL database, and it is
enabled by default when you create a new service on Timescale Cloud. You can
check that the TimescaleDB extension is installed by using the `\dx` command at
the `psql` prompt. It looks like this:
```sql
tsdb=> \dx
List of installed extensions
-[ RECORD 1 ]------------------------------------------------------------------
Name        | pg_stat_statements
Version     | 1.7
Schema      | public
Description | track execution statistics of all SQL statements executed
-[ RECORD 2 ]------------------------------------------------------------------
Name        | plpgsql
Version     | 1.0
Schema      | pg_catalog
Description | PL/pgSQL procedural language
-[ RECORD 3 ]------------------------------------------------------------------
Name        | timescaledb
Version     | 2.4.1
Schema      | public
Description | Enables scalable inserts and complex queries for time-series data
-[ RECORD 4 ]------------------------------------------------------------------
Name        | timescaledb_toolkit
Version     | 1.3.1
Schema      | public
Description | timescaledb_toolkit

tsdb=>
```

## Where to next
Now that you have your first service up and running, you can check out the
[Timescale Cloud][tsc-docs] section in our documentation, and
find out what you can do with it.

If you want to work through some tutorials to help you get up and running with
TimescaleDB and time-series data, check out our [tutorials][tutorials] section.

If you're interested in learning more about pricing for Managed Service for
TimescaleDB, visit the
[managed service for TimescaleDB pricing calculator][timescale-pricing].

You can always [contact us][contact] if you need help working something out, or
if you want to have a chat.


[tsc-portal]: https://console.cloud.timescale.com/
[sign-up]: https://www.timescale.com/timescale-signup
[timescale-features]: https://www.timescale.com/products/#Features
[timescale-pricing]: https://www.timescale.com/products#cloud-pricing
[contact]: https://www.timescale.com/contact
[install-psql]: /timescaledb/:currentVersion:/how-to-guides/connecting/psql/
[tsc-docs]: /cloud/:currentVersion:/
[tutorials]: /timescaledb/:currentVersion:/tutorials/
