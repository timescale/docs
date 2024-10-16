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

HA replicas are exact, up-to-date copies of your database hosted in multiple AWS availability zones (AZ) within the same region as your primary node. They automatically take over operations as your primary data node if the original primary data node becomes unavailable. The primary node streams its write-ahead log (WAL) to the replicas to minimize the chances of data loss during failover. 

HA replicas can be synchronous and asynchronous. 

- Synchronous replicas: the primary commits its next write once the replica confirms that the previous write is complete. There is no lag between the primary and the replica. They are in the same state at all times. This is preferable if you need the highest level of data integrity. However, this affects the primary ingestion time.
  
- Asynchronous replicas: the primary commits its next write without the confirmation of the previous write completion. The asynchronous HA replicas often have a lag, in both time and data, compared to the primary. This is preferable if you need the shortest primary ingest time.

image from the doc draft

HA replicas have separate unique addresses that you can use to serve read-only requests in parallel to your 
primary data node. When your primary data node fails, Timescale Cloud automatically fails over to 
an HA replica within 30 seconds. During failover, the read-only address is unavailable while Timescale Cloud automatically creates a new HA replica. The time to make this replica depends on several factors, including the size of your data.

Operations such as upgrading your Timescale Cloud Service to a new major or minor version may necessitate 
a service restart. Restarts are run during the [maintenance window][upgrade]. To avoid any downtime, each data
node is updated in turn. That is, while the primary data node is updated, a replica is promoted to primary. 
After the primary is updated and online, the same maintenance is performed on the HA replicas.

To ensure that all Timescale Cloud Services have minimum downtime and data loss in the most common
failure scenarios and during maintenance, [rapid recovery][rapid-recovery] is enabled by default for all services.

## Choose an HA strategy

The following HA configurations are available in Timescale Cloud:

- **Non-production**: no replica, best for developer environments.

- **High availability**: a single async replica in a different AWS availability zone. Provides high availability with cost efficiency. Best for production apps. 

- **Highest availability**: two replicas in different AWS availability zones. Available replication modes are:

  - *Optimized* - two async replicas. Provides the highest level of availability (two AZs) and the ability to query the HA system. Best for absolutely critical apps.
  - *High data integrity* - one sync replica and one async replica. The sync replica is identical to the primary at all times. Best for apps that can tolerate no data loss.

The following table summarizes the differences between these HA configurations:

|| High availability <br/> (1 async) | Optimized <br/> (2 async) | High data integrity <br/> (1 sync + 1 async) | 
|-------|----------|------------|-----|
|Write flow |The primary streams its WAL to the async replica, which may have a slight lag compared to the primary, providing 99.9% uptime SLA. |The primary streams its writes to both async replicas, providing 99.9+% uptime SLA.|The primary streams its writes to the sync and async replicas. The primary waits for a completion callback from the sync replica to send additional writes. The async replica is never ahead of the sync one.|
|Additional read replica|Recommended. Reads from the HA replica may cause availability and lag issues. |Not needed. You can still read from the HA replica even if one of them is down. Configure an additional read replica only if your read use case is significantly different from your write use case.|Highly recommended. If you run heavy queries on a sync replica, it may fall behind the primary. Specifically, the primary holds until a write transaction completion is confirmed by the sync replica. If it takes too long, the transaction is canceled.|
|Choosing the replica to read from manually| Not applicable. |Not available. Queries are load-balanced against all available HA replicas. |Not available. Queries are load-balanced against all available HA replicas.|
| Sync replication | Only async replicas are supported in this configuration. |Only async replicas are supported in this configuration. | Supported.|
| Failover flow | <ul><li>If the primary fails, the replica becomes the primary while a new node is created, with only seconds of downtime.</li><li>If the replica fails, a new async replica is created without impacting the primary. If you read from the async HA replica, those will fail until the new replica is available.</li></ul> |<ul><li>If the primary fails, one of the replicas becomes the primary while a new node is created, with the other one still available for reads.</li><li>If the replica fails, a new async replica is created in another AZ, without impacting the primary. The newly created replica is behind the primary and the original replica while it catches up.</li></ul>|<ul><li>If the primary fails, the sync replica becomes the primary while a new node is created, with the async one still available for reads.</li><li>If the async replica fails, a new async replica is created. Heavy reads on the sync replica may delay the ingest time of the primary while a new async HA is created. Data integrity remains high but primary ingest performance may degrade.</li><li>If the sync replica fails, the async replica becomes the sync one, and a new async replica is created. The primary may experience some ingest performance degradation during this time.</li></ul>|
| Cost composition | Primary + async (2x) |Primary + 2 async (3x)|Primary + 1 async + 1 sync (3x)|
| Tier | Performance, Scale, and Enterprise  |Scale and Enterprise|Scale and Enterprise|

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
[upgrade]: /use-timescale/:currentVersion:/upgrades/
[pricing-plans]: /about/:currentVersion:/pricing-and-account-management/
[rapid-recovery]: /use-timescale/:currentVersion:/ha-replicas/#rapid-recovery
