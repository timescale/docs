---
title: Read scaling
excerpt: For read-intensive apps, Timescale Cloud enables you to create read-only replica sets that take over read queries and offload your primary node. Create read-only replica sets with automated load balancing in Timescale Console
product: cloud
price_plans: [scale, enterprise]
keywords: [replicas, scaling]
tags: [replicas, scaling, ha]
---

# Read scaling

You use $READ_REPLICA sets in $CLOUD_LONG for horizontal read scaling, to power your read-intensive apps and business intelligence tooling. Additionally, using the replica sets to serve reads for your app unloads the primary data instance and enables your $SERVICE_SHORT to improve ingest performance. 
This is particularly useful when read traffic is very spiky and risks impacting ingest performance, or where reads have 
a lower priority to writes. 

This page shows you how to create and manage $READ_REPLICA sets in $CONSOLE.

## What is read replication?

A $READ_REPLICA is a read-only copy of your primary data instance. Queries on $READ_REPLICA have minimal impact on the performance of the primary instance. This enables you to interact with up-to-date production data for analysis, or to scale out reads beyond the limits of your primary instance. $READ_REPLICA_CAPs can be short-lived and deleted when a session of data analysis is complete, or long-running to power a business intelligence tool. 

A $READ_REPLICA set in $CLOUD_LONG is a group of one or more $READ_REPLICA nodes that share the same endpoint. You query each set as a single replica. $CLOUD_LONG balances the load between the nodes in the set for you.

You can create as many $READ_REPLICA sets as you need. For security and resource isolation, each $READ_REPLICA set has unique connection details.

You use $READ_REPLICA sets for horizontal **read** scaling. To limit data loss for your $SERVICE_LONGs, use [$HA_REPLICAs][ha].

## Prerequisites

To follow this procedure:

- Create a target $SERVICE_LONG.
- Create a [read-only user][read-only-role] on the primary data instance. 

  A user with the read-only permissions cannot access the primary data instance directly. This user is propagated to the $READ_REPLICA set when you create them.

## Create a $READ_REPLICA set

To create a secure $READ_REPLICA set for your read-intensive apps: 

<Procedure>

1. **In [$CONSOLE][timescale-console-services], select your target $SERVICE_SHORT**

1. **Click `Operations` > `Read replica set` > `Add a read replica`**

1. **Configure your replica set** 

    Configure the number of nodes, compute size, connection pooling, VPC, and the name for your replica, then click `Create read replica set`.

   ![Create a read replica in Timescale Console](https://assets.timescale.com/docs/images/create-read-replica-timescale-console.png)

1. **Save the connection information**

    The connection information for each $READ_REPLICA set is unique. If you add or remove nodes from an existing set, the connection information of that set changes. 

</Procedure>

## Edit a $READ_REPLICA set

You can change the number of nodes in an existing $READ_REPLICA set to better handle your reads:

<Procedure>

1. **In [$CONSOLE][timescale-console-services], select your target $SERVICE_SHORT**

1. **Click `Operations` > `Read replica set`**

   You see a list of all $READ_REPLICA sets configured for this $SERVICE_SHORT.

   ![Read replicas in Timescale Console](https://assets.timescale.com/docs/images/read-replicas-timescale-console.png)

1. **Click `⋮` > `Edit read replica` next to a replica** 

1. **Change the number of nodes**

   - To add nodes, select the number of nodes in the drop-down, then click `Add node`. 
   - To remove nodes, open `Delete nodes`, select the number of nodes to delete, then click `Delete node`. 

   ![Add nodes to replicas in Timescale Console](https://assets.timescale.com/docs/images/add-nodes-read-replica-timescale-console.png)   

1. **Reconnect to the replica** 

    When you add or remove nodes from an existing $READ_REPLICA, the connection information of that set changes, so you need to connect to it again. Find the updated connection information by clicking 🔗 next to the updated replica in the list. 

</Procedure>

Alternatively, select the $READ_REPLICA in `Services`, then click `Operations` > `Nodes` > `Add a node`.

## Manage data lag for your $READ_REPLICAs

Read replicas use asynchronous replication. This can cause a slight lag in data to the primary data instance. The lag
is measured in bytes, against the current state of the primary instance. To check the status and lag for your $READ_REPLICA:

<Procedure>

1. **In [$CONSOLE][timescale-console-services], select a $SERVICE_SHORT**
   
1. **Click `Operations` and scroll down**

   You see a `Read replicas` widget with the list of configured replicas for this $SERVICE_SHORT, and their status and lag. 

1. **Configure the allowable lag**

    1. In `Services`, select the $READ_REPLICA.  
    1. Click `Operations` > `Database parameters`. 
    1. Adjust `max_standby_streaming_delay` and `max_standby_archive_delay`.

       This is not recommended for cases where changes must be immediately represented, for example, for user credentials.

</Procedure> 

[cloud-login]: https://console.cloud.timescale.com
[ha]: /use-timescale/:currentVersion:/ha-replicas/high-availability/
[read-only-role]: /use-timescale/:currentVersion:/security/read-only-role/#create-a-read-only-user
[timescale-console-services]: https://console.cloud.timescale.com/dashboard/services
