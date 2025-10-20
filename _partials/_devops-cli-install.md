1. ** Install $CLI_LONG**

   Use the terminal to install the $CLI_SHORT:
   <Tabs label="Install Tiger CLI" persistKey="os">

    <Tab title="Debian" label="debian">

    ```shell
    curl -s https://packagecloud.io/install/repositories/timescale/tiger-cli/script.deb.sh | sudo os=any dist=any bash
    sudo apt-get install tiger-cli
    ```

    </Tab>

    <Tab title="Ubuntu" label="ubuntu">

    ```shell
    curl -s https://packagecloud.io/install/repositories/timescale/tiger-cli/script.deb.sh | sudo os=any dist=any bash
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
    curl -s https://packagecloud.io/install/repositories/timescale/tiger-cli/script.rpm.sh | sudo os=rpm_any dist=rpm_any bash
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

    1. Log $CLI_LONG into your $ACCOUNT_LONG

       ```shell
       tiger auth login
       ```
       $CLI_LONG opens $CONSOLE_SHORT in your browser. Login, then click `Authorize`.

    1. Select a $PROJECT_LONG.

       ```terminaloutput
       Auth URL is: https://console.cloud.timescale.com/oauth/authorize?client_id=lotsOfURLstuff
       Opening browser for authentication...
       Select a project:
 
       > 1. Tiger Project (tgrproject)
       2. YourCompany (Company wide project) (cpnproject)
       3. YourCompany Department (dptproject)
 
       Use ↑/↓ arrows or number keys to navigate, enter to select, q to quit  
       ```  
       If only one $PROJECT_SHORT is associated with your $ACCOUNT_SHORT, this step is not shown.

       Where possible, $CLI_LONG stores your authentication information in the system keychain/credential manager.
       If that fails, the key is stored in `~/.config/tiger/api-key` with restricted file permissions (600).
       $CLI_LONG stores your configuration in `~/.config/tiger/config.yaml`.

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


[rest-api-reference]: /api/:currentVersion:/api-reference/
[rest-api-credentials]: https://console.cloud.timescale.com/dashboard/settings
[get-project-id]: /integrations/:currentVersion:/find-connection-details/#find-your-project-and-service-id
[create-client-credentials]: /integrations/:currentVersion:/find-connection-details/#create-client-credentials
[curl]: https://curl.se/