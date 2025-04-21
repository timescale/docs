---
title: Manage read replication
excerpt: For read-intensive apps, Timescale Cloud enables you to create read-only replicas that take over read queries and offload your primary node. Learn to crete read-only replicas in Timescale Console
product: cloud
keywords: [replicas, scaling]
tags: [replicas, scaling, ha]
---

# Manage read replication

You use $READ_REPLICAs to power your read-intensive apps and business intelligence tooling. Using $READ_REPLICAs to serve 
reads for your app removes the load from the primary data instance, and enables your $SERVICE_SHORT to improve ingest performance. 
This is particularly useful when read traffic is very spiky and risks impacting ingest performance, or where reads have 
a lower priority to writes. 

This page shows you how to create and manage $READ_REPLICAs.

## What is read replication?

A $READ_REPLICA is a read-only copy of the primary data instance in your $SERVICE_LONG. Queries on $READ_REPLICAs have minimal impact on the performance of the primary data instance. This enables you to interact with 
up-to-date production data for analysis or to scale out reads beyond the limits of your primary data instance. Read replicas can be short-lived and deleted when a session of data analysis is complete, or long-running to power a
business intelligence (BI) tool. 

You use $READ_REPLICAs for **read** scaling. To limit data loss for your $SERVICE_LONGs, use [$HA_REPLICAs][ha].

A $READ_REPLICA is the set of one or more nodes that share the same endpoint in $CONSOLE. You query each set as a single replica. $CLOUD_LONG balances the load between the nodes in the set for you. 

You can create as many $READ_REPLICAs as you need. For security and resource isolation, each $READ_REPLICA has unique connection details. 

## Prerequisites

To follow this procedure:

- Create a target $SERVICE_LONG.
- Create a [read-only user][read-only-role] on the primary data instance. 

  A user with the read-only permissions cannot access the primary data instance directly. This user is propagated to the $READ_REPLICAs when you create them.

## Create a $READ_REPLICA

To create a secure $READ_REPLICA for your read-intensive apps: 

<Procedure>

1. **In [$CONSOLE][timescale-console-services], select your target $SERVICE_SHORT**

1. **Click `Operations` > `Read replicas` > `Add a read replica`**

1. **Configure your replica** 

    Configure the number of nodes, compute size, connection pooling, and the name for your replica, then click `Create read replica`.

   ![Create a read replica in Timescale Console](https://assets.timescale.com/docs/images/create-read-replica-timescale-console.png)

1. **Save the connection information**

    The connection information for each read replica is unique. If you add or remove nodes from an existing replica, the connection information of that set changes. 

</Procedure>

## Edit a $READ_REPLICA

You can change the number of nodes in an existing $READ_REPLICA to better handle your reads:

<Procedure>

1. **In [$CONSOLE][timescale-console-services], select your target $SERVICE_SHORT**

1. **Click `Operations` > `Read replicas`**

   You see a list of all $READ_REPLICAs configured for this $SERVICE_SHORT.

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
