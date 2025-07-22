---
title: Get started with Managed Service for TimescaleDB
nav-title: Managed Service for TimescaleDB
excerpt: Create and connect to a service in Managed Service for TimescaleDB
products: [mst]
section: install
order: 2
keywords: [installation]
---

import MSTIntro from "versionContent/_partials/_mst-intro.mdx";
import CloudMSTComparison from "versionContent/_partials/_cloud-mst-comparison.mdx";

# Get started with Managed Service for TimescaleDB

<MSTIntro />

<CloudMSTComparison />

## Create your first service

A $MST_SERVICE_SHORT in $MST_LONG is a cloud instance on your chosen
cloud provider, which you can install your database on.

<Procedure>

### Creating your first $MST_SERVICE_SHORT

1.  [Sign in][mst-login] to your $MST_CONSOLE_LONG.
1.  Click `Create service` and choose `TimescaleDB`, and update your preferences:

    <img class="main-content__illustration"
    src="https://assets.timescale.com/docs/images/mst/new-service.png"
    alt="Create a new service in the Managed Service for TimescaleDB portal"/>

    *   In the `Select Your Cloud Service Provider` field, click your
        preferred provider.
    *   In the `Select Your Cloud Service Region` field, click your preferred
        server location. This is often the server that's physically closest
        to you.
    *   In the `Select Your Service Plan` field, click your preferred plan,
        based on the hardware configuration you require. If you are in your
        trial period, and just want to try the $MST_SERVICE_SHORT out, or develop a proof
        of concept, we recommend the `Dev` plan, because it is the most
        cost-effective during your trial period.
1.  In the information bar on the right of the screen, review the settings you
    have selected for your $MST_SERVICE_SHORT, and click `Create Service`. The $MST_SERVICE_SHORT
    takes a few minutes to provision.

</Procedure>

## Connect to your $MST_SERVICE_SHORT from the command prompt

When you have a $MST_SERVICE_SHORT up and running, you can connect to it from your local
system using the `psql` command-line utility. This is the same tool you might
have used to connect to $PG before, but if you haven't installed it yet,
check out the [installing psql][install-psql] section.

<Procedure>

### Connecting to your $MST_SERVICE_SHORT from the command prompt

1.  [Sign in][mst-login] to your $MST_CONSOLE_SHORT.
1.  In the `Services` tab, find the $MST_SERVICE_SHORT you want to connect to, and check
    it is marked as `Running`.
1.  Click the name of the $MST_SERVICE_SHORT you want to connect to see the connection
    information. Take a note of the `host`, `port`, and `password`.
1.  On your local system, at the command prompt, connect to the $MST_SERVICE_SHORT, using
    your own $MST_SERVICE_SHORT details:

    ```bash
    psql -x "postgres://tsdbadmin:<PASSWORD>@<HOSTNAME>:<PORT>/defaultdb?sslmode=require"
    ```

    If your connection is successful, you'll see a message like this, followed
    by the `psql` prompt:

    ```bash
    psql (13.3, server 13.4)
    SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
    Type "help" for help.
    defaultdb=>
    ```

</Procedure>

## Check that you have the $TIMESCALE_DB extension

$TIMESCALE_DB is provided as an extension to your $PG database, and it is
enabled by default when you create a new service on $MST_LONG You can check that the $TIMESCALE_DB extension is installed by using
the `\dx` command at the `psql` prompt. It looks like this:

```sql
defaultdb=> \dx

List of installed extensions
-[ RECORD 1 ]------------------------------------------------------------------
Name        | plpgsql
Version     | 1.0
Schema      | pg_catalog
Description | PL/pgSQL procedural language
-[ RECORD 2 ]------------------------------------------------------------------
Name        | timescaledb
Version     | 2.5.1
Schema      | public
Description | Enables scalable inserts and complex queries for time-series data

defaultdb=>
```

## Where to next

Now that you have your first service up and running, you can check out the
[$MST_LONG][mst-docs] section in the documentation, and
find out what you can do with it.

If you want to work through some tutorials to help you get up and running with
$TIMESCALE_DB and time-series data, check out the [tutorials][tutorials] section.

You can always [contact us][contact] if you need help working something out, or
if you want to have a chat.

[contact]: https://www.timescale.com/contact
[install-psql]: /integrations/:currentVersion:/psql/
[mst-docs]: /mst/:currentVersion:/
[tutorials]: /tutorials/:currentVersion:/
[mst-signup]: https://www.timescale.com/mst-signup
[mst-login]:https://portal.managed.timescale.com/login
