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

</highlight>

## Install the TimescaleDB using Helm chart
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

#### Installing the TimescaleDB using Helm chart
1.  Add the TimescaleDB Helm chart repository:
    ```bash
    helm repo add timescale 'https://charts.timescale.com'
    ```
1.  Verify that the repository is up to date:
    ```bash
    helm repo update
    ```
1.  Install the TimescaleDB Helm chart, by replacing `<MY_NAME>` with a name of your choice:
    ```bash
    helm install <MY_NAME> timescale/timescaledb-single
    ```

</procedure>

You can provide arguments to the `helm install` command. For example, to install the  chart with backups
enabled, use this command:
```bash
helm install <MY_NAME> timescale/timescaledb-single --set backup.enabled=true
```

Alternatively, you can provide a `myvalues.yaml` file that includes parameters for
installing the chart:
```bash
helm install <MY_NAME> -f myvalues.yaml timescale/timescaledb-single
```

## Where to next
Now that you have your first TimescaleDB database up and running, you can check
out the [TimescaleDB][tsdb-docs] section in our documentation, and find out what
you can do with it.

If you want to work through some tutorials to help you get up and running with
TimescaleDB and time-series data, check out our [tutorials][tutorials] section.

You can always [contact us][contact] if you need help working something out, or
if you want to have a chat.


[kubectl-install]: https://kubernetes.io/docs/tasks/tools/
[kubernetes-install]: https://kubernetes.io/docs/setup/
[helm-install]: https://helm.sh/docs/intro/install/
[minikube-install]: https://minikube.sigs.k8s.io/docs/start/
[aws-eks]: https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html
[microk8s-install]: https://microk8s.io/docs/getting-started
[contact]: https://www.timescale.com/contact
[tsdb-docs]: timescaledb/:currentVersion:/