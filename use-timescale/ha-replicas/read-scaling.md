---
title: Read scaling
excerpt: For read-intensive apps, Tiger Cloud enables you to create read-only replica sets that take over read queries. Create read-only replica sets with automated load balancing in Tiger Cloud Console
products: [cloud]
price_plans: [scale, enterprise]
keywords: [replicas, scaling]
tags: [replicas, scaling, ha]
---

# Read scaling

When read-intensive workloads compete with high ingest rates, your primary data instance can become a bottleneck. Spiky query traffic, analytical dashboards, and business intelligence tools risk slowing down ingest performance and disrupting critical write operations.

With $READ_REPLICA sets in $CLOUD_LONG, you can scale reads horizontally and keep your applications responsive. By offloading queries to replicas, your $SERVICE_SHORT maintains high ingest throughput while serving large or unpredictable read traffic with ease. This approach not only protects write performance but also gives you confidence that your read-heavy apps and BI workloads will run smoothly—even under pressure.

![Read scaling in Timescale](https://assets.timescale.com/docs/images/read-scaling-timescale.png)

This page shows you how to create and manage $READ_REPLICA sets in $CONSOLE.

## What is read replication?

A $READ_REPLICA is a read-only copy of your primary database instance. Queries on $READ_REPLICAs have minimal impact on the performance of the primary instance. This enables you to interact with up-to-date production data for analysis, or to scale out reads beyond the limits of your primary instance. $READ_REPLICA_CAPs can be short-lived and deleted when a session of data analysis is complete, or long-running to power an application or a business intelligence tool. 

A $READ_REPLICA set in $CLOUD_LONG is a group of one or more $READ_REPLICA nodes that are accessed through the same endpoint. You query each set as a single replica. $CLOUD_LONG balances the load between the nodes in the set for you.

You can create as many $READ_REPLICA sets as you need. For security and resource isolation, each $READ_REPLICA set has unique connection details.

You use $READ_REPLICA sets for horizontal **read** scaling. To limit data loss for your $SERVICE_LONGs, use [$HA_REPLICAs][ha].

## Prerequisites

To follow this procedure:

- Create a target $SERVICE_LONG.
- Create a [read-only user][read-only-role] on the primary data instance. 

  A user with read-only permissions cannot make changes in the primary database. This user is propagated to the $READ_REPLICA set when you create it.

## Create a $READ_REPLICA set

To create a secure $READ_REPLICA set for your read-intensive apps: 

<Procedure>

1. **In [$CONSOLE][timescale-console-services], select your target $SERVICE_SHORT**

1. **Click `Operations` > `Read scaling` > `Add a read replica set`**

1. **Configure your replica set** 

    Configure the number of nodes, compute size, connection pooling, and the name for your replica, then click `Create read replica set`.

   ![Create a read replica set in $CONSOLE_LONG](https://assets.timescale.com/docs/images/tiger-cloud-console/create-read-replica-set-tiger-console.png)

1. **Save the connection information**

   The username and password of a read replica set are the same as the primary $SERVICE_SHORT. They cannot be changed independently. 

   The connection information for each $READ_REPLICA set is unique. You can add or remove nodes from an existing set and the connection information of that set will remain the same. To find the connection information for an existing $READ_REPLICA set: 

     1. Select the primary $SERVICE_SHORT in $CONSOLE.
    
     1. Click `Operations` > `Read scaling`.

     1. Click the 🔗 icon next to the replica set in the list. 

    

</Procedure>

## Edit a $READ_REPLICA set

You can edit an existing $READ_REPLICA set to better handle your reads. This includes changing the number of nodes, compute size, storage, and IOPS, as well as configuring $VPC and other features. 

<Procedure>

To change the compute and storage configuration of your $READ_REPLICA set: 

1. **In [$CONSOLE][timescale-console-services], expand and click the $READ_REPLICA set under your primary $SERVICE_SHORT**

   ![Read replicas in $CONSOLE_LONG](https://assets.timescale.com/docs/images/tiger-cloud-console/read-replica-sets-tiger-console.png)

1. **Click `Operations` > `Compute and storage`**

   ![Read replica compute and storage in $CONSOLE_LONG](https://assets.timescale.com/docs/images/tiger-cloud-console/read-replica-set-config-tiger-console.png)

1. **Change the replica configuration and click `Apply`**


</Procedure>

## Manage data lag for your $READ_REPLICA sets

$READ_REPLICA_CAP sets use asynchronous replication. This can cause a slight lag in data to the primary database instance. The lag
is measured in bytes, against the current state of the primary instance. To check the status and lag for your $READ_REPLICA set:

<Procedure>

1. **In [$CONSOLE][timescale-console-services], select your primary $SERVICE_SHORT**
   
1. **Click `Operations` > `Read scaling`**

   You see a list of configured $READ_REPLICA sets for this $SERVICE_SHORT, including their status and lag:

   ![Read replica sets](https://assets.timescale.com/docs/images/tiger-cloud-console/configured-replica-set-tiger-console.png)

1. **Configure the allowable lag**

    1. Select the replica set in the list. 
    1. Click `Operations` > `Database parameters`. 
    1. Adjust `max_standby_streaming_delay` and `max_standby_archive_delay`.

       This is not recommended for cases where changes must be immediately represented, for example, for user credentials.

</Procedure> 


## Delete a $READ_REPLICA set

To delete a replica set:

<Procedure>

1. **In [$CONSOLE][timescale-console-services], select your primary $SERVICE_SHORT**

1. **Click `Operations` > `Read scaling`**

1. **Click the trash icon next to a replica set**

   Confirm the deletion when prompted.

</Procedure> 


[cloud-login]: https://console.cloud.timescale.com
[ha]: /use-timescale/:currentVersion:/ha-replicas/high-availability/
[read-only-role]: /use-timescale/:currentVersion:/security/read-only-role/#create-a-read-only-user
[timescale-console-services]: https://console.cloud.timescale.com/dashboard/services
