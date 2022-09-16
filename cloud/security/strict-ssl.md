---
title: Connect with a stricter SSL mode
excerpt: Connect to Timescale Cloud with a stricter SSL mode
product: cloud
keywords: [security]
tags: [ssl]
---

# Connect with a stricter SSL mode

The default connection string for Timescale Cloud uses the SSL mode `require`.
If you want more security, you can connect with a SSL mode of `verify-ca` or
`verify-full`. To do so, you need to store a copy of the certificate chain where
your connection tool can find it.

This section provides instructions on setting up a stricter SSL connection.

## SSL certificates on Timescale Cloud

To spin up your service quickly, Timescale Cloud databases are started up with a
self-signed certificate. After your service is started, a signed certificate is
requested behind the scenes. When it's received, the certificate is replaced
with almost no interruption. Connections are reset, and most connection services
reconnect automatically.

With the signed certificate, you can switch your connections to a stricter SSL
mode, such as `verify-ca` or `verify-full`. These modes verify the certificate
chain.

For more information on the different SSL modes, see the [PostgreSQL SSL mode
descriptions][ssl-modes].

## Connect to your database with a stricter SSL mode

To set up a stricter SSL connection:

1.  Generate a copy of your certificate chain and store it in the right location
1.  Change your Timescale Cloud connection string

<procedure>

### Connecting to your database with a stricter SSL mode

1.  Use the `openssl` tool to connect to your Timescale Cloud service and get
    the certificate bundle. Store the bundle in a file called `bundle.crt`.

    Replace `$SERVICE_URL_WITH_PORT` with your Timescale Cloud connection URL:

    ```shell
    openssl s_client -showcerts -partial_chain -starttls postgres \
                 -connect $SERVICE_URL_WITH_PORT < /dev/null 2>/dev/null | \
                 awk '/BEGIN CERTIFICATE/,/END CERTIFICATE/{ print }' > bundle.crt
    ```

1.  Copy the bundle to your clipboard. On MacOS, you can run:

    ```shell
    pbcopy < bundle.crt
    ```

1.  Navigate to <https://whatsmychaincert.com/>.

1.  Paste your certificate bundle in the provided box. Check `Include Root
    Certificate`. Click `Generate Chain`.

1.  Save the downloaded certificate chain to `~/.postgresql/root.crt`.

1.  Change your Timescale Cloud connection string from `sslmode=require` to
    either `sslmode=verify-full` or `sslmode=verify-ca`. For example, to
    connect to your database with `psql`, run:

    ```shell
    psql "postgres://tsdbadmin@$SERVICE_URL_WITH_PORT/tsdb?sslmode=verify-full"
    ```

</procedure>

[ssl-modes]: https://www.postgresql.org/docs/current/libpq-ssl.html#LIBPQ-SSL-SSLMODE-STATEMENTS
