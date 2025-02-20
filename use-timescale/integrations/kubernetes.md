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

<Tabs>

<Tab title="Timescale Cloud">

To connect your Kubernetes cluster to $CLOUD_LONG:

<Procedure>

1. **Create a namespace for your $CLOUD_LONG components**

   - Run the following command to check if a namespace for your database components exists:
    
       ```sh
       kubectl get namespaces
       ```
    
   - If not, create one:
    
       ```sh
       kubectl create namespace timescale
       ```
    
   - Optionally set this namespace as the default for your session:
    
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

1. **Configure network access to $CLOUD_LONG**

   - Managed Kubernetes: outbound connections to external databases like $CLOUD_LONG work by default. Make sure your cluster’s security group or firewall rules allow outbound traffic to $CLOUD_LONG IP.

   - Self-hosted Kubernetes: if your cluster is behind a firewall or running on-premise, you may need to allow egress traffic to $CLOUD_LONG. Test connectivity using your [connection details][connection-info]:

      ```sh
      nc -zv <your-host> <your-port>
      ```

      If the connection fails, check the firewall rules.

1. **Deploy Kubernetes deployment for $CLOUD_LONG access**

   1. Create a deployment (`deployment.yaml`) that connects to $CLOUD_LONG:

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

   1. Apply the deployment:

      ```sh
      kubectl apply -f deployment.yaml
      ```

1. **Test the connection**

   Run a pod to verify database connectivity using your [connection details][connection-info]:

   ```sh
   kubectl run test-pod --image=postgres --restart=Never --env-from=secretRef:name=timescale-secret --command -- psql -h $PGHOST -U $PGUSER -d $PGDATABASE
   ```

    If the connection is successful, you should see the PostgreSQL interactive terminal.

</Procedure>

</Tab>

<Tab title="Self-hosted TimescaleDB">

<Procedure>

1. **Create a namespace for your database components**

   - Run the following command to check if a namespace for your database components exists:

       ```sh
       kubectl get namespaces
       ```

   - If not, create one:

       ```sh
       kubectl create namespace timescale
       ```

   - Optionally set this namespace as the default for your session:

       ```sh
       kubectl config set-context --current --namespace=timescale
       ```

   For details, see the [Kubernetes namespace documentation][kubernetes-namespace].

1. **Set up persistent storage**

Skip this step if you are using managed Kubernetes. For self-hosted Kubernetes, manually set up a persistent volume and claim:

   1. Create a `pvc.yaml` file:

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

   1. Apply the PVC:

      ```sh
      kubectl apply -f pvc.yaml
      ```
      
1. **Deploy $TIMESCALE_DB as a StatefulSet**

   1. Create a `timescale-statefulset.yaml` file using your [connection details][connection-info]:

   ```yaml
   apiVersion: apps/v1
   kind: StatefulSet
   metadata:
     name: timescaledb
   spec:
     serviceName: timescaledb
     replicas: 1
     selector:
       matchLabels:
         app: timescaledb
     template:
       metadata:
         labels:
           app: timescaledb
       spec:
         containers:
           - name: timescaledb
             image: 'timescale/timescaledb:latest-pg15'
             env:
               - name: POSTGRES_USER
                 value: myuser
               - name: POSTGRES_PASSWORD
                 value: mypassword
               - name: POSTGRES_DB
                 value: mydatabase
             ports:
               - containerPort: 5432
             volumeMounts:
               - mountPath: /var/lib/postgresql/data
                 name: timescale-storage
         volumes:
           - name: timescale-storage
             persistentVolumeClaim:
               claimName: timescale-pvc
   ```
   
   1. Apply the StatefulSet: 

   ```sh
   kubectl apply -f timescale-statefulset.yaml
   ```
   
1. **Expose $TIMESCALE_DB within Kubernetes**

   To allow applications to connect, expose $TIMESCALE_DB using a ClusterIP Service:

   ```yaml
   apiVersion: v1
   kind: Service
   metadata:
      name: timescaledb
   spec:
      selector:
         app: timescaledb
      ports:
         - protocol: TCP
           port: 5432
           targetPort: 5432
      type: ClusterIP   
   ```

</Procedure>

</Tab>

</Tabs>

You have successfully integrated Kubernetes with $CLOUD_LONG.

[connection-info]: /use-timescale/:currentVersion:/integrations/find-connection-details/
[kubernetes]: https://kubernetes.io/
[kubectl]: https://kubernetes.io/docs/tasks/tools/
[kubernetes-namespace]: https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/
[kubernetes-install]: https://kubernetes.io/docs/setup/
[kubernetes-managed]: https://kubernetes.io/docs/setup/production-environment/turnkey-solutions/
