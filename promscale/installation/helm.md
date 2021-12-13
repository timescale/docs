# Install Promscale with Helm
You can install Promscale using Helm charts. The Helm charts must be installed in this order:

1.  Install the TimescaleDB Helm chart
1.  Install the Promscale Helm chart
1.  Install the Prometheus Helm chart

Before you begin, you must have installed Helm. For more information, including
packages and installation instructions, see the [Helm documentation][helm-install]

## Install the TimescaleDB Helm chart
Before you install the TimescaleDB Helm chart, you need to configure these
settings in the `values.yaml` configuration file:
*   Credentials for the superuser, admin, and other users
*   TLS Certificates
*   **Optional:** `pgbackrest` [configuration][timescale-backups]

<highlight type="note">
If you do not configure the user credentials before you start, they are randomly generated. When this happens, the `helm update` command does not rotate the credentials, to prevent breaking the database.
</highlight>

<procedure>

### Installing the TimescaleDB Helm chart
1.  Add the TimescaleDB Helm chart repository:
    ```bash
    helm repo add timescale 'https://charts.timescale.com'
    ```
1.  Check that the repository is up to date:
    ```bash
    helm repo update
    ```
1.  Install the TimescaleDB Helm chart:
    ```bash
    helm install my-release charts/timescaledb-single
    ```

</procedure>

You can provide arguments to the `helm install` command using this format:
`--set key=value[,key=value]`. For example, to install the  chart with backups
enabled, use this command:
```bash
helm install my-release charts/timescaledb-single --set backup.enabled=true
```

Alternatively, you can provide a YAML file that includes parameters for
installing the chart, like this:
```bash
helm install my-release -f myvalues.yaml charts/timescaledb-single
```

## Install the Promscale Helm chart
When you have your TimescaleDB Helm chart installed, you can install the
Promscale Helm chart. Promscale needs to access your TimescaleDB database. You
can provide the database URI, or specify connection parameters.

<procedure>

### Installing the Promscale Helm chart
1.  Add the TimescaleDB Helm chart repository:
    ```bash
    helm repo add timescale 'https://charts.timescale.com'
    ```
1.  Check that the repository is up to date:
    ```bash
    helm repo update
    ```
1.  Open the `values.yaml` configuration file, download the tobs 
    `values.yaml` from [here][tobs-values-yaml] and locate the `connection`
    section. Add or edit this section with your TimescaleDB connection details:
    <terminal>

    <tab label='Database URI'>

    ```yaml
    connection:
      uri: postgres://<username>:<password>@<host>:<port>/<dbname>?sslmode=require
    ```

    </tab>

    <tab label="Connection parameters">

    ```yaml
    connection:
      user: postgres
      password: ""
      host: db.timescale.svc.cluster.local
      port: 5432
      sslMode: require
      dbName: timescale
    ```
    </tab>
    </terminal>

1.  Install the Promscale Helm chart:
    ```bash
    helm install my-release timescale/promscale -f <values.yaml>
    ```

</procedure>

## Install the Prometheus Helm chart
When you have installed the TimescaleDB and Promscale Helm charts, you can install the Prometheus Helm chart.

<procedure>

### Installing the Prometheus Helm chart
1.  Add the Prometheus community Helm chart repository:
    ```bash
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    ```
1.  Check that the repository is up to date:
    ```bash
    helm repo update
    ```
1.  Configure the remote-read and write endpoints in Prometheus server  configuration. As we are using Prometheus helm chart configure this values in `values.yaml`, download the `values.yaml` from [here][prometheus-values-yaml], locate the `server` section and configure the file as:
    ```bash
    server:
      remote_write:
        - url: "http://promscale:9201/write"
      remote_read:
        - url: "http://promscale:9201/read"
          read_recent: true
     ```
1.  Install the Prometheus Helm chart:
    ```bash
    helm install [RELEASE_NAME] prometheus-community/prometheus -f values.yaml
    ```

</procedure>


[helm-install]: https://helm.sh/docs/intro/install/
[tobs-values-yaml]: https://github.com/timescale/tobs/blob/master/chart/values.yaml
[prometheus-values-yaml]: https://github.com/prometheus-community/helm-charts/blob/main/charts/prometheus/values.yaml
[timescale-backups]: https://github.com/timescale/timescaledb-kubernetes/tree/master/charts/timescaledb-single#create-backups-to-s3