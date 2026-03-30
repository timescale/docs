1. **Install $CLI_LONG**

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

    <Tab title="MacOS" label="macos">

    ```shell
    brew install --cask timescale/tap/tiger-cli
    ```

    </Tab>

    <Tab title="Windows PowerShell" label="windows">

    ```shell
    irm https://cli.tigerdata.com/install.ps1 | iex
    ```

    </Tab>

    <Tab title="x-platform" label="xplatform">

    ```shell
    curl -fsSL https://cli.tigerdata.com | sh
    ```

    </Tab>

    </Tabs>
 
1. **Set up API credentials**

   1. Log $CLI_LONG into your $ACCOUNT_LONG:
 
      ```shell
      tiger auth login
      ```
      $CLI_LONG opens $CONSOLE_SHORT in your browser. Log in, then click `Authorize`. 

      You can have a maximum of 10 active client credentials. If you get an error, open [credentials][rest-api-credentials]
      and delete an unused credential. 

   1. Select a $PROJECT_LONG:

      ```terminaloutput
      Auth URL is: https://console.cloud.tigerdata.com/oauth/authorize?client_id=lotsOfURLstuff
      Opening browser for authentication...
      Select a project:

      > 1. Tiger Project (tgrproject)
      2. YourCompany (Company wide project) (cpnproject)
      3. YourCompany Department (dptproject)

      Use ↑/↓ arrows or number keys to navigate, enter to select, q to quit  
      ```  
      If only one $PROJECT_SHORT is associated with your $ACCOUNT_SHORT, this step is not shown. 

      Where possible, $CLI_LONG stores your authentication information in the system keychain/credential manager. 
      If that fails, the credentials are stored in `~/.config/tiger/credentials` with restricted file permissions (600).
      By default, $CLI_LONG stores your configuration in `~/.config/tiger/config.yaml`.
    
1. **Test your authenticated connection to $CLOUD_LONG by listing $SERVICE_SHORTs**

    ```bash
    tiger service list
    ```

   This call returns something like:
    - No $SERVICE_SHORTs:
      ```terminaloutput
      🏜️  No services found! Your project is looking a bit empty.
      🚀 Ready to get started? Create your first service with: tiger service create
      ```
    - One or more $SERVICE_SHORTs:

      ```terminaloutput
      ┌────────────┬─────────────────────┬────────┬─────────────┬──────────────┬──────────────────┐
      │ SERVICE ID │        NAME         │ STATUS │    TYPE     │    REGION    │     CREATED      │
      ├────────────┼─────────────────────┼────────┼─────────────┼──────────────┼──────────────────┤
      │ tgrservice │ tiger-agent-service │ READY  │ TIMESCALEDB │ eu-central-1 │ 2025-09-25 16:09 │
      └────────────┴─────────────────────┴────────┴─────────────┴──────────────┴──────────────────┘
      ```

[rest-api-credentials]: https://console.cloud.tigerdata.com/dashboard/settings
