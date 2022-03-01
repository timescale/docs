# TimescaleDB on Kubernetes
You can install a TimescaleDB instance on any Kubernetes deployment. Use the `timescaledb-single` Helm chart to deploy a highly available TimescaleDB database, and the `timescaledb-multinode` Helm chart to deploy a multi-node distributed TimescaleDB database. 

## Highly avaiable TimescaleDB 

The `timescaledb-single` Helm chart does the following:

- Creates three default pods using a Kubernetes [StatefulSet](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/).
- Each pod has a container created using the [TimescaleDB Docker image](https://github.com/timescale/timescaledb-docker-ha).
  - TimescaleDB 2.1 and PG 13
- Each of the containers runs a TimescaleDB instance and [Patroni](https://patroni.readthedocs.io/en/latest/) agent.
- Each TimescaleDB instance is configured for replication  with one master and two replicas.

<img src="./timescaledb-single.png" width="640" />

When you deploy on AWS EKS:
- The pods are scheduled on nodes which run in different Availability Zones (AZs).
- An AWS Elastic Load Balancer (ELB) is configured to handle routing incoming traffic to the Master pod.

<highlight type="note">
The backup to S3 is disabled by default. See the
[Administrator Guide](admin-guide.md#backups) on how to configure backup location, credentials, schedules, and more.
</highlight>

When configured for backups to S3:
- Each pod also includes a container running [pgBackRest](https://pgbackrest.org/).
- By default, two [CronJobs](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/) are created to handle full weekly and incremental daily backups.
- The backups are stored to an S3 bucket.


<img src="./timescaledb-single-backups.png" width="640" />


## Multi-node distributed TimescaleDB

The `timescaledb-multinode` Helm chart deploys a multinode TimescaleDB cluster that does the following:

- Creates a single TimescaleDB **Access Node** using a Kubernetes [StatefulSet](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/).
- Creates three pods by default containing **Data Nodes** using another Kubernetes StatefulSet
- Each pod has a container created using a Docker image which includes the TimescaleDB multinode sources

<img src="./timescaledb-multi.png" width="640" />

When deploying on AWS EKS:
- An AWS Elastic Load Balancer (ELB) is configured to handle routing incoming traffic to the Access Node.
