# Promscale from source
You can install Promscale from source on any operating system. The Promscale
source files are available from our
[GitHub releases page][gh-promscale-download].

Before you begin, you must have an already installed and working Prometheus
environment. Additionally, you need a
[self-hosted TimescaleDB instance][tsdb-install-self-hosted] installed.

## Install TimescaleDB
Installing TimescaleDB to use with Promscale requires the TimescaleDB database,
as well as the Promscale extension. The Promscale  extension contains support
functions to improve performance of Promscale.  While Promscale runs without it,
it is strongly recommended that you install the Promscale extension.

<procedure>

### Build and Install TimescaleDB

1.  Install TimescaleDB following the instructions in the
    [TimescaleDB install page][tsdb-install-self-hosted]
1.  Compile and install the Promscale extension from source, it is available
    on the [Promscale extension page][promscale-extension]

</procedure>

## Install the Promscale pre-compiled binary
In this procedure, you download the Promscale binaries and run them.

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

## Install Prometheus pre-compiled binary
When you have installed the Promscale binary, you can install the Prometheus
pre-compiled binary.

You can configure Prometheus remote-write with our recommended configurations from [here][prometheus-config-tips] for optimal performance.

<procedure>

<highlight type="note">
In this procedure, make sure you replace the versions of Prometheus listed here
with the latest available version numbers.
</highlight>

1.  Download Prometheus:
    ```bash
    LATEST_VERSION=$(curl -s https://api.github.com/repos/prometheus/prometheus/releases/latest | grep "tag_name" | cut -d'"' -f4 | cut -c2- )
    curl -O -L "https://github.com/prometheus/prometheus/releases/download/v${LATEST_VERSION}/prometheus-${LATEST_VERSION}.linux-amd64.tar.gz"
    ```

1.  Decompress the tarball and change into the Prometheus directory:
    ```bash
    tar -xzvf prometheus-${LATEST_VERSION}.linux-amd64.tar.gz
    cd prometheus-${LATEST_VERSION}.linux-amd64
    ```

1.  Edit the `prometheus.yml` file to add Promscale as a `remote_write` and
    `remote_read` endpoint for Prometheus:
    ```yaml
    remote_write:
      - url: "http://<connector-address>:9201/write"
    remote_read:
      - url: "http://<connector-address>:9201/read"
        read_recent: true
    ```
    We highly recommend that you set `read_recent` to `true`, so that Prometheus
    queries data from Promscale for all PromQL queries.
1.  Run Prometheus:
    ```yaml
    ./prometheus
    ```
    Prometheus loads the configuration defined by the `prometheus.yml`
    configuration file that is in the same directory as the Prometheus
    executable file.

</procedure>


[gh-promscale-download]: https://github.com/timescale/promscale/releases
[tsdb-install-self-hosted]: timescaledb/:currentVersion:/how-to-guides/install-timescaledb/self-hosted/
[go-install]: https://golang.org/dl/
[prometheus-config-tips]: https://github.com/timescale/promscale/blob/master/docs/configuring_prometheus.md
[promscale-extension]: https://github.com/timescale/promscale_extension#promscale-extension
