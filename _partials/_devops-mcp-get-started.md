
import RESTPrereqs from "versionContent/_partials/_prereqs-cloud-account-only.mdx";
import CLIINSTALL from "versionContent/_partials/_devops-cli-install.mdx";

The $MCP_LONG provides programmatic access to your $CLOUD_LONG resources through Claude and other
AI assistants. $MCP_SHORT mirrors the functionality of $CLI_LONG and is integrated directly into the $CLI_SHORT binary.

You use $MCP_SHORT to manage $CLOUD_LONG resources including VPCs, services, read replicas, and related infrastructure.
$MCP_SHORT calls $REST_LONG to communicate with $CLOUD_LONG. 

This page shows you how to install $CLI_SHORT and set up secure authentication for $MCP_SHORT, then manage the 
resources in your $ACCOUNT_LONG through the $MCP_LONG.

## Prerequisites

<RESTPrereqs />
* Claude installed locally and an API key

## Install and configure $MCP_SHORT

<Procedure>

<CLIINSTALL />

</Procedure>


## Manage the resources in your $ACCOUNT_LONG 

Bla bla

<Procedure>

1. **Add $MCP_SHORT to your claude environment**
   ```shell
   claude mcp add --transport http tiger-docs https://mcp.tigerdata.com/docs
   ```




</Procedure>

And that is it, you are ready to use $MCP_LONG to manage your $SERVICE_SHORTs in $CLOUD_LONG.

## Commands

You can use the following commands with $MCP_LONG.

| Command                       | Parameters | Required parameter | Description                                                               |
|-------------------------------|------------|--------------------|---------------------------------------------------------------------------|
| tiger_service_list            | None       | -                  | List all $SERVICE_LONGs in your current $PROJECT_LONG                     |
| tiger_service_show            | service_id | ✓                  | Show detailed information about a specific $SERVICE_SHORT                 |
| tiger_service_create          |            | ✗                  | Create a new $SERVICE_SHORT with a default name in your $PROJECT_LONG     |
|                               | name       | ✗                  | Set the $SERVICE_SHORT name to  `name`   s                                |
|                               | addons     | ✗                  |                                                                           |
|                               | region     | ✗                  |                                                                           |
|                               | cpu_memory | ✗                  |                                                                           |
|                               | replicas   | ✗                  |                                                                           |
|                               | free       | ✗                  |                                                                           |
|                               | wait       | ✗                  |                                                                           |
|                               | timeout    | ✗                  |                                                                           |
| tiger_service_update_password | service_id | ✓                  | Update the master password for the 'tsdbadmin' user of a database service |
|                               | password   | ✓                  |                                                                           |




[rest-api-reference]: /api/:currentVersion:/api-reference/
[rest-api-credentials]: https://console.cloud.timescale.com/dashboard/settings
[get-project-id]: /integrations/:currentVersion:/find-connection-details/#find-your-project-and-service-id
[create-client-credentials]: /integrations/:currentVersion:/find-connection-details/#create-client-credentials
[curl]: https://curl.se/