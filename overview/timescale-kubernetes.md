---
title: TimescaleDB on Kubernetes
excerpt: How TimescaleDB works on Kubernetes
keywords: [Kubernetes, high availability]
tags: [helm, multi-node]
---

# TimescaleDB on Kubernetes

You can install a TimescaleDB instance on any Kubernetes deployment. Use the
`timescaledb-single` Helm chart to deploy a highly available TimescaleDB
database, and the `timescaledb-multinode` Helm chart to deploy a multi-node
distributed TimescaleDB database.

## High availability TimescaleDB

The `timescaledb-single` Helm chart performs these actions:

*   Creates three default Pods using Kubernetes
  [StatefulSet](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/).
*   Creates each Pod that has a container using the [TimescaleDB Docker
  image](https://github.com/timescale/timescaledb-docker-ha).
*   Installs TimescaleDB 2.1 and PG 13.
*   Creates containers that run a TimescaleDB instance and
  [Patroni](https://patroni.readthedocs.io/en/latest/) agent.
*   Configures each TimescaleDB instance for replication with one master and two
  replicas.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/timescaledb-single.png" alt="Illustration of Highly Available TimescaleDB without backups to S3" width="640"/>

When you deploy on AWS Elastic Kubernetes service the Pods are scheduled on
nodes which run in different availability zones (AZs). An AWS Elastic load
balancer (ELB) is configured to handle routing incoming traffic to the master
Pod.

<Highlight type="note">
The backup to S3 is turned off by default. To configure backup location,
credentials, schedules, and more, see the [Administrator
Guide](https://github.com/timescale/timescaledb-kubernetes/blob/master/charts/timescaledb-single/admin-guide.md/).
</Highlight>

When configured for backups to S3:

*   Each Pod also includes a container running
  [pgBackRest](https://pgbackrest.org/).
*   Two [cron jobs](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs)
are created to handle full weekly and incremental daily backups.
*   The backups are stored in an S3 bucket.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/timescaledb-single-backups.png" alt="Highly Available TimescaleDB with backups to S3" width="640"/>

## Multi-node distributed TimescaleDB

The `timescaledb-multinode` Helm chart deploys a multinode TimescaleDB cluster
that sets up:

*   Creates s single TimescaleDB `Access Node` using Kubernetes
  [StatefulSet](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/).
*   Creates three Pods containing `Data Nodes`using another Kubernetes
  StatefulSet.
*   Creates each Pod that has a container using a Docker image which includes the
  TimescaleDB multi-node sources.

To add or remove nodes, change the `dataNodes` parameter in
the `values.yaml` file. Do this before installing TimescaleDB from the
`timescaledb-multinode` Helm chart. For details about the parameters you can
set, see the [Administrator Guide][admin-guide].

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/timescaledb-multi.png" alt="Multi-node TimescaleDB on Kubernetes" width="640"/>

When you deploy on AWS Elastic Kubernetes service, an AWS Elastic load balancer
(ELB) is configured to handle routing incoming traffic to the access node.

[admin-guide]: https://github.com/timescale/timescaledb-kubernetes/blob/master/charts/timescaledb-multinode/admin-guide.md
