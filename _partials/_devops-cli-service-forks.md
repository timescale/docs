import CLIINSTALL from "versionContent/_partials/_devops-cli-install.mdx";

Modern development is highly iterative. Developers and AI agents need safe spaces to test changes before deploying them
to production. Forkable $SERVICE_SHORTs make this natural and easy. Spin up a branch, run your test, throw it away, or
merge it back.

Forks are a powerful way to share production-scale data safely. BI and data science teams often need access to real
datasets to build models or generate insights. With forkable $SERVICE_SHORTs, you easily create instant, zero-copy
branches of a production $SERVICE_SHORT that is isolated from production, but contains all the data needed for
analysis. You share this fork with your analytics teams in seconds. This dramatically reduces friction getting insights
from live data.

Forks are fully independent. You can query them, run migrations, add indexes, or test new features.

To manage development forks:

<Procedure> 

<CLIINSTALL />

1. **Fork the $SERVICE_SHORT**

   ```shell
    tiger service fork  tgrservice --now --no-wait --name bob   
   ```
   You see something like:

    ```terminaloutput
    🍴 Forking service 'tgrservice' to create 'bob' at current state...
    ✅ Fork request accepted!
    📋 New Service ID: trgbobserv
    🔐 Password saved to system keyring for automatic authentication
    🎯 Set service 'trgbobserv' as default service.
    ⏳ Service is being forked. Use 'tiger service list' to check status.
    ┌───────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────┐
    │     PROPERTY      │                                              VALUE                                               │
    ├───────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────┤
    │ Service ID        │ trgbobserv                                                                                       │
    │ Name              │ bob                                                                                              │
    │ Status            │                                                                                                  │
    │ Type              │ TIMESCALEDB                                                                                      │
    │ Region            │ eu-central-1                                                                                     │
    │ CPU               │ 0.5 cores (500m)                                                                                 │
    │ Memory            │ 2 GB                                                                                             │
    │ Direct Endpoint   │ <service-id>.<project-id>.tsdb.cloud.timescale.com:<port>                                             │
    │ Created           │ 2025-10-08 13:58:07 UTC                                                                          │
    │ Connection String │ postgresql://tsdbadmin@<service-id>.<project-id>.tsdb.cloud.timescale.com:<port>/tsdb?sslmode=require │
    └───────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────┘
   ```

1. **When you are done, delete your forked $SERVICE_SHORT**

    1. Use the CLI to request $SERVICE_SHORT delete:

       ```shell
       tiger service delete trgbobserv  
       ```
    1. Validate the $SERVICE_SHORT delete:

        ```terminaloutput
        Are you sure you want to delete service 'trgbobserv'? This operation cannot be undone.
        Type the service ID 'trgbobserv' to confirm:
        trgbobserv
        ```
       You see something like:
        ```terminaloutput
        🗑️  Delete request accepted for service 'trgbobserv'.
        ⏳ Waiting for service 'trgbobserv' to be deleted
        ✅ Service 'trgbobserv' has been successfully deleted.
        ```

</Procedure>