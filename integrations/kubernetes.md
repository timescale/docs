---
title: Integrate Kubernetes with Timescale Cloud
excerpt: Learn how to integrate Kubernetes with Timescale Cloud to enable seamless deployment and scaling of your PostgreSQL workloads
products: [cloud, mst, self_hosted]
keywords: [Kubernetes, Timescale Cloud, PostgreSQL, container orchestration]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";
import KubernetesPrereqs from "versionContent/_partials/_kubernetes-prereqs.mdx";
import KubernetesInstallSelf from "versionContent/_partials/_kubernetes-install-self-hosted.mdx";

# Integrate Kubernetes with $CLOUD_LONG

[Kubernetes][kubernetes] is an open-source container orchestration system that automates the deployment, scaling, and management of containerized applications. You can deploy $CLOUD_LONG within your Kubernetes clusters.

This guide explains how to connect a Kubernetes cluster to $CLOUD_LONG, configure persistent storage, and manage deployments effectively.

## Prerequisites

<IntegrationPrereqs />
<KubernetesPrereqs />

## Integrate Timescale in a Kubernetes cluster 

<Tabs>

<Tab title="Timescale Cloud">

To connect your Kubernetes cluster to your $SERVICE_LONG:

<Procedure>

1. **Create a default namespace for your $CLOUD_LONG components**

   1. Create the Timescale namespace:

      ```shell
      kubectl create namespace timescale
      ```

   1. Set this namespace as the default for your session:

      ```shell
      kubectl config set-context --current --namespace=timescale
      ```

   For more information, see [Kubernetes Namespaces][kubernetes-namespace].

1. **Create a Kubernetes secret that stores your $SERVICE_LONG credentials**

   Update the following command with your [connection details][connection-info], then run it:

      ```shell
      kubectl create secret generic timescale-secret \
       --from-literal=PGHOST=<host> \
       --from-literal=PGPORT=<port> \
       --from-literal=PGDATABASE=<dbname> \
       --from-literal=PGUSER=<user> \
       --from-literal=PGPASSWORD=<password>
      ```

1. **Configure network access to $CLOUD_LONG**

   - **Managed Kubernetes**: outbound connections to external databases like $CLOUD_LONG work by default. 
       Make sure your cluster’s security group or firewall rules allow outbound traffic to $CLOUD_LONG IP.

   - **Self-hosted Kubernetes**: If your cluster is behind a firewall or running on-premise, you may need to allow 
      egress traffic to $CLOUD_LONG. Test connectivity using your [connection details][connection-info]:

      ```shell
      nc -zv <host> <port>
      ```

     If the connection fails, check your firewall rules.

1. **Create a Kubernetes deployment that can access your $CLOUD_LONG**

   Run the following command to apply the deployment:

      ```shell
      kubectl apply -f - <<EOF
      apiVersion: apps/v1
      kind: Deployment
      metadata:
        name: timescale-app
      spec:
        replicas: 1
        selector:
          matchLabels:
            app: timescale-app
        template:
          metadata:
            labels:
              app: timescale-app
          spec:
            containers:
            - name: timescale-container
              image: postgres:latest
              envFrom:
                - secretRef:
                    name: timescale-secret
      EOF
      ```

1. **Test the connection**

   1. Create and run a pod that uses the [connection details][connection-info] you added to `timescale-secret` in 
      the `timescale` namespace:

      ```shell
      kubectl run test-pod --image=postgres --restart=Never \
       --env="PGHOST=$(kubectl get secret timescale-secret -o=jsonpath='{.data.PGHOST}' | base64 --decode)" \
       --env="PGPORT=$(kubectl get secret timescale-secret -o=jsonpath='{.data.PGPORT}' | base64 --decode)" \
       --env="PGDATABASE=$(kubectl get secret timescale-secret -o=jsonpath='{.data.PGDATABASE}' | base64 --decode)" \
       --env="PGUSER=$(kubectl get secret timescale-secret -o=jsonpath='{.data.PGUSER}' | base64 --decode)" \
       --env="PGPASSWORD=$(kubectl get secret timescale-secret -o=jsonpath='{.data.PGPASSWORD}' | base64 --decode)" \
       -- sleep infinity
      ```

   2. Launch a psql shell in the `test-pod` you just created:

      ```shell
      kubectl exec -it test-pod -- bash -c "psql -h \$PGHOST -U \$PGUSER -d \$PGDATABASE"
      ```

   You start a `psql` session connected to your $SERVICE_LONG.

</Procedure>

</Tab>

<Tab title="Self-hosted TimescaleDB">

<KubernetesInstallSelf />

</Tab>

</Tabs>

You have successfully integrated Kubernetes with $CLOUD_LONG.

[connection-info]: /integrations/:currentVersion:/find-connection-details/
[kubernetes]: https://kubernetes.io/
