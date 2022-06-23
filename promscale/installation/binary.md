# Install Promscale using binary
You can install Promscale from source on any operating system. The Promscale
source files are available from our
[GitHub releases page][gh-promscale-download].

Before you begin, you must have an already installed and working Prometheus
or OpenTelemetry collector environment. Additionally, you need a
[self-hosted TimescaleDB instance][tsdb-install-self-hosted] installed.

## Install TimescaleDB
Installing TimescaleDB to use with Promscale requires the TimescaleDB database,
as well as the Promscale extension. The Promscale  extension contains support
functions to improve performance of Promscale.

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
    your operating system (get the URL from the [GitHub repository releases page][releases]):
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
    ./promscale --db-host <DB_HOSTNAME> --db-port <DB_PORT> --db-name <DBNAME> --db-password <DBPASSWORD> --db-ssl-mode allow
    ```

    <highlight type="note">
    In this example, Promscale is deployed with SSL allowed but not required. If
    you need SSL mode enabled, configure your TimescaleDB instance with SSL
    certificates and do not use `--db-ssl-mode` flag. Promscale authenticates
    using SSL by default.
    </highlight>

</procedure>

[gh-promscale-download]: https://github.com/timescale/promscale/releases
[tsdb-install-self-hosted]: timescaledb/:currentVersion:/how-to-guides/install-timescaledb/self-hosted/
[promscale-extension]: https://github.com/timescale/promscale_extension#promscale-extension
[releases]: https://github.com/timescale/promscale/releases/
