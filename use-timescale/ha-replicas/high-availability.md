---
title: Manage high availability
excerpt: Set up HA replicas on Timescale for high availability
products: [cloud]
keywords: [high availability, replicas]
tags: [failover, availability zones, replication, wal]
cloud_ui:
    path:
        - [services, :serviceId, operations, replication]
---


# Manage high availability

For Timescale Cloud Service with very low tolerance for downtime, Timescale Cloud offers 
High Availability(HA) replicas. HA replicas significantly reduce the risk of downtime and data loss due to 
system failure, and enable services to avoid downtime during routine maintenance.

This page shows you how to choose the best high availability option for your Timescale Cloud Service.  

## What is HA replication?

HA replicas are exact, up-to-date copies of your database that automatically take over operations as your primary data 
node if the original primary data node becomes unavailable. HA replicas are synchronous or asynchronous hot standbys 
hosted in multiple AWS availability zones(AZ) that use streaming replication to minimize the chance of data loss during 
failover. That is, the primary node streams its write-ahead log (WAL) to the replicas.

HA replicas have separate unique addresses that you can use to serve read-only requests in parallel to your 
primary data node. When your primary data node fails, Timescale Cloud automatically _fails over_ to 
a HA replica. During failover, the read-only address is unavailable while Timescale Cloud automatically create 
a new HA replica. The time to make this replica depends on several factors, including the size of your data.
You

Operations such as upgrading your Timescale Cloud Service to a new major or minor version may necessitate 
a service restart. Restarts are run during the [maintenance window][upgrade]. To avoid any downtime, each data
node is updated in turn. That is, while the primary data node is updated, a replica is promoted to primary. 
After the primary is updated and online, the same maintenance is performed on the HA replicas.

To ensure that all Timescale Cloud Services have minimum downtown and data loss in the most common
failure scenarios and during maintenance, [rapid recovery][rapid-recovery] is enabled by default for all services.

## Rapid recovery

By default, all Timescale Cloud services have rapid recovery enabled. 

Because compute and storage are handled separately, there are different approaches available for
different types of failures, and you don't always have to recover from backup.
In particular, Timescale services recover quickly from compute failures, but
usually need a full recovery from backup for storage failures.

Compute failures are the most common cause of database failure. Compute failures
can be caused by hardware failing, or through things like unoptimized queries,
causing increased load that maxes out the CPU usage. In these cases, only the
compute and memory needs replacing since the data on disk is unaffected. If this
kind of failure occurs, your Timescale service immediately provisions a new
database node and mounts the database's existing storage to the new
node. Any WAL that was in memory then replays. This process typically only
takes thirty seconds, though it may take up to twenty minutes in some
circumstances, depending on the amount of WAL that needs replaying. Even in the
worst-case scenario, this recovery is an order of magnitude faster than a
standard recovery from backup procedure. The entire process for detecting and
recovering from a compute failure like this is fully automated, and you don't
need to take any action.

While compute failures are more common, it is also possible for disk hardware to
fail. This is rare, but if it happens, your Timescale service automatically
performs a full recovery from backup. For more information about backup and
recovery, see the [backup section][backup-recovery].

<Highlight type="important">
Always try to avoid situations that could max out your CPU usage. If your CPU
usage runs high for long periods of time, it can result in some issues, such as
WAL archiving getting queued behind other processes, which can cause a failure
and could result in a larger data loss. Timescale services are monitored for
these kinds of scenarios, to try and prevent data loss events before a failure
occurs.
</Highlight>



## Choose an HA strategy

The following HA configurations are available in Timescale Cloud:

- **Non-production**: no replica, best for developer environments.
- **High**: a single replica in a separate AWS availability zone. The High availability optimized mode is
    good for both price sensitive customers and those who care most about failover speed and performance.
    Async replication provides faster  write speeds and improved performance for apps with less stringent
    consistency requirements.

- **Highest**: two readable replicas in separate AWS availability zones. Available replication modes are:
  - *Optimized* - two asynchronous replicas: transactions are considered complete without waiting for the replicas to 
    confirm. Async replication provides faster write speeds and improved performance for apps with less stringent
    consistency requirements. When you access a HA read endpoint Timescale Cloud load balances across the replicas.
  - *High data integrity* - one synchronous replica and one asynchronous replica: A synchronous replica is guaranteed to 
    always be in the exact same state as the primary, minimizing failover time and ensuring no data loss. However, 
    synchronous replicas reduce ingest performance and do not provide a replica endpoint 
     
    Synchronous replication ensures the highest level of data consistency and safety. 


The `High` and `Highest` HA strategies are available with the [Scale and the Enterprise][pricing-plans] pricing plans.

To enable HA for a Timescale Cloud Service:  

<Procedure>

1.  In [Timescale Console][cloud-login], select the service to enable replication for.
1.  Click `Operations`, then select `High availability`.
1.  Choose your replication strategy, then click `Change configuration`.
    <img
    class="main-content__illustration"
    src="https://assets.timescale.com/docs/images/tsc-replication-add.png"
    alt="Creating a database replica in Timescale"
    />
    
1. In `Change high availability configuration`, click `Change config`. 

To change your HA replica strategy, click `Change configuration`, choose a strategy and click `Change configuration`.
To download the connection information for the HA replica, either click the link next to the replica
`Active configuration`, or find the information in the `Overview` tab for this service.

</Procedure>


## Test failover for your HA replicas

To test the failover mechanism, you can trigger a switchover. A switchover is a
safe operation that attempts a failover, and throws an error if the replica or
primary is not in a state to safely switch.

<Procedure>

1.  Connect to your primary node as `tsdbadmin` or another user that is part of
    the `tsdbowner` group.

    <Highlight type="note">
    You can also connect to the HA replica and check its node using this procedure.
    </Highlight>

1.  At the `psql` prompt, connect to the `postgres` database:

    ```sql
    \c postgres
    ```

    You should see `postgres=>` prompt.

1.  Check if your node is currently in recovery:

    ```sql
    select pg_is_in_recovery();
    ```

1.  Check which node is currently your primary:

    ```sql
    select * from pg_stat_replication;
    ```

    Note the `application_name`. This is your service ID followed by the
    node. The important part is the `-an-0` or `-an-1`.

1.  Schedule a switchover:

    ```sql
    CALL tscloud.cluster_switchover();
    ```

    By default, the switchover occurs in 30&nbsp;secs. You can change the time by passing
    an interval, like this:

    ```sql
    CALL tscloud.cluster_switchover('15 seconds'::INTERVAL);
    ```

1.  Wait for the switchover to occur, then check which node is your primary:

    ```sql
    SELECT * FROM pg_stat_replication;
    ```

    You should see a notice that your connection has been reset, like this:

    ```sql
    FATAL:  terminating connection due to administrator command
    SSL connection has been closed unexpectedly
    The connection to the server was lost. Attempting reset: Succeeded.
    ```

1.  Check the `application_name`. If your primary was `-an-1` before, it should
    now be `-an-0`. If it was `-an-0`, it should now be `-an-1`.

</Procedure>

[cloud-login]: https://console.cloud.timescale.com
[backup-recovery]: /use-timescale/:currentVersion:/backup-restore/backup-restore-cloud/
[upgrade]: /use-timescale/:currentVersion:/upgrades/
[pricing-plans]: /about/:currentVersion:/pricing-and-account-management/
[rapid-recovery]: (/use-timescale/:currentVersion:/ha-replicas/high-availability/#rapid-recovery)
