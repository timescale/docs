# Install Promscale on Kubernetes
You can install Promscale on Kubernetes using Helm or using a manifest file.

## Install Promscale with Helm

Before you begin, you must have installed Helm. For more information, including
packages and installation instructions, see the
[Helm documentation][helm-install]

You can install Promscale using Helm charts. The Helm charts must be installed
in this order:
1.  Install the TimescaleDB Helm chart
1.  Install the Promscale Helm chart

### Install the TimescaleDB Helm chart
Before you install the TimescaleDB Helm chart, you need to configure these
settings in the [`values.yaml`][timescaledb-single-values-yaml] configuration file:
*   Credentials for the superuser, admin, and other users
*   TLS Certificates
*   **Optional:** `pgbackrest` [configuration][timescale-backups]

<highlight type="note">
If you do not configure the user credentials before you start, they are randomly
generated. When this happens, the `helm upgrade` command does not rotate the
credentials, to prevent breaking the database by changing the database
credentials instead it uses the same credentials that are generated during the
`helm install`.
</highlight>

By default, the `timescaledb-single` helm chart deploys TimescaleDB in 
high availability mode. By default, this creates three database replicas, 
which consumes three times the amount of disk space. Each database 
instance mounts to its own persistent volume claim (PVC). 

You can 
disable high availability mode by changing the `timescaledb-single` 
helm chart `replicaCount` values to `1` in [`values.yaml`][timescaledb-single-values-yaml].

<procedure>

#### Steps to disbale TimescaleDB High-Availability
1.  Download the default `values.yaml` of `timescaledb-single` helm chart from [here][timescaledb-single-values-yaml].
1.  In `values.yaml` change the default `replicaCount` from `3` to `1`. 
1.  In the next step while installing the `timescaledb-single` helm chart, use this `values.yaml` file with `-f` flag.

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
    helm install <MY_RELEASE> timescale/timescaledb-single
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
    MASTERPOD="$(kubectl get pod -o name --namespace <namespace> -l release=<releaseName>,role=master)"
    kubectl exec -i --tty --namespace default ${MASTERPOD} -- psql -U postgres
    CREATE DATABASE tsdb WITH OWNER postgres;
    ```
1.  Capture the `postgres` user password:
    ```bash
    echo $(kubectl get secret --namespace default tobs-credentials -o jsonpath="{.data.PATRONI_SUPERUSER_PASSWORD}" | base64 --decode)
    ```
1.  Download the Promscale
    `values.yaml` from [here][promscale-values-yaml], open the `values.yaml` configuration file, and locate the `connection`
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
    helm install my-release timescale/promscale -f values.yaml
    ```

    <highlight type="note">
    Replace `my-release` with the name of your choice
    </highlight>

</procedure>

## Install Promscale with a manifest file
This section includes instructions to install the Promscale Connector using a
manifest file. To deploy TimescaleDB on Kubernetes use
[helm charts][timescaledb-install-helm] instead. Alternatively, you can
[install TimescaleDB on a host][timescaledb-host-install].

<procedure>

#### Installing the Promscale Connector with a manifest
1.  Download the [template manifest file][template-manifest]:
    ```bash
    curl https://github.com/timescale/promscale/blob/master/deploy/static/deploy.yaml --output promscale-connector.yaml
    ```
1.  Edit the manifest and configure the TimescaleDB database details using the
    parameters starting with <PROMSCALE_DB>.
1.  Deploy the manifest:
    ```bash
    kubectl apply -f promscale-connector.yaml
    ```

</procedure>


[timescaledb-host-install]: promscale/:currentVersion:/installation/source#install-timescaledb
[timescaledb-install-helm]: promscale/:currentVersion:/installation/kubernetes#install-the-timescaledb-helm-chart
[helm-install]: https://helm.sh/docs/intro/install/
[promscale-values-yaml]: https://github.com/timescale/promscale/blob/master/deploy/helm-chart/values.yaml
[timescaledb-single-values-yaml]: https://github.com/timescale/timescaledb-kubernetes/blob/master/charts/timescaledb-single/values.yaml 
[timescale-backups]: https://github.com/timescale/timescaledb-kubernetes/tree/master/charts/timescaledb-single#create-backups-to-s3
[template-manifest]: https://github.com/timescale/promscale/blob/master/deploy/static/deploy.yaml
