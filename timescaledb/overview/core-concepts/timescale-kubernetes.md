# TimescaleDB on Kubernetes
You can install a TimescaleDB instance on any Kubernetes deployment. Use the `timescaledb-single` Helm chart to deploy a highly available TimescaleDB database, and the `timescaledb-multinode` Helm chart to deploy a multi-node distributed TimescaleDB database. 

## Highly available TimescaleDB 

The `timescaledb-single` Helm chart does the following:

- Creates three default Pods using Kubernetes [StatefulSet](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/).
- Creates each Pod that has a container using the [TimescaleDB Docker image](https://github.com/timescale/timescaledb-docker-ha).
- Installs TimescaleDB 2.1 and PG 13.
- Creates containers that run a TimescaleDB instance and [Patroni](https://patroni.readthedocs.io/en/latest/) agent.
- Configures each TimescaleDB instance for replication with one master and two replicas.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/timescaledb-single.png" alt="Illustration of Highly Available TimescaleDB without backups to S3" width="640"/>


When you deploy on AWS Elastic Kubernetes Service:
- The Pods are scheduled on nodes which run in different Availability Zones (AZs).
- An AWS Elastic Load Balancer (ELB) is configured to handle routing incoming traffic to the master Pod.

<highlight type="note">
The backup to S3 is disabled by default. To configure backup location, credentials, schedules, and more, see the [Administrator Guide](https://github.com/timescale/timescaledb-kubernetes/blob/master/charts/timescaledb-single/admin-guide.md/).
</highlight>

When configured for backups to S3:
- Each Pod also includes a container running [pgBackRest](https://pgbackrest.org/).
- Two [CronJobs](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs) are created to handle full weekly and incremental daily backups.
- The backups are stored to an S3 bucket.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/timescaledb-single-backups.png" alt="Illustration of Highly Available TimescaleDB with backups to S3" width="640"/>

## Multi-node distributed TimescaleDB

The `timescaledb-multinode` Helm chart deploys a multinode TimescaleDB cluster that sets up:

- Creates s single TimescaleDB `Access Node` using Kubernetes [StatefulSet](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/).
- Creates three Pods containing `Data Nodes`using another Kubernetes StatefulSet.
- Creates each Pod that has a container using a Docker image which includes the TimescaleDB multinode sources.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/timescaledb-multi.png" alt="Multi-node TimescaleDB on Kubernetes" width="640"/>

When you deploy on AWS Elastic Kubernetes Service, an AWS Elastic Load Balancer (ELB) is configured to handle routing incoming traffic to the access node.
