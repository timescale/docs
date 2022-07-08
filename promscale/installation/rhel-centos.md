import PromscaleConnector from 'versionContent/_partials/_promscale-connector.mdx';
import PromscalePgSupportedVersions from 'versionContent/_partials/_promscale-pg-supported-versions.mdx';
# Install Promscale on Red Hat or CentOS
You can install Promscale on a Red Hat or CentOS system, if you have an
already installed and working Prometheus or OpenTelemetry environment.

## Install TimescaleDB and the Promscale extension
To use Promscale, you need a TimescaleDB database, as well as the Promscale
extension. The Promscale extension contains support functions to improve
performance of Promscale.

<procedure>

### Installing TimescaleDB and the Promscale extension

1.  Install TimescaleDB following the instructions in the
    [TimescaleDB install page][tsdb-install-self-hosted]
1.  Install the Promscale extension:
    ```
    yum install promscale-extension-postgresql-14
    ```
    <PromscalePgSupportedVersions />  

</procedure>

## Install the Promscale Connector
<PromscaleConnector />

1. If you are installing Promscale Connector on a different host, You have to setup
   the timescale package registry similar to TimecaleDB pre-install instructions.
1. Install Promscale Connector
   ```bash
      yum install promscale
   ```

[tsdb-install-self-hosted]: /install/:currentVersion:/self-hosted/