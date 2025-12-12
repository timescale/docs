import RESTPrereqs from "versionContent/_partials/_prereqs-cloud-account-only.mdx";
import CLIINSTALL from "versionContent/_partials/_devops-cli-install.mdx";
import CLIREF from "versionContent/_partials/_devops-cli-reference.mdx";
import NotSupportedAzure from "versionContent/_partials/_not-supported-for-azure.mdx";

$CLI_LONG is a command-line interface that you use to manage $CLOUD_LONG resources
including VPCs, services, read replicas, and related infrastructure. $CLI_LONG calls $REST_LONG to communicate with 
$CLOUD_LONG. 

This page shows you how to install and set up secure authentication for $CLI_LONG, then create your first 
service.

## Prerequisites

<RESTPrereqs />

<NotSupportedAzure />


## Install and configure $CLI_LONG

<Procedure>

<CLIINSTALL />

</Procedure>


## Create your first $SERVICE_LONG

Create a new $SERVICE_LONG using $CLI_LONG:

<Procedure>

1. **Submit a $SERVICE_SHORT creation request**

   By default, $CLI_LONG creates a $SERVICE_SHORT for you that matches your [$PRICING_PLAN][pricing-plans]:
   * **$FREE**: shared CPU/memory and the `time-series` and `ai` capabilities
   * **Paid $PRICING_PLAN**: 0.5 CPU and 2 GB memory with the `time-series` capability
   ```shell
   tiger service create
   ```
   To control the $SERVICE_SHORT configuration, use the [`service create` flags][cli-create-custom-service]. For 
   example, to create a free service if you are in a paid $PRICING_PLAN, call 
   `tiger service create --memory shared --cpu shared`.

   $CLOUD_LONG creates a Development environment for you. That is, no delete protection, high-availability, spooling or
   read replication. You see something like:
   ```terminaloutput
    🚀 Creating service 'db-11111' (auto-generated name)...
    ✅ Service creation request accepted!
    📋 Service ID: tgrservice 
    🔐 Password saved to system keyring for automatic authentication
    🎯 Set service 'tgrservice' as default service.
    ⏳ Waiting for service to be ready (wait timeout: 30m0s)...
    🎉 Service is ready and running!
   🔌 Run 'tiger db connect' to connect to your new service
   ┌───────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────┐
   │     PROPERTY      │                                              VALUE                                               │
   ├───────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────┤
   │ Service ID        │ tgrservice                                                                                       │
   │ Name              │ db-11111                                                                                         │
   │ Status            │ READY                                                                                            │
   │ Type              │ TIMESCALEDB                                                                                      │
   │ Region            │ us-east-1                                                                                        │
   │ CPU               │ 0.5 cores (500m)                                                                                 │
   │ Memory            │ 2 GB                                                                                             │
   │ Direct Endpoint   │ tgrservice.tgrproject.tsdb.cloud.timescale.com:39004                                             │
   │ Created           │ 2025-10-20 20:33:46 UTC                                                                          │
   │ Connection String │ postgresql://tsdbadmin@tgrservice.tgrproject.tsdb.cloud.timescale.com:0007/tsdb?sslmode=require │
   │ Console URL       │ https://console.cloud.timescale.com/dashboard/services/tgrservice                                │
   └───────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────┘
   ```
   This $SERVICE_SHORT is set as default by the $CLI_SHORT.

1. **Check the $CLI_SHORT configuration**
   ```shell
   tiger config show
   ```
   You see something like:
   ```terminaloutput
   api_url:     https://console.cloud.timescale.com/public/api/v1
   console_url: https://console.cloud.timescale.com
   gateway_url: https://console.cloud.timescale.com/api
   docs_mcp:       true
   docs_mcp_url:   https://mcp.tigerdata.com/docs
   project_id:  tgrproject
   service_id:  tgrservice
   output:      table
   analytics:   true
   password_storage: keyring
   debug:       false
   config_dir:  /Users/<username>/.config/tiger
   ```

</Procedure>

And that is it, you are ready to use $CLI_LONG to manage your $SERVICE_SHORTs in $CLOUD_LONG.

<CLIREF />

[pricing-plans]: /about/:currentVersion:/pricing-and-account-management/
[cli-create-custom-service]: /getting-started/:currentVersion:/get-started-devops-as-code/#commands
