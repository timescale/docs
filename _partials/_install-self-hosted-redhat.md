
import SelfHostedRedhatXPlatform from "versionContent/_partials/_install-self-hosted-redhat-x-platform.mdx";

<Procedure>

1. **Install the latest $PG packages**

    ```bash
    sudo yum install https://download.postgresql.org/pub/repos/yum/reporpms/EL-$(rpm -E %{rhel})-x86_64/pgdg-redhat-repo-latest.noarch.rpm
    ```

1.  **Add the $TIMESCALE_DB repository**

    ```bash
    sudo tee /etc/yum.repos.d/timescale_timescaledb.repo <<EOL
    [timescale_timescaledb]
    name=timescale_timescaledb
    baseurl=https://packagecloud.io/timescale/timescaledb/el/$(rpm -E %{rhel})/\$basearch
    repo_gpgcheck=1
    gpgcheck=0
    enabled=1
    gpgkey=https://packagecloud.io/timescale/timescaledb/gpgkey
    sslverify=1
    sslcacert=/etc/pki/tls/certs/ca-bundle.crt
    metadata_expire=300
    EOL
    ```

<SelfHostedRedhatXPlatform />


</Procedure>

[config]: /self-hosted/:currentVersion:/configuration/
