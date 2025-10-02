
import RESTPrereqs from "versionContent/_partials/_prereqs-cloud-account-only.mdx";
import CLIINSTALL from "versionContent/_partials/_devops-cli-install.mdx";

The $MCP_LONG provides programmatic access to your $CLOUD_LONG resources through Claude and other
AI assistants. $MCP_SHORT mirrors the functionality of $CLI_LONG and is integrated directly into the $CLI_SHORT binary.

You use $MCP_SHORT to manage $CLOUD_LONG resources including VPCs, services, read replicas, and related infrastructure.
$MCP_SHORT calls $REST_LONG to communicate with $CLOUD_LONG. 

This page shows you how to install and set up secure authentication for $MCP_LONG, then create your first 
service.

## Prerequisites

<RESTPrereqs />
* Claude installed locally and an API key

## Install and configure $MCP_SHORT

<Procedure>

<CLIINSTALL />

</Procedure>


## Use the 

Bla bla

<Procedure>

1. **Add the tiger-docs MCP server**
   ```shell
   claude mcp add --transport http tiger-docs https://mcp.tigerdata.com/docs
   ```




</Procedure>

And that is it, you are ready to use $CLI_LONG to manage your $SERVICE_SHORTs in $CLOUD_LONG.

## Commands

You can use the following commands with $CLI_LONG. For more information on each command, use the `-h` flag. For example: 
`tiger auth login -h`

| Command | Subcommand                       | Description                                                                                    |
|---------|----------------------------------|------------------------------------------------------------------------------------------------|
| auth    |                                  | Manage authentication and the credentials for your $ACCOUNT_LONG                               | 
|         | login                            | Create an authenticated connection to your $ACCOUNT_LONG                                       |
|         | logout                           | Remove the credentials used to create authenticated connections to $CLOUD_LONG                 |
|         | whoami                           | Show information about the current user                                                        |
| version |                                  | Show information about the currently installed version of $CLI_LONG                            |
| config  |                                  | Manage your $CLI_LONG configuration                                                            |
|         | show                             | Show the current configuration                                                                 |
|         | set `<key>` `<value>`            | Set a specific value in your configuration. For example, `tiger config set debug true`         |
|         | unset `<key>`                    | Clear the value of a configuration parameter. For example, `tiger config unset debug`          |
|         | reset                            | Reset the configuration to the defaults. This also logs you out from the current $PROJECT_LONG | 
| service |                                  | Manage the $SERVICE_LONGs in this $PROJECT_SHORT                                               |
|         | describe `<service-id>`          | Show detailed information about a specific $SERVICE_SHORT in this $PROJECT_SHORT               |
|         | list                             | List all the $SERVICE_SHORTs in this $PROJECT_SHORT                                            |
|         | create                           | Create a new $SERVICE_SHORT in this $PROJECT_SHORT                                             |
|         | delete `<service-id>`            | Delete a $SERVICE_SHORT from this $PROJECT_SHORT                                               |
|         | update-password `<service-id>`   | Update the password for a $SERVICE_SHORT                                                       |
| db      |                                  | Database operations and management                                                             |
|         | connection-string `<service-id>` | Retrieve the connection string for a $SERVICE_SHORT                                            |
|         | connect `<service-id>`           | Connect to a $SERVICE_SHORT                                                                    |
|         | test-connection `<service-id>`   | Test the connectivity to a $SERVICE_SHORT                                                      | 
| mcp     |                                  | Manage the $MCP_LONG                                                                           |
|         | start                            | Start the $MCP_LONG. This is the same as `tiger mcp start stdio`                               |
|         | start `stdio` \| `http`          | Start the $MCP_LONG with stdio or HTTP transport.                                              |

## Flags

You can use the following global flags with $CLI_LONG:

| Flag | Default         | Description                                                           |
|--|-----------------|-----------------------------------------------------------------------|
| --analytics             | `true`          | Set to `false` to disable usage analytics.                            |
| --config-dir string     | `.config/tiger` | Set the directory that holds `config.yaml`                            |
| --debug                 | No debugging    | Enable debug logging                                                  |
| -o, --output string     | table           | Set the output format. Options are `json`, `yaml`, or `table`               |
| --password-storage string | keyring         | Set the password storage method. Options are `keyring`, `pgpass`, or `none` |
| --project-id string      | -               | Set the $PROJECT_LONG to manage.                              | 
| --service-id string      | -               | Set the $SERVICE_LONG to manage. |



[rest-api-reference]: /api/:currentVersion:/api-reference/
[rest-api-credentials]: https://console.cloud.timescale.com/dashboard/settings
[get-project-id]: /integrations/:currentVersion:/find-connection-details/#find-your-project-and-service-id
[create-client-credentials]: /integrations/:currentVersion:/find-connection-details/#create-client-credentials
[curl]: https://curl.se/