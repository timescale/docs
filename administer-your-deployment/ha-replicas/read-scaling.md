---
title: Manage read replication
excerpt: Understand how read scaling works in Timescale
product: cloud
keywords: [replicas, scaling]
tags: [replicas, scaling, ha]
---

# Manage read replication

You use read replicas to power your read-intensive apps and business intelligence tooling. Using read replicas to serve 
reads for your app removes load from the primary data instance, and enables your service to improve ingest performance. 
This is particularly useful when read traffic is very spiky and risks impacting ingest performance, or where reads have 
a lower priority to writes. 

This page shows you how to create and manage read replicas.

## What is read replication?

A read replica is a read-only copy of the primary data instance in your Timescale Cloud service. Queries on read 
replicas have minimal impact on the performance of the primary data instance. This enables you to interact with 
up-to-date production data for analysis or to scale out reads beyond the limits of your primary data instance. You use 
read replicas for read scaling. To limit data loss for your Timescale Cloud services, use [High availability][ha].

You can create as many read replicas as you need. Each read replica appears as its own service. You use a unique
connection string to interact with each read replica. This provides both security and resource isolation. To restrict 
access without isolation, you can create a [read-only role][read-only-role] for each Timescale Cloud service. Users 
with read-only permissions cannot access the primary data instance directly.

## Create a read replica

Read replicas can be short-lived and deleted when the analysis is complete, or long-running to power a
business intelligence (BI) tool. To create a secure read replica for your read-intensive apps: 

<Procedure>

1. Best practice is to create a [read-only role][read-only-role] for the person using the replica.

   You create the read-only user on the primary data instance. This user is propagated to the read
   replica when you create it.
1. In [Timescale Console][timescale-console-services], select the service to replicate.
1. Click `Operations`, then click `Read replicas`.
1. Click `Add read replica`, then select the configuration you want and click `Add read replica`.
1. Note the connection information for the read replica. 

    The connection string for each read replica is unique, and different to one you use for the primary data instance. 

</Procedure>

## Manage data lag for your read replicas

Read replicas use asynchronous replication. This can cause slight lag in data to the primary data instance. Replica lag
is measured in bytes against the current state of the primary database. To see the lag for both read and
high-availability replicas replicas running on Timescale Cloud:

To check the status and lag for your read replicas:

<Procedure>

1. In [Timescale Console][timescale-console-services], select a service.
   
   The status of the read-replica and data lag is displayed:

    ![Read replica status and lag](https://assets.timescale.com/docs/images/read-replica-lag-status.png)

    You can also see this information in the `Operations` tab.

1. To reduce the allowable lag, adjust the `max_standby_streaming_delay`, and `max_standby_archive_delay` parameters.

   This is not best practice where changes must be immediately represented, such as for user credentials.

</Procedure> 



[cloud-login]: https://console.cloud.timescale.com
[ha]: /use-timescale/:currentVersion:/ha-replicas/high-availability/
[read-only-role]: /use-timescale/:currentVersion:/security/read-only-role/#create-a-read-only-user
[timescale-console-services]: https://console.cloud.timescale.com/dashboard/services
