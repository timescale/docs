---
title: Integrate Kubernetes with Timescale Cloud
excerpt: Learn how to integrate Kubernetes with Timescale Cloud to enable seamless deployment and scaling of your PostgreSQL workloads
products: [cloud, mst, self_hosted]
keywords: [Kubernetes, Timescale Cloud, PostgreSQL, container orchestration]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Integrate Kubernetes with $CLOUD_LONG

[Kubernetes][kubernetes] is an open-source container orchestration system that automates the deployment, scaling, and management of containerized applications. You can deploy $CLOUD_LONG within your Kubernetes clusters.

This guide explains how to connect a Kubernetes cluster to $CLOUD_LONG, configure persistent storage, and manage deployments effectively.

## Prerequisites

<IntegrationPrereqs />

- Install [self-managed Kubernetes][kubernetes-install] or sign up for a [managed service][kubernetes-managed]. 
- Install [kubectl][kubectl] for command-line interaction with your cluster.

## Connect your Kubernetes cluster to your $SERVICE_LONG

To connect your Kubernetes cluster to $CLOUD_LONG:

<Procedure>

1. **Create a namespace for your database components**

    1. Run the following command to check if a namespace for your database components exists:
    
       ```sh
       kubectl get namespaces
       ```
    
    1. If not, create one:
    
       ```sh
       kubectl create namespace timescale
       ```
    
    1. Optionally set this namespace as the default for your session:
    
       ```sh
       kubectl config set-context --current --namespace=timescale
       ```
    
    For details, see the [Kubernetes namespace documentation][kubernetes-namespace].

1. **Create a Kubernetes secret for database credentials**

   Use your [connection details][connection-info] to create a Kubernetes secret for storing the $SERVICE_SHORT credentials:

   ```sh
   kubectl create secret generic timescale-secret \
     --from-literal=PGHOST=<your-host> \
     --from-literal=PGPORT=<your-port> \
     --from-literal=PGDATABASE=<your-database> \
     --from-literal=PGUSER=<your-user> \
     --from-literal=PGPASSWORD=<your-password>
   ```


3. **Set Up Persistent Storage (For Self-Hosted Kubernetes Only)**

   **Managed Kubernetes (EKS, GKE, AKS):**
    - Cloud providers automatically provision storage when needed, so this step is not required.

   **Self-Hosted Kubernetes:**
    - You need to manually set up a persistent volume and claim. Create a `pvc.yaml` file:

      ```yaml
      apiVersion: v1
      kind: PersistentVolumeClaim
      metadata:
        name: timescale-pvc
      spec:
        accessModes:
          - ReadWriteOnce
        resources:
          requests:
            storage: 10Gi
      ```

   Apply the PVC:

   ```sh
   kubectl apply -f pvc.yaml
   ```

4. **Configure Network Access to Timescale Cloud**

   **Managed Kubernetes (EKS, GKE, AKS):**
    - Outbound connections to external databases like Timescale Cloud work by default.
    - Ensure your cluster’s security group or firewall rules allow **outbound traffic to Timescale Cloud’s IP**.

   **Self-Hosted Kubernetes:**
    - If your cluster is behind a firewall or running on-prem, you may need to allow egress traffic to Timescale Cloud.
    - Test connectivity using:

      ```sh
      nc -zv <your-host> <your-port>
      ```

      If the connection fails, check firewall rules.

5. **Deploy a Kubernetes Deployment for Timescale Access**

   Create a deployment (`deployment.yaml`) that connects to Timescale Cloud:

   ```yaml
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
   ```

   Apply the deployment:

   ```sh
   kubectl apply -f deployment.yaml
   ```

6. **Test the Connection**

    - Run a pod to verify database connectivity:

   ```sh
   kubectl run test-pod --image=postgres --restart=Never --env-from=secretRef:name=timescale-secret --command -- psql -h $PGHOST -U $PGUSER -d $PGDATABASE
   ```

    - If the connection is successful, you should see the PostgreSQL interactive terminal.

</Procedure>

You have successfully integrated Kubernetes with $CLOUD_LONG.

[connection-info]: /use-timescale/:currentVersion:/integrations/find-connection-details/
[kubernetes]: https://kubernetes.io/
[kubectl]: https://kubernetes.io/docs/tasks/tools/
[kubernetes-namespace]: https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/
[kubernetes-install]: https://kubernetes.io/docs/setup/
[kubernetes-managed]: https://kubernetes.io/docs/setup/production-environment/turnkey-solutions/
