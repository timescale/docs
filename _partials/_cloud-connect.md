When you have a service up and running, you can connect to it from your local
system using the `psql` command-line utility. If you've used PostgreSQL before,
you might already have `psql` installed. If not, check out the [installing
psql][install-psql] section.

<Procedure>

### Connecting to your service from the command prompt

1.  In the [Timescale portal][tsc-portal], at the `Services` tab, find the
    service you want to connect to, and check it is marked as `Running`.
1.  Click the name of the service you want to connect to see the connection
    information. Take a note of the `Service URL`.
1.  [](#)<Optional /> If you have not stored a copy of your password, you can
    reset it by navigating to the `Operations` tab, and clicking
    `Reset password`. You can choose your own password for the service, or allow
    Timescale to generate a secure password for you. Take a note of your new
    password.
1.  On your local system, at the command prompt, connect to the service using
    the service URL. When you are prompted, enter the password:

    ```bash
    psql -x "<SERVICE_URL>"
    Password for user tsdbadmin:
    ```

    If your connection is successful, you'll see a message like this, followed
    by the `psql` prompt:

    ```bash
    psql (13.3, server 12.8 (Ubuntu 12.8-1.pgdg21.04+1))
    SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
    Type "help" for help.
    tsdb=>
    ```

</Procedure>

[install-psql]: /use-timescale/:currentVersion:/integrations/query-admin/about-psql/
[tsc-portal]: https://console.cloud.timescale.com/
