# Run Promscale in high availability mode
Promscale is a stateless service, so it can use multiple replicas to run in a
high availability (HA) mode. In this mode, a load balancer routes Promscale
requests to any available replica.

To run Promscale in HA mode, you need multiple Prometheus instances running as a
cluster. A cluster contains two or more identical Prometheus instances, each
running on a different machine or container, with all instances scraping the
same targets. This results in each Prometheus instance within the cluster having
similar data. The data is not identical, because small differences can occur
when data is scraped at slightly different times on each instance.

Promscale de-duplicates the data on each cluster after the data is ingested. One
of the Prometheus instances is randomly elected leader, and all other instances
only ingest data from that leader. This occurs until the leader stops sending
data to Promscale for any reason. When the leader fails, Promscale selects a new
Prometheus instance to act as leader instead, and the other instances ingest
data from the new leader. Additionally, you can have multiple clusters sending
data to the same set of Promscale instances, and in this case one leader is
elected for each cluster.

## Prometheus leader-election using external labels
To process data from Prometheus running in HA mode,
Prometheus must be configured to communicate which cluster it belongs to. This is done using external labels. In particular, each Prometheus instance sends a `cluster`
label to indicate which cluster it's in, and a `__replica__` label that
provides a unique identifier for the Prometheus instance within the cluster.
Two Prometheus instances running as part of a HA cluster must send the same
`cluster` label and different `__replica__` labels.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/promscale-ha.png" alt="Promscale architecture for Prometheus in HA using external labels"/>

In Kubernetes environments, it is useful to set the `__replica__` label to match
the pod name, and the cluster name as the Prometheus deployment or `statefulset`
name. If you are using the
[Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator#prometheus-operator), you can set it with these configuration
parameters:
```yaml
  replicaExternalLabelName: "__replica__"
  prometheusExternalLabelName: "cluster"
```

In bare metal environments, and any environment where you are not using Kubernetes, you can configure external labels with the cluster and replica names in each Prometheus instance configuration, like this:
```yaml
global:
  external_labels:
    __replica__: <REPLICA_NAME> (This should be unique name of the Prometheus instance)
    cluster: <CLUSTER_NAME> (This should be the name of the Prometheus deployment, which should be common across the Prometheus replica instances.)
```

When you have configured your Prometheus instances to send the correct labels,
you can start Promscale with the `--high-availability` CLI flag, like this:
```bash
FIXME
promscale --high-availability
```

Promscale automatically elects a single replica in each cluster as the current
leader. Only data sent from that replica is ingested. If that leader-replica
stops sending data, then a new replica is elected as the leader.

## Leader-election using pg_advisory_lock
PostgreSQL provides a
[pg_advisory_lock](https://www.postgresql.org/docs/current/explicit-locking.html#ADVISORY-LOCKS)
that locks an application-defined resource based on an ID. Promscale can make
use of this lock to choose a leader, when running multiple Promscale instances
in parallel.

<highlight type-"warning">
Do not use the `pg_advisory_lock` method of leader election in new deployments.
This method of leader election is deprecated. The ability to do this is expected
to be removed from Promscale in a future release.
</highlight>

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/promscale-ha-pglock.png" alt="Promscale architecture for Prometheus in HA using pg_advisory_locks"/>

Promscale provides a `leader-election-pg-advisory-lock-id` flag that is used to
set the advisory lock ID. The ID provided in the flag must be the same across
Prometheus HA clusters. This allows different groups of clusters to run in
parallel. The `leader-election-lock-id` flag must be accompanied by a
`leader-election-pg-advisory-lock-prometheus-timeout` flag, which takes an input
of a duration of time. This flag is used to check if a Prometheus instance is
operational.

The active time of a Prometheus instance is determined by when it last received
a write request. The difference between `now()` and the most recent write
request provides the elapsed active duration. If this duration is greater than
the specified timeout value, it determines that the Prometheus instance in the
current pair is dead, and the Promscale connector in the current cluster resigns
from being a leader. This allows one of the other Promscale instances in the
cluster to become the leader, and take over writing data to the database.

By default, Promscale expects exactly two instances in each cluster. If you have
more instances in your cluster, set `db-connections-max` on each Promscale
instance. Ensure that the sum does not exceed the maximum number of connections
allowed by the database.

<highlight type="important">
Prometheus instances are checked for liveness every ten seconds. This means that
the maximum possible data loss when the leader changes is not more than ten
seconds. If you set the `flush_duration` parameter to ten seconds you could
potentially lose two scrapes; one after the current live check, and the other
before the following live check. This is because they have an error range of
plus or minus 0.2 seconds. Ten seconds is the usual setting for the slowest
flush, provided you have new samples in the Prometheus queue.
</highlight>
