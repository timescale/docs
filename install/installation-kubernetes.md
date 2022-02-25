# Install TimescaleDB on Kubernetes
You can install a TimescaleDB instance on any Kubernetes deployment. Use the `timescaledb-single` Helm chart to deploy a highly-available TimescaleDB database, and `timescaledb-multinode` to deploy a multi-node distributed TimescaleDB database. You can install TimescaleDB on Kubernetes deployed on:
* AWS EKS
* MicroK8s
* minikube. 

<highlight type="important">
Before you begin installing TimescaleDB, make sure you have installed:
* kubectl
* Helm
* Kubernetes Cluster
</highlight>

### Install the TimescaleDB Helm chart
Before you install the TimescaleDB Helm chart, you need to configure these
settings in the `values.yaml` configuration file:
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
helm install my-release timescale/timescaledb-single --set backup.enabled=true
```

Alternatively, you can provide a YAML file that includes parameters for
installing the chart, like this:
```bash
helm install my-release -f myvalues.yaml timescale/timescaledb-single
```

