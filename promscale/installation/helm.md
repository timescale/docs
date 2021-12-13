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
*   **Optional:** `pgbackrest` configuration

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
    helm install --name my-release charts/timescaledb-single
    ```

</procedure>

You can provide arguments to the `helm install` command using this format:
`--set key=value[,key=value]`. For example, to install the  chart with backups
enabled, use this command:
```bash
helm install --name my-release charts/timescaledb-single --set backup.enabled=true
```

Alternatively, you can provide a YAML answers file that includes parameters for
installing the chart, like this:
```bash
helm install --name my-release -f myvalues.yaml charts/timescaledb-single
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
1.  Install the Promscale Helm chart:
    ```bash
    helm install my-release timescale/promscale
    ```
1.  Open the `values.yaml` configuration file, and locate the `connection`
    section. Add or edit this section with your TimescaleDB connection details:
    <terminal>

    <tab label='Database URI'>

    ```yaml
    connection:
      uri: <TIMESCALE_DB_URI>
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

</procedure>

You can provide arguments to the `helm install` command using this format:
`--set key=value[,key=value]`. For example, to install the chart with a secret you have already created, and an existing TimescaleDB service, use this command:
```bash
helm install --name my-release . \
      --set connectionSecretName="timescale-secret"
      --set connection.host="timescaledb.default.svc.cluster.local"
```

You can also provide the database URI as an argument to the `helm install` command, instead of editing the `values.yaml` configuration file, like this:
```bash
helm install --name my-release . \
      --set connection.uri="<URI>"
```

Alternatively, you can provide a YAML answers file that includes parameters for
installing the chart, like this:
```bash
helm install --name my-release -f myvalues.yaml .
```

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
1.  Configure the remote-read and write endpoints in Prometheus server configuration. As we are using 
    Prometheus helm chart configure this values in `values.yaml` file as:
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
