---
title: Uninstall TimescaleDB from Kubernetes
excerpt: Remove TimescaleDB resources from a Kubernetes cluster
products: [self_hosted]
keywords: [uninstall, Kubernetes]
---

# Uninstall TimescaleDB from Kubernetes

If you deployed TimescaleDB on Kubernetes, you can completely remove all associated resources including the StatefulSet, Service, PersistentVolumeClaim, Secret, and application deployments. This guide shows you how to cleanly uninstall TimescaleDB from your Kubernetes cluster.

<Procedure>

## Uninstalling TimescaleDB from Kubernetes

1.  **Back up your data (optional but recommended)**

    Before uninstalling, back up any important data from your TimescaleDB instance:

    ```shell
    kubectl exec -it timescaledb-0 -- pg_dump -U postgres postgres > backup.sql
    ```

    <Highlight type="warning">

    Deleting the PersistentVolumeClaim will permanently delete all your database data. Ensure you have backed up any data you need before proceeding.

    </Highlight>

1.  **Delete the test pod (if it exists)**

    If you created a test pod during installation:

    ```shell
    kubectl delete pod test-pod
    ```

1.  **Delete the application deployment**

    Remove any application deployments that connect to TimescaleDB:

    ```shell
    kubectl delete deployment timescale-app
    ```

1.  **Delete the TimescaleDB service**

    Remove the service that exposes TimescaleDB within the cluster:

    ```shell
    kubectl delete service timescaledb
    ```

1.  **Delete the TimescaleDB StatefulSet**

    Remove the StatefulSet managing the TimescaleDB pods:

    ```shell
    kubectl delete statefulset timescaledb
    ```

    This will terminate the TimescaleDB pod(s).

1.  **Delete the PersistentVolumeClaim**

    <Highlight type="warning">

    This step permanently deletes all database data stored in the persistent volume.

    </Highlight>

    ```shell
    kubectl delete pvc timescale-pvc
    ```

1.  **Delete the secret**

    Remove the Kubernetes secret containing database credentials:

    ```shell
    kubectl delete secret timescale-secret
    ```

1.  **(Optional) Delete the namespace**

    If you created a dedicated namespace for TimescaleDB and want to remove it:

    ```shell
    kubectl delete namespace timescale
    ```

    <Highlight type="note">

    Only delete the namespace if you're certain no other resources are using it. This will delete all resources in the namespace.

    </Highlight>

1.  **Verify removal**

    Confirm that all TimescaleDB resources have been deleted:

    ```shell
    # Check for StatefulSets
    kubectl get statefulsets

    # Check for Services
    kubectl get services

    # Check for PVCs
    kubectl get pvc

    # Check for Secrets
    kubectl get secrets

    # Check for Pods
    kubectl get pods
    ```

    TimescaleDB-related resources should not appear in these lists.

</Procedure>

## Uninstalling TimescaleDB installed with Kubernetes operators

If you installed TimescaleDB using a Kubernetes operator (StackGres, Patroni, PGO, or CloudNativePG), follow the operator-specific uninstallation instructions:

### StackGres

```shell
kubectl delete sgcluster <cluster-name>
kubectl delete sgpgconfig <config-name>
```

For complete uninstallation:

```shell
helm uninstall stackgres-operator --namespace stackgres
kubectl delete namespace stackgres
```

### PostgreSQL Operator (Patroni/Zalando)

```shell
kubectl delete postgresql <cluster-name>
```

To uninstall the operator:

```shell
kubectl delete -f https://raw.githubusercontent.com/zalando/postgres-operator/master/manifests/postgresql-operator.yaml
```

### PGO (Crunchy Data)

```shell
kubectl delete postgrescluster <cluster-name>
```

To uninstall the operator:

```shell
kubectl delete -f https://raw.githubusercontent.com/CrunchyData/postgres-operator/master/installers/kubectl/postgres-operator.yml
```

### CloudNativePG

```shell
kubectl delete cluster <cluster-name>
```

To uninstall the operator:

```shell
kubectl delete -f https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/release-1.23/releases/cnpg-1.23.0.yaml
```

## Clean up persistent volumes

After deleting the PersistentVolumeClaim, you may also want to delete the associated PersistentVolume if it was manually provisioned:

```shell
# List persistent volumes
kubectl get pv

# Delete a specific persistent volume
kubectl delete pv <pv-name>
```

<Highlight type="note">

If you're using dynamic provisioning with a storage class, the PersistentVolume should be automatically deleted when you delete the PersistentVolumeClaim, depending on your reclaim policy.

</Highlight>
