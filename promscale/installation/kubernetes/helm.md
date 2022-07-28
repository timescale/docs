---
title: Install Promscale on Kubernetes using Helm
excerpt: Install Promscale on a Kubernetes cluster using Helm
product: promscale
keywords: [Kubernetes, analytics, Helm]
tags: [install]
related_pages: 
  - /promscale/:currentVersion:/installation/resource-recomm/
  - /promscale/:currentVersion:/send-data/
---

import PromscaleConfigurationRecommendations from 'versionContent/_partials/_promscale-configuration-recommendations.mdx';


# Install Promscale with Helm charts
You can install Promscale using Helm charts and the Helm charts must be installed
in this order:
1. Install the TimescaleDB Helm chart
1. Install the Promscale Helm chart

## Before you begin
1.  Understand the [resource requirements][resource-requirements] for your cluster.
1.  [Deploy a Kubernetes Cluster][kubernetes-cluster]. 
1.  Install [Helm 3][helm] in your local machine.
1.  Install [kubectl][kubectl] in your local environment and
    [connect to your cluster][connect-to-cluster].

When you install TimescaleDB on Kubernetes using a Helm chart with the default
`values.yaml` file, the user credentials are randomly generated during
installation. Therefore, the `helm upgrade` command does not rotate the
credentials, because changing the database credentials would break the database.
Instead, it continues to use the credentials generated during `helm install`.

Hence, create your own `.yaml` file to use parameters other than those specified
in the default `values.yaml`. You can name this file `<MY_VALUES.yaml>`. For
details about the parameters you can set, see the [Administrator Guide][admin-guide].
Some of the values in the `<MY_VALUES.yaml>` that you need to configure are:
* the values of `replicaCount` to `1` to turn off the high availability mode.
* the [credentials for the superuser, admin, and other users][timescaledb-helm-values-creds]
* [TLS Certificates][timescaledb-helm-values-certs]
* **Optional:** `pgbackrest` [configuration][timescale-backups]

## Install TimescaleDB using a Helm chart
This section provides instructions to deploy TimescaleDB using the
`timescaledb-single` Helm chart.

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
1.  Install the TimescaleDB Helm chart, by replacing `<RELEASE_NAME>` with a name of
    your choice:
    ```bash
    helm install <RELEASE_NAME> -f <MY_VALUES.yaml> charts/timescaledb-single
    ```

</procedure> 

#### Installing the Promscale Helm chart

<procedure>

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

1.  Install the Promscale Helm chart. Make sure that you replace
    `&lt;RELEASE_NAME&gt;` with the name of your choice:
    ```bash
    helm install <RELEASE_NAME> timescale/promscale -f values.yaml
    ```
        
</procedure>

After you have installed Promscale, you can ingest data.
For instructions, see the [send data][send-data] section.

## Database configurations
<PromscaleConfigurationRecommendations />


[promscale-values-yaml]: https://github.com/timescale/timescaledb-kubernetes/blob/master/charts/timescaledb-single/values.yaml
[send-data]: /promscale/:currentVersion:/send-data/
[template-manifest]: https://github.com/timescale/promscale/blob/0.13.0/deploy/static/deploy.yaml
[timescale-backups]: https://github.com/timescale/timescaledb-kubernetes/tree/master/charts/timescaledb-single#create-backups-to-s3
[timescaledb-helm-values-certs]: https://github.com/timescale/timescaledb-kubernetes/blob/master/charts/timescaledb-single/values.yaml#L45
[timescaledb-helm-values-creds]: https://github.com/timescale/timescaledb-kubernetes/blob/master/charts/timescaledb-single/values.yaml#L33
[timescaledb-single-values-yaml]: https://github.com/timescale/timescaledb-kubernetes/blob/master/charts/timescaledb-single/values.yaml
[kubernetes-cluster]: https://kubernetes.io/docs/setup/production-environment/
[helm]: https://helm.sh/docs/intro/install/
[kubectl]: https://kubernetes.io/docs/tasks/tools/#kubectl
[connect-to-cluster]: https://kubernetes.io/docs/tasks/tools/install-kubectl-macos/#verify-kubectl-configuration
[resource-requirements]: /promscale/:currentVersion:/installation/resource-recomm/ 
[admin-guide]: https://github.com/timescale/timescaledb-kubernetes/blob/master/charts/