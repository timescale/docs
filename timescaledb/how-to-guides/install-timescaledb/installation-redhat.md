## Install self-hosted TimescaleDB on Red Hat-based systems
You can host TimescaleDB yourself on your Red Hat, CentOS, or Fedora system.
These instructions use the `dnf` package manager on these
distributions:
*   Red Hat Enterprise Linux 7
*   Red Hat Enterprise Linux 8
*   CentOS 7
*   CentOS 8
*   Fedora 33
*   Fedora 34
*   Fedora 35


<highlight type="warning">
If you have already installed PostgreSQL using a method other than the `yum` or
`dnf` package manager, you could encounter errors following these instructions.
It is safest to remove any existing PostgreSQL installations before you begin.
If you want to keep your current PostgreSQL installation, do not install
TimescaleDB using this method. [Install from source](FIXME) instead.
</highlight>

<procedure>

### Installing self-hosted TimescaleDB on Red Hat-based systems
1.  At the command prompt, as root, add the PostgreSQL third party repository
    to get the latest PostgreSQL packages:
    <terminal>

    <tab label='Red Hat'>

    ```bash
    dnf install https://download.postgresql.org/pub/repos/yum/reporpms/EL-$(rpm -E %{rhel})-x86_64/pgdg-redhat-repo-latest.noarch.rpm
    ```

    </tab>

    <tab label="Fedora">

    ```bash
    dnf install https://download.postgresql.org/pub/repos/yum/reporpms/F-$(rpm -E %{fedora})-x86_64/pgdg-fedora-repo-latest.noarch.rpm
    ```

    </tab>

    <tab label="CentOS">

    ```bash
    dnf install https://download.postgresql.org/pub/repos/yum/reporpms/EL-$(rpm -E %{centos})-x86_64/pgdg-redhat-repo-latest.noarch.rpm
    ```

    </tab>

    </terminal>
1.  Create the Timescale repository:
    <terminal>

    <tab label='Red Hat'>

    ```bash
    tee /etc/yum.repos.d/timescale_timescaledb.repo <<EOL
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
    tee /etc/yum.repos.d/timescale_timescaledb.repo <<EOL
    [timescale_timescaledb]
    name=timescale_timescaledb
    baseurl=https://packagecloud.io/timescale/timescaledb/el/8/$basearch
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

    <tab label="CentOS">

    ```bash
    tee /etc/yum.repos.d/timescale_timescaledb.repo <<EOL
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

    </terminal>
1.  Update your local repository list:
    ```bash
    dnf update
    ```
1.  Install TimescaleDB:
    ```bash
    dnf install timescaledb-2-postgresql-14
    ```

</procedure>

When you have completed the installation, you need to configure your database so
that you can use it. The easiest way to do this is to run the `timescaledb-tune`
script, which is included with the `timescaledb-tools` package. For more
information, see the [configuration][config] section.


[config]: /how-to-guides/configuration/
