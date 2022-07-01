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
    
</procedure>


## Install the Promscale connector
The Promscale connector understands PromQL queries natively and fetches data
from TimescaleDB to execute them, while SQL queries go directly to TimescaleDB.
After you install TimescaleDB and Promscale extension, install Promscale
connector.

<procedure>

1.  Install Promscale connector
    ```bash
    yum install promscale
    ```

</procedure>

[tsdb-install-self-hosted]: /install/:currentVersion:/self-hosted/