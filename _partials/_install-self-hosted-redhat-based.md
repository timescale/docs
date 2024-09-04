<Procedure>

1. **Install the latest PostgreSQL packages**

    <Terminal>

    <tab label='Red Hat'>

    ```bash
    sudo yum install https://download.postgresql.org/pub/repos/yum/reporpms/EL-$(rpm -E %{rhel})-x86_64/pgdg-redhat-repo-latest.noarch.rpm
    ```

    </tab>

    <tab label="Fedora">

    ```bash
    sudo yum install https://download.postgresql.org/pub/repos/yum/reporpms/F-$(rpm -E %{fedora})-x86_64/pgdg-fedora-repo-latest.noarch.rpm
    ```

    </tab>
    </Terminal>

1.  **Add the TimescaleDB repository**

    <Terminal>

    <tab label='Red Hat'>

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

    </tab>

    <tab label="Fedora">

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

    </tab>
    </Terminal>  

1.  **Update your local repository list**

    ```bash
    sudo yum update
    ```

1.  **Install TimescaleDB**

    ```bash
    sudo yum install timescaledb-2-postgresql-16 postgresql16
    ```

    <!-- hack until we have bandwidth to rewrite this linting rule -->

    <!-- markdownlint-disable TS007 -->
    <Highlight type="note">
    On Red Hat Enterprise Linux 8 and later, disable the built-in PostgreSQL module:
    
    `sudo dnf -qy module disable postgresql`
    </Highlight>

    <!-- markdownlint-enable TS007 -->
    
 1.  Initialize the PostgreSQL instance:

    ```bash
    sudo /usr/pgsql-16/bin/postgresql-16-setup initdb
    ```   

1.  **Tune your PostgreSQL instance for TimescaleDB**

    ```bash
    sudo timescaledb-tune --pg-config=/usr/pgsql-16/bin/pg_config 
    ```   

    This script is included with the `timescaledb-tools` package when you install TimescaleDB.
    For more information, see [configuration][config].

1.  **Enable and start PostgreSQL**

    ```bash
    sudo systemctl enable postgresql-16
    sudo systemctl start postgresql-16
    ```

1.  **Login to PostgreSQL as `postgres`**

    ```bash
    sudo -u postgres psql
    ```
    You are now in the psql shell. 
    
1. **Set the password for `postgres`**

    ```bash
    \password postgres
    ```

    When you have set the password, type `\q` to exit psql.

</Procedure>

[config]: /self-hosted/:currentVersion:/configuration/
