## Install $TOOLKIT_LONG

The $TOOLKIT_SHORT extension is pre-installed and pre-enabled when you
[Install $TIMESCALE_DB on Kubernetes][kubernetes-install]. Once you start the container, the extension is already 
active in your database and ready to use. No additional installation steps are required.

## Update $TOOLKIT_LONG

To get the latest version of $TOOLKIT_SHORT, update the $TIMESCALE_DB HA Docker image used by your Kubernetes StatefulSet:

<Procedure>

1.  **Update the StatefulSet to use the latest image**

    Replace `<new-version>` with the desired version tag. For example, `pg18`. You find the available tags on 
    the [$TIMESCALE_DB HA Docker Hub page][timescale-ha-tags].

    ```shell
    kubectl set image statefulset/timescaledb timescaledb=timescale/timescaledb-ha:<new-version> -n tigerdata
    ```

    Kubernetes performs a rolling update, replacing the pod with the new image version.

1.  **Verify the new image is running**

    ```shell
    kubectl get statefulset timescaledb -n tigerdata -o jsonpath='{.spec.template.spec.containers[0].image}'
    ```

1.  **Connect to your $TIMESCALE_DB pod and verify the extension versions**

    ```shell
    kubectl exec -it test-pod -- bash -c "psql -h \$PGHOST -U \$PGUSER -d \$PGDATABASE"
    \dx
    ```

</Procedure>

[kubernetes-install]: /self-hosted/:currentVersion:/install/installation-kubernetes/
[connect]: /integrations/:currentVersion:/find-connection-details/
[timescale-ha-tags]: https://hub.docker.com/r/timescale/timescaledb-ha/tags
