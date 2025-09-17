---
title: Stream data from Kafka into your service
excerpt: Stream data from Kafka into a Tiger Cloud service in order to store, query, and analyze your Kafka events efficiently
products: [cloud]
keywords: [stream, kafka, connect]
tags: [stream, connector]
---

import PrereqCloud from "versionContent/_partials/_prereqs-cloud-only.mdx";

# Stream data from Kafka

You use the Kafka source connector in $CLOUD_LONG to stream events from Kafka into your $SERVICE_LONG. This page explains how to connect $CLOUD_LONG to your Confluence Cloud Kafka cluster and Schema Registry using SASL/SCRAM authentication and service account–based API keys.

## Prerequisites

<PrereqCloud />

- [Sign up][confluence-signup] for Confluence Cloud.
- [Create][create-kafka-cluster] a Kafka cluster in Confluence Cloud.

## Access your Kafka cluster in Confluent Cloud

Take the following steps to prepare your Kafka cluster for connection to $CLOUD_LONG:

<Procedure>

   1. **Navigate to your cluster**

       1. Log in to [Confluent Cloud][confluent-cloud].
       1. Go to `Home` > `Environments` > Select your environment > Select your cluster.

   1. **Create a service account**

       If you already have a service account for $CLOUD_LONG, you can reuse it. 

       1. Go to `Access control` > `Service accounts` >`Create service account`.
       1. Enter the following details:
       
          - Name: `tigercloud-access` 
          - Description: `Service account for the Tiger Cloud source connector`
          
       1. Click `Create`. 

   1. **Create API keys**
   
       1. Under `Cluster overview` in the left sidebar, select `API Keys`.
       1. Click `Add key`.
       1. Choose `Service Account` and select `tigercloud-access`.
       1. Click `Create API` key. 
       1. Download and securely store the API key (SASL/SCRAM username) and secret (SASL/SCRAM password). 

          You need these to configure your Kafka source connector in $CLOUD_LONG.

   1. **Add ACLs to the service account**

       Grant the service account permission to describe the cluster, read topics, and consume with a consumer group.

       1. Go to `Access control` > `Service accounts` > `tigercloud-access`.
       1. Under `ACLs`, click `Add ACL` and add the following:

          - ACL 1: Cluster access
            - `Resource type`: `Cluster`
            - `Operation`: `DESCRIBE`
            - `Permission`: `ALLOW`
          - ACL 2: Topic access
            - `Resource type`: `Topic`
            - `Topic name`: Select the topics that Tiger Cloud should read
            - `Pattern type`: `LITERAL`
            - `Operation`: `READ`
            - `Permission`: `ALLOW`
          - ACL 3: Consumer group access
            - `Resource type`: `Consumer group`
            - `Consumer group ID`: `tigercloud-kafka/<tiger_cloud_project_id>`. See [Find your connection details][connection-info] for where to find your project ID
            - `Pattern type`: `PREFIXED`
            - `Operation`: `READ`
            - `Permission`: `ALLOW`

       1. Save the ACLs.

Your Kafka cluster is ready to connect to $CLOUD_LONG using SASL/SCRAM.

</Procedure>

## Configure Confluent Cloud Schema Registry

$CLOUD_LONG requires access to the Schema Registry to fetch schemas for Kafka topics. Take the following steps to configure the Schema Registry. 

<Procedure>

   1. **Navigate to Schema Registry**

      In Confluent Cloud, go to `Home` > `Environments` > Select your environment > `Stream Governance`.

   1. **Create Schema Registry API key**

      1. Go to `API Keys` > `Add API Key`.
      1. Choose `Service Account` > `tigercloud-access`.
      1. Under `Resource scope`, choose `Schema Registry` and add the following:
      
         - `Name`: `tigercloud-schema-registry-access`
         - `Description`: `API key for Tiger Cloud schema registry access`
         
      1. Click `Create API Key`.
      1. Download and securely store the API key and secret.
   
   1. **Assign roles for Schema Registry**
   
      1. Navigate to `Administration` > `Accounts & access` > `Service accounts`.
      1. Select the `tigercloud-access` service account.
      1. In the `Access` tab, add the following role assignments:
      
         - `ResourceOwner` on the service account. 
         - `DeveloperRead` on schema subjects. 
            
            Choose `All schema subjects` or restrict to specific subjects as required. 
      1. Save the role assignments.
   
Your Confluent Cloud Schema Registry is now accessible to $CLOUD_LONG using the API key and secret.

</Procedure>

## Add Kafka source connector in $CLOUD_LONG

Take the following steps to create a Kafka source connector in $CONSOLE_LONG.

<Procedure>

1. **In [$CONSOLE_SHORT][console], select your $SERVICE_SHORT**
1. **Go to `Connectors` > `Source connectors` > `Kafka`**
1. **Click the pencil icon, then set the connector name**
1. **Set up Kafka authentication**



1. **Set up Schema Registry**



1. **Select topics to sync**


Your Kafka connector is configured and ready to stream events. 

</Procedure>



[confluent-cloud]: https://confluent.cloud/
[connection-info]: /integrations/:currentVersion:/find-connection-details/
[confluence-signup]: https://www.confluent.io/get-started/
[create-kafka-cluster]: https://docs.confluent.io/cloud/current/clusters/create-cluster.html
[console]: https://console.cloud.timescale.com/dashboard/services