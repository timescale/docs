---
title: Install TimescaleDB on Kubernetes
excerpt: Install self-hosted TimescaleDB on Kubernetes
products: [self_hosted]
keywords: [installation, self-hosted, Kubernetes]
---

import WhereTo from "versionContent/_partials/_where-to-next.mdx";

# Install TimescaleDB on Kubernetes

You can install a TimescaleDB instance on any Kubernetes deployment. Use the
`timescaledb-single` Helm chart to deploy a highly available TimescaleDB
database, and `timescaledb-multinode` to deploy a multi-node distributed
TimescaleDB database.

Before you begin installing TimescaleDB on a Kubernetes deployment, make sure
you have installed:

*   [kubectl][kubectl-install]
*   [Helm][helm-install]
*   [Kubernetes Cluster][kubernetes-install]

If you want to, you can create your own `.yaml` file to use parameters other
than those specified in the default `values.yaml`. You can name this file
`<MY_VALUES.yaml>`. For details about the parameters you can set, see the
[Administrator Guide][admin-guide].

## Install TimescaleDB using a Helm chart

Install TimescaleDB on Kubernetes using a Helm chart with the default
`values.yaml` file. When you use the `values.yaml` file, the user credentials
are randomly generated during installation. Therefore, the `helm upgrade`
command does not rotate the credentials, because changing the database
credentials would break the database. Instead, it continues to use the
credentials generated during `helm install`.

This section provides instructions to deploy TimescaleDB using the
`timescaledb-single` Helm chart.

<Procedure>

### Installing TimescaleDB using a Helm chart

1.  Add the TimescaleDB Helm chart repository:

    ```bash
    helm repo add timescale 'https://charts.timescale.com'
    ```

1.  Verify that the repository is up to date:

    ```bash
    helm repo update
    ```

1.  Install the TimescaleDB Helm chart, by replacing `<MY_NAME>` with a name of
    your choice:

    ```bash
    helm install <MY_NAME> timescale/timescaledb-single
    ```

    If you created a `<MY_VALUES.yaml>` file, use this command instead:

    ```bash
    helm install <MY_NAME> -f <MY_VALUES.yaml> charts/timescaledb-single
    ```

</Procedure>

## Connect to TimescaleDB

You can connect to TimescaleDB from an external IP address, or from within the
cluster.

<Procedure>

### Connecting to TimescaleDB using an external IP

<Highlight type="note">
If you configured the user credentials in the `my_values.yaml` file, you don't
need to decode the passwords. In the following section replace `MY_NAME` with
the name that you provided during the installation.
</Highlight>

1.  Get the name of the host to connect to:

    ```bash
    kubectl get service/<MY_NAME>
    ```

1.  Decode the `admin` user password `PGPASSWORD_ADMIN` that was generated during
   the Helm installation:

    ```bash
    PGPASSWORD_ADMIN=$(kubectl get secret --namespace default
    <MY_NAME>-credentials -o jsonpath="{.data.PATRONI_admin_PASSWORD}" | base64 --decode)
    ```

1.  <Optional />Decode the super user password `PGPOSTGRESPASSWORD` that was
   generated during the Helm installation:

    ```bash
    PGPASSWORD_POSTGRES=$(kubectl get secret --namespace default
    <MY_NAME>-credentials -o jsonpath="{.data.PATRONI_SUPERUSER_PASSWORD}" | base64 --decode)
    ```

1.  Connect to psql as `admin` user:

    ```bash
    kubectl run -i --tty --rm psql --image=postgres \
      --env "PGPASSWORD=$PGPASSWORD_ADMIN" \
      --command -- psql -U admin \
      -h <MY_NAME>.default.svc.cluster.local postgres
    ```

</Procedure>

<Procedure>

### Connecting to TimescaleDB from inside the cluster

1.  Get the Pod on which TimescaleDB is installed:

   ```bash
   MASTERPOD="$(kubectl get pod -o name --namespace default -l release=test,role=master)"
   ```

2.  Run `psql` inside the Pod containing the primary:

   ```bash
   kubectl exec -i --tty --namespace default ${MASTERPOD} -- psql -U postgres
   ```

</Procedure>

## Create a database

 After installing and connecting to TimescaleDB you can create a database,
 connect to the database, and also verify that the TimescaleDB extension is
 installed.

<Procedure>

### Creating a database

1.  At the prompt, create an empty database. For example, to create a database
    called `tsdb`:

    ```sql
    CREATE database tsdb;
    ```

1.  Connect to the database you created:

    ```sql
    \c tsdb
    ```

1.  Verify that the TimescaleDB extension is installed by using the `\dx`
    command at the command prompt. The output looks like this:

    ```sql
                                      List of installed extensions
    Name     | Version |   Schema   |                            Description
    -------------+---------+------------+-------------------------------------------------------------------
    plpgsql     | 1.0     | pg_catalog | PL/pgSQL procedural language
    timescaledb | 2.1.1   | public     | Enables scalable inserts and complex queries for time-series data
    (2 rows)

    (END)
    ```

</Procedure>

## Clean up

You can use Helm to uninstall TimescaleDB on the Kubernetes cluster and clean up
the Pods, persistent volume claim (PVC), S3 backups, and more.

### Cleaning up

To remove the spawned Pods:

```bash
helm delete <MY_NAME>
```

Some items, such as PVCs and S3 backups, are not removed
immediately.

## Where to next

<WhereTo />

[kubectl-install]: https://kubernetes.io/docs/tasks/tools/
[kubernetes-install]: https://kubernetes.io/docs/setup/
[helm-install]: https://helm.sh/docs/intro/install/
[admin-guide]: https://github.com/timescale/helm-charts/blob/main/charts/timescaledb-single/docs/admin-guide.md
