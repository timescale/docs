When you have a service up and running, you can connect to it from your local
system using the `psql` command-line utility. If you've used PostgreSQL before,
you might already have `psql` installed. If not, check out the [installing
psql][install-psql] section.

<Procedure>

### Connecting to your service from the command prompt

1.  In the [Timescale portal][tsc-portal], at the `Services` tab, find the
    service you want to connect to, and check it is marked as `Running`.
1.  [](#)<Optional /> If you have not stored a copy of your password, you can
    reset it by navigating to the `Operations` tab, and clicking
    `Reset password`. You can choose your own password for the service, or allow
    Timescale to generate a secure password for you. Take a note of your new
    password.
1.  On your local system, at the command prompt, connect to the service using
    your unique connection string provided by Timescale:

    <CodeBlock canCopy={true} showLineNumbers={false} children={`
    psql "postgres://tsdbadmin:<PASSWORD>@<HOST>:<PORT>/tsdb?sslmode=require"
    `} />

    If your connection is successful, you'll see a message like this, followed
    by the `psql` prompt:

    <CodeBlock canCopy={false} showLineNumbers={true} children={`
    psql (14.5, server 15.3 (Ubuntu 15.3-1.pgdg22.04+1))
    SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
    Type "help" for help.
    tsdb=>
    `} />

</Procedure>

[install-psql]: /use-timescale/:currentVersion:/integrations/query-admin/psql/
[tsc-portal]: https://console.cloud.timescale.com/
