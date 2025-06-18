Running $TIMESCALE_DB on Kubernetes is similar to running $PG. This procedure outlines the steps for a non-distributed system. 

To connect your Kubernetes cluster to $SELF_LONG running in the cluster:

<Procedure>

1. **Create a default namespace for $COMPANY components**

    1. Create the $COMPANY namespace:

       ```shell
       kubectl create namespace timescale
       ```

    1. Set this namespace as the default for your session:

       ```shell
       kubectl config set-context --current --namespace=timescale
       ```

   For more information, see [Kubernetes Namespaces][kubernetes-namespace].

1. **Set up a persistent volume claim (PVC) storage**

   To manually set up a persistent volume and claim for self-hosted Kubernetes, run the following command:

   ```yaml
   kubectl apply -f - <<EOF
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
   EOF
   ```

1. **Deploy $TIMESCALE_DB as a StatefulSet**

   By default, the [$TIMESCALE_DB Docker image][timescale-docker-image] you are installing on Kubernetes uses the
   default $PG database, user and password. To deploy $TIMESCALE_DB on Kubernetes, run the following command:

    ```yaml
    kubectl apply -f - <<EOF
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
              image: 'timescale/timescaledb:latest-pg17'
              env:
                - name: POSTGRES_USER
                  value: postgres
                - name: POSTGRES_PASSWORD
                  value: postgres
                - name: POSTGRES_DB
                  value: postgres
                - name: PGDATA
                  value: /var/lib/postgresql/data/pgdata
              ports:
                - containerPort: 5432
              volumeMounts:
                - mountPath: /var/lib/postgresql/data
                  name: timescale-storage
          volumes:
            - name: timescale-storage
              persistentVolumeClaim:
                claimName: timescale-pvc
    EOF
    ```

1. **Allow applications to connect by exposing $TIMESCALE_DB within Kubernetes**

  ```yaml
  kubectl apply -f - <<EOF
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
  EOF
  ```

1. **Create a Kubernetes secret to store the database credentials**

   ```shell
   kubectl create secret generic timescale-secret \
   --from-literal=PGHOST=timescaledb \
   --from-literal=PGPORT=5432 \
   --from-literal=PGDATABASE=postgres \
   --from-literal=PGUSER=postgres \
   --from-literal=PGPASSWORD=postgres
   ```

1. **Deploy an application that connects to $TIMESCALE_DB**

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

1. **Test the database connection**

    1. Create and run a pod to verify database connectivity using your [connection details][connection-info] saved in `timescale-secret`:

         ```shell
         kubectl run test-pod --image=postgres --restart=Never \
         --env="PGHOST=$(kubectl get secret timescale-secret -o=jsonpath='{.data.PGHOST}' | base64 --decode)" \
         --env="PGPORT=$(kubectl get secret timescale-secret -o=jsonpath='{.data.PGPORT}' | base64 --decode)" \
         --env="PGDATABASE=$(kubectl get secret timescale-secret -o=jsonpath='{.data.PGDATABASE}' | base64 --decode)" \
         --env="PGUSER=$(kubectl get secret timescale-secret -o=jsonpath='{.data.PGUSER}' | base64 --decode)" \
         --env="PGPASSWORD=$(kubectl get secret timescale-secret -o=jsonpath='{.data.PGPASSWORD}' | base64 --decode)" \
         -- sleep infinity
         ```

    1. Launch the PostgreSQL interactive shell within the created `test-pod`:

         ```shell
         kubectl exec -it test-pod -- bash -c "psql -h \$PGHOST -U \$PGUSER -d \$PGDATABASE"
         ```

   You see the PostgreSQL interactive terminal.

</Procedure>


[kubernetes-namespace]: https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/
[timescale-docker-image]: https://hub.docker.com/r/timescale/timescaledb
[connection-info]: /integrations/:currentVersion:/find-connection-details/