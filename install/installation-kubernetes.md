# Install TimescaleDB on Kubernetes
You can install a TimescaleDB instance on any Kubernetes deployment. Use the `timescaledb-single` Helm chart to deploy a highly-available TimescaleDB database, and `timescaledb-multinode` to deploy a multi-node distributed TimescaleDB database. You can install TimescaleDB on Kubernetes deployed on:
* [AWS Elastic Kubernetes Service][aws-eks]
* [MicroK8s][microk8s-install]
* [minikube][minikube-install]

<highlight type="important">
Before you begin installing TimescaleDB on a Kubernetes deployment, make sure you have installed:

* [kubectl][kubectl-install]
* [Helm][helm-install]
* [Kubernetes Cluster][kubernetes-install]
* (Optional) Create a YAML file that specifies the values for the parameters that are provided while installing the chart. For example, you can create a new `myvalues.yaml` file. For details about the parameters you can set, see  the [Administrator Guide].

</highlight>

## Install TimescaleDB using a Helm chart
You can install TimescaleDB on Kubernetes using a Helm chart with the default `values.yaml`.
When you use the default `values.yaml`, the user credentials are randomly generated during the installation. When you use the `helm upgrade` command it does not rotate the credentials, to prevent breaking the database by changing the database credentials instead it uses the same credentials that are generated during the `helm install`.
<procedure>

### Installing TimescaleDB using a Helm chart
1.  Add the TimescaleDB Helm chart repository:
    ```bash
    helm repo add timescale 'https://charts.timescale.com'
    ```
1.  Verify that the repository is up to date:
    ```bash
    helm repo update
    ```
1.  Install the TimescaleDB Helm chart, by replacing `<my_name>` with a name of your choice:
    ```bash
    helm install --name <my_name> timescale/timescaledb-single
    ```
    (Optional) If you created a `<myvalues.yaml>` file, then use:
    ```bash
    helm install --name  <my_name> -f <myvalues.yaml> charts/timescaledb-single
    ```

</procedure> 

## Connect to TimescaleDB
You can connect to TimescaleDB using an External IP or from within the cluster.
<procedure>

### Connecting to TimescaleDB using an External IP
1. Get the name of the host to connect to using:
    ```console
    kubectl get service/my-release
    ```
1. Decode the password that was generated during the helm installation:
    ```console
    PGPOSTGRESPASSWORD=$(kubectl get secret --namespace default my-release-credentials -o jsonpath="{.data.PATRONI_SUPERUSER_PASSWORD}" | base64 --decode)
    ```
1. Connect with psql:
    ```console
    PGPASSWORD=$PGPOSTGRESPASSWORD psql -h verylongname.example.com -U postgres
    ```
1. Create users and databases, for example, using the above `psql` session:
    ```sql
    CREATE USER example WITH PASSWORD 'thisIsInsecure';
    CREATE DATABASE example OWNER example;
    ```
1. Connect to the example database with the example user:
    ```console
    psql -h verylongname.example.com -U example -d example
    ```

</procedure>

<procedure>

### Connecting to TimescaleDB from inside the Cluster
1. Run `psql` inside the Pod containing the primary:
    ```console
    kubectl exec -ti $(kubectl get pod -o name -l role=master release=$RELEASE) psql
    ```
1. Create users and databases, for example, using the above `psql` session:
    ```sql
    CREATE USER example WITH PASSWORD 'thisIsInsecure';
    CREATE DATABASE example OWNER example;
    ```
1. Connect to the example database with the example user:
    ```console
    psql -h verylongname.example.com -U example -d example
    ```
    
</procedure>

## Cleanup

To remove the spawned pods you can run a simple
```console
helm delete my-release
```
Some items, (pvc's and S3 backups for example) are not immediately removed.
To also purge these items, have a look at the [Administrator Guide]

## Where to next
Now that you have your first TimescaleDB database up and running, see
the [TimescaleDB][tsdb-docs] section in our documentation to learn what
you can do with it.

To work through some tutorials that help you get started with
TimescaleDB and time-series data, check out our [tutorials][tutorials] section.

To get help or chat with the Timescale team, [contact us][contact].


[kubectl-install]: https://kubernetes.io/docs/tasks/tools/
[kubernetes-install]: https://kubernetes.io/docs/setup/
[helm-install]: https://helm.sh/docs/intro/install/
[minikube-install]: https://minikube.sigs.k8s.io/docs/start/
[aws-eks]: https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html
[microk8s-install]: https://microk8s.io/docs/getting-started
[contact]: https://www.timescale.com/contact
[tsdb-docs]: timescaledb/:currentVersion:/