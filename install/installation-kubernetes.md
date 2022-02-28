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
* (**Optional**) Create a YAML file that specifies the values for the parameters that are provided while installing the chart. For example, you can create a new `myvalues.yaml` file. For details about the parameters you can set, see  the [Administrator Guide][admin-guide].

</highlight>

## Install TimescaleDB using a Helm chart
You can install TimescaleDB on Kubernetes using a Helm chart with the default `values.yaml`. The user credentials are randomly generated during the installation with the default `values.yaml` file.
When you use the `helm upgrade` command it does not rotate the credentials, to prevent breaking the database by changing the database credentials instead it uses the same credentials that are generated during the `helm install`.

The following section provides instructions to deploy TimescaleDB using `timescaldb-single` helm chart.
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
    helm install <my_name> timescale/timescaledb-single
    ```
    (**Optional**) If you created a `<myvalues.yaml>` file, then use:
    ```bash
    helm install <my_name> -f <myvalues.yaml> charts/timescaledb-single
    ```

</procedure> 

## Connect to TimescaleDB
You can connect to TimescaleDB using an External IP or from within the cluster.

<procedure>

### Connecting to TimescaleDB using an External IP

<highlight type="note">
If you configured the user credentials in the `my_values.yaml` file, then you dont have to decode the passwords.

</highlight>

1. Get the name of the host to connect to using:
    ```console
    kubectl get service/my-release
    ```

1. Decode the `admin` user password `PGPASSWORD_ADMIN` that was generated during the helm installation, by replacing `<my_name>` with the name that you provided during the installation:
    ```console
    PGPASSWORD_ADMIN=$(kubectl get secret --namespace default <my_name>-credentials -o jsonpath="{.data.PATRONI_admin_PASSWORD}" | base64 --decode)
    ``` 

1. (**Optional**) Decode the super user password `PGPOSTGRESPASSWORD` that was generated during the helm installation, by replacing `<my_name>` with the name that you provided during the installation:
    ```console
    PGPASSWORD_POSTGRES=$(kubectl get secret --namespace default <my_name>-credentials -o jsonpath="{.data.PATRONI_SUPERUSER_PASSWORD}" | base64 --decode)
    ```

1. Connect with psql as `admin` user, by replacing `<my_name>` with the name that you provided during the installation:
    ```console
    kubectl run -i --tty --rm psql --image=postgres \
      --env "PGPASSWORD=$PGPASSWORD_ADMIN" \
      --command -- psql -U admin \
      -h <my_name>.default.svc.cluster.local postgres
    ```
    
</procedure>

<procedure>

### Connecting to TimescaleDB from inside the Cluster
1. Get the Pod on which TimescaleDB is installed:
   ```console
    MASTERPOD="$(kubectl get pod -o name --namespace default -l release=test,role=master)"
    ```

1. Run `psql` inside the Pod containing the primary:
    ```console
    kubectl exec -i --tty --namespace default ${MASTERPOD} -- psql -U postgres
    ```

</procedure>

### Create a Database

1.  At the prompt, create an empty database. For example, to create a database
    called `tsdb`:
    ```sql
    CREATE database tsdb;
    ```
1.  Connect to the database you created:
    ```sql
    \c tsdb
    ```
1. Verify that the TimescaleDB extension is installed by using the `\dx`
command at the command prompt. It looks like this:
```sql
tsdb=# \dx

                                      List of installed extensions
    Name     | Version |   Schema   |                            Description                            
-------------+---------+------------+-------------------------------------------------------------------
 plpgsql     | 1.0     | pg_catalog | PL/pgSQL procedural language
 timescaledb | 2.1.1   | public     | Enables scalable inserts and complex queries for time-series data
(2 rows)

(END)
```

## Cleanup

To remove the spawned pods you can run a simple
```console
helm delete my-release
```
Some items such as pvc's and S3 backups are not removed immediately.
To purge these items, see the [Administrator Guide][admin-guide].

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
[admin-guide]: https://github.com/timescale/timescaledb-kubernetes/blob/master/charts/timescaledb-single/admin-guide.md