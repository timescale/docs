---
title: Promscale and Prometheus high availability
excerpt: Configure Promscale and Prometheus high availability
products: [promscale]
keywords: [high availability, Prometheus]
---

import PromscaleDeprecation from "versionContent/_partials/_deprecated-promscale.mdx";

# Promscale and Prometheus high availability

<PromscaleDeprecation />

Promscale supports high availability alongside Prometheus high availability.
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

## Leader election using external labels

To process data from Prometheus running in HA mode, Prometheus must be
configured to communicate which cluster it belongs to. This is done using
external labels. In particular, each Prometheus instance sends a `cluster` label
to indicate which cluster it's in, and a `__replica__` label that provides a
unique identifier for the Prometheus instance within the cluster. Two Prometheus
instances running as part of a HA cluster must send the same `cluster` label and
different `__replica__` labels.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/promscale-ha.png" alt="Promscale architecture for Prometheus in HA using external labels"/>

In Kubernetes environments, it is useful to set the `__replica__` label to match
the pod name, and the cluster name as the Prometheus deployment or `statefulset`
name. If you are using the [Prometheus
Operator](https://github.com/prometheus-operator/prometheus-operator#prometheus-operator),
you can set it with these configuration parameters:

```yaml
  replicaExternalLabelName: "__replica__"
  prometheusExternalLabelName: "cluster"
```

In bare metal environments, and any environment where you are not using
Kubernetes, you can configure external labels with the cluster and replica names
in each Prometheus instance configuration, like this:

```yaml
global:
  external_labels:
    __replica__: <REPLICA_NAME> (This should be unique name of the Prometheus instance)
    cluster: <CLUSTER_NAME> (This should be the name of the Prometheus deployment, which should be common across the Prometheus replica instances.)
```

When you have configured your Prometheus instances to send the correct labels,
you can start Promscale with the `--metrics.high-availability` CLI flag, like this:

```bash
promscale --metrics.high-availability
```

Promscale automatically elects a single replica in each cluster as the current
leader. Only data sent from that replica is ingested. If that leader replica
stops sending data, then a new replica is elected as the leader.
