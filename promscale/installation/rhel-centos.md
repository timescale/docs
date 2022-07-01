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
The Promscale connector consumes PromQL queries natively and fetches data
from TimescaleDB to execute them, while SQL queries go directly to TimescaleDB.
After you install TimescaleDB and the Promscale extension, you can 
install the Promscale connector using this command:
    ```bash
    yum install promscale
    ```

[tsdb-install-self-hosted]: /install/:currentVersion:/self-hosted/