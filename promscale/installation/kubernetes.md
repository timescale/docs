# Install Promscale on Kubernetes
You can install Promscale on Kubernetes using Helm or using a manifest file.

## Install Promscale with Helm
You can install Promscale using Helm charts.

Before you begin, you must have installed Helm. For more information, including
packages and installation instructions, see the
[Helm documentation][helm-install].

The Helm charts must be installed
in this order:

1. Install the TimescaleDB Helm chart
1. Install the Promscale Helm chart

### Install the TimescaleDB Helm chart
Before you install the TimescaleDB Helm chart, you need to configure these
settings in the [`values.yaml`][timescaledb-single-values-yaml] configuration file:

* [Credentials for the superuser, admin, and other users][timescaledb-helm-values-creds]
* [TLS Certificates][timescaledb-helm-values-certs]
* **Optional:** `pgbackrest` [configuration][timescale-backups]

<highlight type="note">
If you do not configure the user credentials before you start, they are randomly
generated. When this happens, the `helm upgrade` command does not rotate the
credentials, to prevent breaking the database by changing the database
credentials instead it uses the same credentials that are generated during the
`helm install`.
</highlight>

By default, the `timescaledb-single` Helm chart deploys TimescaleDB in
high availability mode. This creates three database replicas,
which consumes three times the amount of disk space. Each database
instance mounts to its own persistent volume claim (PVC).

You can turn off high availability mode by changing the value of `replicaCount`
to `1` in
[`values.yaml`][timescaledb-single-values-yaml].

<procedure>

#### Disabling TimescaleDB high availability mode
1.  Download the default [`values.yaml`][timescaledb-single-values-yaml] file for the `timescaledb-single` Helm chart.
1.  In `values.yaml`, change the default `replicaCount` from `3` to `1`.
1.  Use this `values.yaml` file with the `-f` flag when installing the `timescaledb-single` Helm chart.
    For installation instructions, see [the procedures for installing the Helm chart](#installing-the-timescaledb-helm-chart).

</procedure>


<procedure>

#### Installing the TimescaleDB Helm chart
1.  Add the TimescaleDB Helm chart repository:
    ```bash
    helm repo add timescale 'https://charts.timescale.com'
    ```
1.  Check that the repository is up to date:
    ```bash
    helm repo update
    ```
1.  Install the TimescaleDB Helm chart, using a release name of your choice:
    ```bash
    helm install <RELEASE_NAME> timescale/timescaledb-single
    ```

</procedure>

You can provide arguments to the `helm install` command using this format:
`--set key=value[,key=value]`. For example, to install the  chart with backups
enabled, use this command:
```bash
helm install <RELEASE_NAME> timescale/timescaledb-single --set backup.enabled=true
```

Alternatively, you can provide a YAML file that includes parameters for
installing the chart, like this:
```bash
helm install <RELEASE_NAME> -f myvalues.yaml timescale/timescaledb-single
```

### Install the Promscale Helm chart
When you have your TimescaleDB Helm chart installed, you can install the
Promscale Helm chart. Promscale needs to access your TimescaleDB database. You
can provide the database URI, or specify connection parameters.

<procedure>

#### Installing the Promscale Helm chart
1.  Add the TimescaleDB Helm chart repository:
    ```bash
    helm repo add timescale 'https://charts.timescale.com'
    ```
1.  Check that the repository is up to date:
    ```bash
    helm repo update
    ```
1.  Create a database called `tsdb` for Promscale data:
    ```bash
    kubectl exec -i --tty $(kubectl get pod -o name --namespace <NAMESPACE> -l role=master,release=<RELEASE_NAME>) -- psql -U postgres
    CREATE DATABASE tsdb WITH OWNER postgres;
    \q
    ```
1.  Capture the `postgres` user password:
    ```bash
    echo $(kubectl get secret --namespace default tobs-credentials -o jsonpath="{.data.PATRONI_SUPERUSER_PASSWORD}" | base64 --decode)
    ```
1.  Download the Promscale
    [values.yaml][promscale-values-yaml], and update the `connection` section with your TimescaleDB connection details.
    section. Add or edit this section with your TimescaleDB connection details:
    <terminal>

    <tab label='Database URI'>

    ```yaml
    connection:
      uri: postgres://<username>:<password>@<host>:<port>/<dbname>?sslmode=require
    ```

    </tab>

    OR

    <tab label="Connection parameters">

    ```yaml
    connection:
      user: postgres
      password: ""
      host: <RELEASE_NAME>.<NAMESPACE>.svc.cluster.local
      port: 5432
      sslMode: require
      dbName: tsdb
    ```
    </tab>

    </terminal>

1.  Install the Promscale Helm chart:
    ```bash
    helm install <RELEASE_NAME> timescale/promscale -f values.yaml
    ```

    <highlight type="note">
    Replace `&lt;RELEASE_NAME&gt;` with the name of your choice
    </highlight>

</procedure>

## Install Promscale with a manifest file
This section includes instructions to install the Promscale Connector using a
manifest file. To deploy TimescaleDB on Kubernetes use
[helm charts](https://docs.timescale.com/promscale/latest/installation/kubernetes/#install-promscale-with-helm) instead. Alternatively, you can
[install TimescaleDB on a host](https://docs.timescale.com/promscale/latest/installation/source/#install-timescaledb).

<procedure>

#### Installing the Promscale Connector with a manifest
1.  Download the [template manifest file][template-manifest]:
    ```bash
    curl https://raw.githubusercontent.com/timescale/promscale/0.12.1/deploy/static/deploy.yaml --output promscale-connector.yaml
    ```
1.  Edit the manifest and configure the TimescaleDB database details using the
    parameters starting with <PROMSCALE_DB>.
1.  Deploy the manifest:
    ```bash
    kubectl apply -f promscale-connector.yaml
    ```

</procedure>

After you have installed Promscale, you can ingest data.
For instructions, see the [send data][send-data] section.

[timescaledb-host-install]: promscale/:currentVersion:/installation/source#install-timescaledb
[timescaledb-install-helm]: promscale/:currentVersion:/installation/kubernetes#install-the-timescaledb-helm-chart
[helm-install]: https://helm.sh/docs/intro/install/
[promscale-values-yaml]: https://github.com/timescale/promscale/blob/master/deploy/helm-chart/values.yaml
[timescaledb-single-values-yaml]: https://github.com/timescale/timescaledb-kubernetes/blob/master/charts/timescaledb-single/values.yaml
[timescale-backups]: https://github.com/timescale/timescaledb-kubernetes/tree/master/charts/timescaledb-single#create-backups-to-s3
[template-manifest]: https://github.com/timescale/promscale/blob/0.12.1/deploy/static/deploy.yaml
[timescaledb-helm-values-creds]: https://github.com/timescale/timescaledb-kubernetes/blob/master/charts/timescaledb-single/values.yaml#L33
[timescaledb-helm-values-certs]: https://github.com/timescale/timescaledb-kubernetes/blob/master/charts/timescaledb-single/values.yaml#L45
[send-data]: /promscale/:currentVersion:/send-data/
