---
title: Connect with a stricter SSL mode
excerpt: Connect to Timescale Cloud with a stricter SSL mode
products: [cloud]
keywords: [security]
tags: [ssl]
---

# Connect with a stricter SSL mode

The default connection string for Timescale Cloud uses the SSL mode `require`.
If you want your connection client to verify the server's identity, you can
connect with an [SSL mode][ssl-modes] of `verify-ca` or `verify-full`. To do so,
you need to store a copy of the certificate chain where your connection tool can
find it.

This section provides instructions for setting up a stricter SSL connection.

## SSL certificates on Timescale Cloud

All connections to Timescale Cloud are encrypted. As part of the secure
connection protocol, the server proves its identity by providing clients with a
certificate. This certificate should be issued and signed by a well-known and
trusted Certificate Authority.

Because requesting a certificate from a Certificate Authority takes some time,
Timescale Cloud databases are initialized with a self-signed certificate. This
lets you start up a database immediately. After your service is started, a
signed certificate is requested behind the scenes. The new certificate is
usually received within 30 minutes. Your database certificate is then replaced
with almost no interruption. Connections are reset, and most clients reconnect
automatically.

With the signed certificate, you can switch your connections to a stricter SSL
mode, such as `verify-ca` or `verify-full`.

For more information on the different SSL modes, see the [PostgreSQL SSL mode
descriptions][ssl-modes].

## Connect to your database with a stricter SSL mode

To set up a stricter SSL connection:

1.  Generate a copy of your certificate chain and store it in the right location
1.  Change your Timescale Cloud connection string

<Procedure>

### Connecting to your database with a stricter SSL mode

1.  Use the `openssl` tool to connect to your Timescale Cloud service and get
    the certificate bundle. Store the bundle in a file called `bundle.crt`.

    Replace `$SERVICE_URL_WITH_PORT` with your Timescale Cloud connection URL:

    ```shell
    openssl s_client -showcerts -partial_chain -starttls postgres \
                 -connect $SERVICE_URL_WITH_PORT < /dev/null 2>/dev/null | \
                 awk '/BEGIN CERTIFICATE/,/END CERTIFICATE/{ print }' > bundle.crt
    ```

1.  Copy the bundle to your clipboard:

    <Terminal>

    <tab label="MacOS">

    ```shell
    pbcopy < bundle.crt
    ```

    </tab>

    <tab label="Linux">

    ```shell
    xclip -sel clip < bundle.crt
    ```

    </tab>

    <tab label="Windows">

    ```shell
    clip.exe < bundle.crt
    ```

    </tab>

    </Terminal>

1.  Navigate to <https://whatsmychaincert.com/>. This online tool generates a
    full certificate chain, including the root CA certificate, which is not
    included in the certificate bundle returned by the database.

1.  Paste your certificate bundle in the provided box.
    Check `Include Root Certificate`. Click `Generate Chain`.

1.  Save the downloaded certificate chain to `~/.postgresql/root.crt`.

1.  Change your Timescale Cloud connection string from `sslmode=require` to
    either `sslmode=verify-full` or `sslmode=verify-ca`. For example, to
    connect to your database with `psql`, run:

    ```shell
    psql "postgres://tsdbadmin@$SERVICE_URL_WITH_PORT/tsdb?sslmode=verify-full"
    ```

</Procedure>

## Verify certificate type used by your database

To check whether the certificate has been replaced yet, connect to your database
instance and inspect the returned certificate:

```shell
openssl s_client -showcerts -partial_chain -starttls postgres -connect <HOST>:<PORT> < /dev/null 2>/dev/null  | grep "ZeroSSL"
```

[ssl-modes]: https://www.postgresql.org/docs/current/libpq-ssl.html#LIBPQ-SSL-SSLMODE-STATEMENTS
