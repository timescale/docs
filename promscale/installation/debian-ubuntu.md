import PromscaleConnector from 'versionContent/_partials/_promscale-connector.mdx';
import PromscalePgSupportedVersions from 'versionContent/_partials/_promscale-pg-supported-versions.mdx';

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
    ```bash
    apt install promscale-extension-postgresql-14
    ```
    <PromscalePgSupportedVersions />
    
</procedure>

## Install the Promscale connector 

<PromscaleConnector />

1.  If you are installing Promscale Connector on a different host, You have to setup
    the timescale package registry similar to TimecaleDB pre-install instructions.
1.  Install Promscale Connector:
    ```bash
    apt install promscale
    ```

[tsdb-install-self-hosted]: /install/:currentVersion:/self-hosted/
