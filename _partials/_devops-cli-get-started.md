import RESTPrereqs from "versionContent/_partials/_prereqs-cloud-account-only.mdx";

$CLI_LONG is a command-line interface that you use to manage $CLOUD_LONG resources
including VPCs, services, read replicas, and related infrastructure. $CLI_LONG calls $REST_LONG to communicate with 
$CLOUD_LONG. 

This page shows you how to install and set up secure authentication for $CLI_LONG, then create your first 
service.

## Prerequisites

<RESTPrereqs />


## Install and configure $CLI_LONG

<Procedure>

1. ** Install $CLI_LONG**

   Use the Terminal to install the $CLI_SHORT: 
   <Tabs label="Install Tiger CLI" persistKey="os">

    <Tab title="Debian" label="debian">

    ```shell
    curl -s https://packagecloud.io/install/repositories/timescale/tiger-cli/script.deb.sh | sudo os=any dist=any bash
    sudo apt-get install tiger-cli
    ```
    
    </Tab>
    
    <Tab title="Ubuntu" label="ubuntu">

    ```shell
    curl -s https://packagecloud.io/install/repositories/timescale/tiger-cli/script.deb.sh | sudo bash
    sudo apt-get install tiger-cli
    ```
    </Tab>
    
    <Tab title="Red Hat" label="redhat">
   
    ```shell
    curl -s https://packagecloud.io/install/repositories/timescale/tiger-cli/script.rpm.sh | sudo os=rpm_any dist=rpm_any bash
    sudo yum install tiger-cli
    ```
   
    </Tab>
    
    <Tab title="Fedora" label="fedora">

    ```shell
    curl -s https://packagecloud.io/install/repositories/timescale/tiger-cli/script.rpm.sh | sudo bash
    sudo yum install tiger-cli
    ```
    
    </Tab>

    <Tab title="MacOs" label="macos">

    ```shell
    brew install --cask timescale/tap/tiger-cli
    ```

    </Tab>

    <Tab title="x-platform" label="xplatform">

    ```shell
    curl -fsSL https://tiger-cli-releases.s3.amazonaws.com/install/install.sh | sh
    ```

    </Tab>

    </Tabs>
 
1. **Set up API credentials**

   1. Log $CLI_LONG into your $CLOUD_LONG account
 
      ```shell
      tiger auth login
      ```
      $CLI_LONG opens $CONSOLE_SHORT in your browser. Login, then click `Authorize`.  

   1. Select a $PROJECT_LONG. 

      $CLI_LONG stores your authentication information locally in `~/.config/tiger/config.yaml`.
    
1. **Test your authenticated connection to $CLOUD_LONG by listing services**

    ```bash
    tiger service list
    ```

   This call returns something like:
    - No services:
      ```terminaloutput
      🏜️  No services found! Your project is looking a bit empty.
      🚀 Ready to get started? Create your first service with: tiger service create
      ```
    - One or more services:

      ```terminaloutput
      ┌────────────┬─────────────────────┬────────┬─────────────┬──────────────┬──────────────────┐
      │ SERVICE ID │        NAME         │ STATUS │    TYPE     │    REGION    │     CREATED      │
      ├────────────┼─────────────────────┼────────┼─────────────┼──────────────┼──────────────────┤
      │ tgrservice │ tiger-agent-service │ READY  │ TIMESCALEDB │ eu-central-1 │ 2025-09-25 16:09 │
      └────────────┴─────────────────────┴────────┴─────────────┴──────────────┴──────────────────┘
      ```

</Procedure>


## Create your first service

Create a new $SERVICE_LONG using $CLI_LONG with a secure configuration:

<Procedure>

1. **Submit a service creation request**
   ```shell
   tiger service create
   ```
   $CLOUD_LONG creates a `#dev` environment for you. You see something like:
   ```terminaloutput
    🚀 Creating service 'db-11111' (auto-generated name)...
    ✅ Service creation request accepted!
    📋 Service ID: happyservice 
    🔐 Password saved to system keyring for automatic authentication
    🎯 Set service 'happyservice' as default service.
    ⏳ Waiting for service to be ready (wait timeout: 30m0s)...
    ⏳ Service status: QUEUED...
    ⏳ Service status: QUEUED...
    ⏳ Service status: QUEUED...
    ⏳ Service status: QUEUED...
    🎉 Service is ready and running!
   ```
   The $SERVICE_SHORT configuration is stored by the $CLI_SHORT and this $SERVICE_SHORT is set as default.

1. **Check the $CLI_SHORT configuration**
   ```shell
   tiger config show
   ```
   You see something like:
   ```terminaloutput
    API URL:     https://console.cloud.timescale.com/public/api/v1
    Console URL: https://console.cloud.timescale.com
    Gateway URL: https://console.cloud.timescale.com/api
    Docs MCP:       true
    Docs MCP URL:   https://mcp.tigerdata.com/docs
    Project ID:  tgrproject
    Service ID:  tgrservice
    Output:      table
    Analytics:   true
    Password Storage: keyring
    Debug:       false
    Config Dir:  /Users/<username>/.config/tiger
   ```


</Procedure>

And that is it, you are ready to use $CLI_LONG to manage your $SERVICE_SHORTs in $CLOUD_LONG.

## Commands

You can use the following commands with $CLI_LONG. For more information on each command, use the `-h` flag. For example: 
`tiger auth login -h`

| Command | Subcommand                       | Description                                                                                    |
|---------|----------------------------------|------------------------------------------------------------------------------------------------|
| auth    |                                  | Manage authentication and the credentials for your $CLOUD_LONG account                         | 
|         | login                            | Create an authenticated connection to your $CLOUD_LONG account                                 |
|         | logout                           | Remove the credentials used to create authenticated connections to $CLOUD_LONG                 |
|         | whoami                           | Show information about the current user                                                        |
| version |                                  | Show information about the currently installed version of $CLI_LONG                            |
| config  |                                  | Manage your $CLI_LONG configuration                                                            |
|         | show                             | Show the current configuration                                                                 |
|         | set `<key>` `<value>`            | Set a specific value in your configuration. For example, `tiger config set debug true`         |
|         | unset `<key>`                    | Clear the value of a configuration parameter. For example, `tiger config unset debug`          |
|         | reset                            | Reset the configuration to the defaults. This also logs you out from the current $PROJECT_LONG | 
| service |                                  | Manage the $SERVICE_LONGs in this $PROJECT_SHORT                                               |
|         | describe `<service-id>`          | Show detailed information about a specific $SERVICE_SHORT in this $PROJECT_SHORT                      |
|         | list                             | List all the $SERVICE_SHORTs in this $PROJECT_SHORT                                                   |
|         | create                           | Create a new $SERVICE_SHORT in this $PROJECT_SHORT                                                    |
|         | delete `<service-id>`            | Delete a $SERVICE_SHORT from this $PROJECT_SHORT                                                      |
|         | update-password `<service-id>`   | Update the password for a $SERVICE_SHORT                                                       |
| db      |                                  | Database operations and management                                                             |
|         | connection-string `<service-id>` | Retrieve the connection string for a $SERVICE_SHORT                                            |
|         | connect `<service-id>`           | Connect to a $SERVICE_SHORT                                                                    |
|         | test-connection `<service-id>`   | Test the connectivity to a $SERVICE_SHORT                                                      | 
| mcp     |                                  | Manage the $MCP_LONG                                                                           |
|         | start                            | Start the $MCP_LONG                                                                            |
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