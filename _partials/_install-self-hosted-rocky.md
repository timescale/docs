
import SelfHostedRocky from "versionContent/_partials/_install-self-hosted-redhat-rocky.mdx";

$COMPANY supports Rocky Linux 8 and 9 on amd64 only.

<Procedure>

1.  **Update your local repository list**

    ```bash
    sudo dnf update -y
    sudo dnf install -y epel-release
    ```

1. **Install the latest $PG packages**

    ```bash
    sudo dnf install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-9-x86_64/pgdg-redhat-repo-latest.noarch.rpm
    ```

1.  **Add the $TIMESCALE_DB repository**

    ```bash
    sudo tee /etc/yum.repos.d/timescale_timescaledb.repo <<EOL
    [timescale_timescaledb]
    name=timescale_timescaledb
    baseurl=https://packagecloud.io/timescale/timescaledb/el/9/\$basearch
    repo_gpgcheck=1
    gpgcheck=0
    enabled=1
    gpgkey=https://packagecloud.io/timescale/timescaledb/gpgkey
    sslverify=1
    sslcacert=/etc/pki/tls/certs/ca-bundle.crt
    metadata_expire=300
    EOL
    ```

1.  **Disable the built-in PostgreSQL module**

    This is for Rocky Linux 9 only. 

    ```bash
    sudo dnf module disable postgresql -y
    ```

<SelfHostedRocky />


</Procedure>

[config]: /self-hosted/:currentVersion:/configuration/
