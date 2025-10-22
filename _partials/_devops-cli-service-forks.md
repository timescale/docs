import CLIINSTALL from "versionContent/_partials/_devops-cli-install.mdx";

To manage development forks:

<Procedure> 

<CLIINSTALL />

1. **Fork the $SERVICE_SHORT**

   ```shell
    tiger service fork tgrservice --now --no-wait --name bob   
   ```
   By default a fork matches the resource of the parent $SERVICE_LONGs. For paid plans specify `--cpu` and/or `--memory` for dedicated resources.

   You see something like:

    ```terminaloutput
    🍴 Forking service 'tgrservice' to create 'bob' at current state...
    ✅ Fork request accepted!
    📋 New Service ID: <service_id>
    🔐 Password saved to system keyring for automatic authentication
    🎯 Set service '<service_id>' as default service.
    ⏳ Service is being forked. Use 'tiger service list' to check status.
    ┌───────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────┐
    │     PROPERTY      │                                              VALUE                                               │
    ├───────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────┤
    │ Service ID        │ <service_id>                                                                                       │
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
       tiger service delete <service_id>  
       ```
    1. Validate the $SERVICE_SHORT delete:

        ```terminaloutput
        Are you sure you want to delete service '<service_id>'? This operation cannot be undone.
        Type the service ID '<service_id>' to confirm:
        <service_id>
        ```
       You see something like:
        ```terminaloutput
        🗑️  Delete request accepted for service '<service_id>'.
        ✅ Service '<service_id>' has been successfully deleted.
        ```

</Procedure>