import PromscaleConnector from 'versionContent/_partials/_promscale-connector.mdx';

# Install Promscale on Debian or Ubuntu
You can install Promscale on any Debian or Ubuntu system where you have an
already installed and working Prometheus or OpenTelemetry environment.

## Install TimescaleDB and the Promscale extension
To use Promscale you need a TimescaleDB database, as well as the Promscale
extension. The Promscale extension contains support functions to improve
the performance of Promscale.

<procedure>

### Installing TimescaleDB and Promscale extension

1.  Install TimescaleDB following the instructions in the
    [TimescaleDB install page][tsdb-install-self-hosted]
1.  Install the Promscale extension:
    ```
    apt install promscale-extension-postgresql-14
    ```
    
</procedure>

## Install the Promscale connector

<PromscaleConnector />

    ```
       apt install promscale
    ```

[tsdb-install-self-hosted]: /install/:currentVersion:/self-hosted/
