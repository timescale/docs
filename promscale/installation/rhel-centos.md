# Install Promscale on Redhat or CentOS
This page explains how to install Promscale, get the service up and running on your Redhat or CentOS system, and also describes the installation package details.

Before you begin, you must have an already installed and working Prometheus or OpenTelemetry environment.

## Install TimescaleDB
Installing TimescaleDB to use with Promscale requires the TimescaleDB database,
as well as the Promscale extension. The Promscale extension contains support
functions to improve performance of Promscale.

<procedure>

### Install TimescaleDB and Promscale extension

1.  Install TimescaleDB following the instructions in the
    [TimescaleDB install page][tsdb-install-self-hosted]
1.  Install Promscale extension
    ```
    yum install -y promscale-extension-postgresql-14
    ```
</procedure>


## Install the Promscale connector
By now as we installed TimescaleDB and Promscale extension, now lets install
Promscale connector

<procedure>

1.  Install Promscale connector
    ```bash
    yum install promscale
    ```

</procedure>

[tsdb-install-self-hosted]: timescaledb/:currentVersion:/how-to-guides/install-timescaledb/self-hosted/