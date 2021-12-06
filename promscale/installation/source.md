# Promscale from source
You can install Promscale from source on any operating system. The Promscale
source files are available from our
[GitHub releases page][gh-promscale-download].

Before you begin, you must have an already installed and working Prometheus
environment. Additionally, you need a
[self-hosted TimescaleDB instance][tsdb-install-self-hosted] installed.

## Install Promscale from source
In this procedure, you download the Promscale source files and run them.

<procedure>

### Installing Promscale from source
1.  At the command prompt, as root, download the appropriate source files for
    your operating system:
    ```bash
    curl -L -o promscale https://github.com/timescale/promscale/releases/download/<VERSION>/<PROMSCALE_DISTRIBUTION>
    ```
1.  Grant executable permissions on the `promscale` directory:
    ```bash
    chmod +x promscale
    ```
1.  Run Promscale by providing the connection details for your TimescaleDB
    service:
    ```bash
    ./promscale --db-name <DBNAME> --db-password <DBPASSWORD> --db-ssl-mode allow
    ```

    <highlight type="note">
    In this example, Promscale is deployed with SSL allowed but not required. If
    you need SSL mode enabled, configure your TimescaleDB instance with SSL
    certificates and do not use `--db-ssl-mode` flag. Promscale authenticates
    using SSL by default.
    </highlight>

</procedure>

## Install the remote storage connector
When you have installed Promscale, you need to install the remote storage
connector, and configure Prometheus to use it.

Before you begin, make sure you have Go installed. For more information,
including packages and installation instructions, see the
[Go documentation][go-install].

<procedure>

### Installing the remote storage connector

1.  Clone the Promscale repository, and change into the new directory:
    ```bash
    git clone git@github.com:timescale/promscale.git
    cd ./promscale
    ```
1.  Install the Promscale Connector binary:
    ```bash
    go install
    ```
1.  Open the `prometheus.yml` configuration file, and add or edit these lines:
    ```yaml
    remote_write:
      - url: "http://<connector-address>:9201/write"
    remote_read:
      - url: "http://<connector-address>:9201/read"
        read_recent: true
    ```

    <highlight type="note">
    Setting `read_recent` to `true` ensures that Prometheus queries data from
    Promscale for all PromQL queries. This is highly recommended.
    </highlight>

</procedure>


[gh-promscale-download]: https://github.com/timescale/promscale/releases
[tsdb-install-self-hosted]: timescaledb/:currentVersion:/how-to-guides/install-timescaledb/self-hosted/
[go-install]: https://golang.org/dl/
