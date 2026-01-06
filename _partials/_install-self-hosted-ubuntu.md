import SelfHostedDebianStart from "versionContent/_partials/_install-self-hosted-debian-based-start.mdx";
import SelfHostedDebianEnd from "versionContent/_partials/_install-self-hosted-debian-based-end.mdx";

<Procedure>

<SelfHostedDebianStart />

1.  **Add the $TIMESCALE_DB package**

    ```bash
    echo "deb https://packagecloud.io/timescale/timescaledb/ubuntu/ $(lsb_release -c -s) main" | sudo tee /etc/apt/sources.list.d/timescaledb.list
    ```

1.  **Install the $TIMESCALE_DB GPG key**

    ```bash
    wget --quiet -O - https://packagecloud.io/timescale/timescaledb/gpgkey | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/timescaledb.gpg
    ```
    
    For Ubuntu 21.10 and earlier use the following command:
    ```bash
    wget --quiet -O - https://packagecloud.io/timescale/timescaledb/gpgkey | sudo apt-key add -
    ```

<SelfHostedDebianEnd />


</Procedure>
