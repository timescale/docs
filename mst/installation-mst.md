---
title: Get started with Managed Service for TimescaleDB
nav-title: Managed Service for TimescaleDB
excerpt: Start a TimescaleDB instance on Managed Service for TimescaleDB
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

<Procedure>

## Sign in to Managed Service for TimescaleDB

1.  Sign up for a [Managed Service for TimescaleDB account][sign-up] with your
    name and email address. You do not need to provide payment details to
    get started. A confirmation email is sent to the email address you provide.
1.  Verify your email by clicking on the link in the email you received. Don't
    forget to check your spam folder in case the email ends up there.
1.  Sign in to your [Managed Service for TimescaleDB portal][mst-login] with the
    password you set:

    <img class="main-content__illustration"
    src="https://s3.amazonaws.com/assets.timescale.com/docs/images/mst-portal-noservices.png"
    alt="Managed Service for TimescaleDB Portal"/>

<Highlight type="important">
Your Managed Service for TimescaleDB trial includes up to US$300 credit for you
to use. This is enough to complete all our tutorials and run a few test projects
of your own.
</Highlight>

</Procedure>

## Create your first service

A service in Managed Service for TimescaleDB is a cloud instance on your chosen
cloud provider, which you can install your database on.

<Procedure>

### Creating your first service

1.  Sign in to your [Managed Service for TimescaleDB portal][mst-login].
1.  Click `Create a new service`, and complete these details:
    *   In the `Select Your Service` field, click `TimescaleDB`.
    *   In the `Select Your Cloud Service Provider` field, click your
        preferred provider.
    *   In the `Select Your Cloud Service Region` field, click your preferred
        server location. This is often the server that's physically closest
        to you.
    *   In the `Select Your Service Plan` field, click your preferred plan,
        based on the hardware configuration you require. If you are in your
        trial period, and just want to try the service out, or develop a proof
        of concept, we recommend the `Dev` plan, because it is the most
        cost-effective during your trial period.
1.  In the information bar on the right of the screen, review the settings you
    have selected for your service, and click `Create Service`. The service
    takes a few minutes to provision.

    <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/mst-new-service.png" alt="Create a new service in the Managed Service for TimescaleDB portal"/>

<Highlight type="important">
Your Managed Service for TimescaleDB trial includes up to US$300 credit for you
to use. This is enough to complete all our tutorials and run a few test projects
of your own.
</Highlight>

</Procedure>

## Connect to your service from the command prompt

When you have a service up and running, you can connect to it from your local
system using the `psql` command-line utility. This is the same tool you might
have used to connect to PostgreSQL before, but if you haven't installed it yet,
check out the [installing psql][install-psql] section.

<Procedure>

### Connecting to your service from the command prompt

1.  Sign in to your [Managed Service for TimescaleDB portal][mst-login].
1.  In the `Services` tab, find the service you want to connect to, and check
    it is marked as `Running`.
1.  Click the name of the service you want to connect to see the connection
    information. Take a note of the `host`, `port`, and `password`.
1.  On your local system, at the command prompt, connect to the service, using
    your own service details:

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

## Check that you have the TimescaleDB extension

TimescaleDB is provided as an extension to your PostgreSQL database, and it is
enabled by default when you create a new service on Managed Service for
TimescaleDB. You can check that the TimescaleDB extension is installed by using
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
[Managed Service for TimescaleDB][mst-docs] section in the documentation, and
find out what you can do with it.

If you want to work through some tutorials to help you get up and running with
TimescaleDB and time-series data, check out the [tutorials][tutorials] section.

You can always [contact us][contact] if you need help working something out, or
if you want to have a chat.

[contact]: https://www.timescale.com/contact
[install-psql]: /use-timescale/:currentVersion:/connecting/psql/
[mst-docs]: /mst/:currentVersion:/
[mst-login]: https://portal.managed.timescale.com
[sign-up]: https://www.timescale.com/timescale-signup
[tutorials]: /tutorials/:currentVersion:/
