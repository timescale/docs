A service in Timescale is a cloud instance which contains your database.
Each service contains a single database, named `tsdb`.
You can connect to a service from your local system using the `psql`
command-line utility. If you've used PostgreSQL before, you might already have
`psql` installed. If not, check out the [installing psql][install-psql] section.

<Procedure>

### Create a Timescale service and connect to the service

1.  In the [Timescale portal][timescale-portal], click `Create service`.
1.  Click `Download the cheatsheet` to download an SQL file that contains the
    login details for your new service. You can also copy the details directly
    from this page. When you have copied your password,
    click `I stored my password, go to service overview` at the bottom of the page.

    When your service is ready to use, is shows a green `Running` label in the
    `Service Overview`. You also receive an email confirming that your service
    is ready to use.
1.  On your local system, at the command prompt, connect to the service using
    the `Service URL` from the SQL file that you downloaded. When you are
    prompted, enter the password:

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

[timescale-portal]: https://console.cloud.timescale.com/
[install-psql]: /use-timescale/:currentVersion:/integrations/query-admin/psql/
