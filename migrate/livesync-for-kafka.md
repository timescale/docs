---
title: Stream data from Kafka into your service
excerpt: Stream data from Kafka into a Tiger Cloud service in order to store, query, and analyze your Kafka events efficiently
products: [cloud]
keywords: [stream, kafka, connect]
tags: [stream, connector]
---

import PrereqCloud from "versionContent/_partials/_prereqs-cloud-only.mdx";

# Stream data from Kafka

You use the Kafka source connector in $CLOUD_LONG to stream events from Kafka into your $SERVICE_SHORT. $CLOUD_LONG connects to your Confluent Cloud Kafka cluster and Schema Registry using SASL/SCRAM authentication and service account–based API keys. Only the Avro format is currently supported.

This page explains how to connect $CLOUD_LONG to your Confluence Cloud Kafka cluster.

## Prerequisites

<PrereqCloud />

- [Sign up][confluence-signup] for Confluence Cloud.
- [Create][create-kafka-cluster] a Kafka cluster in Confluence Cloud.

## Access your Kafka cluster in Confluent Cloud

Take the following steps to prepare your Kafka cluster for connection to $CLOUD_LONG:

<Procedure>

   1. **Create a service account**

       If you already have a service account for $CLOUD_LONG, you can reuse it.  To create a new service account:

       1. Log in to [Confluent Cloud][confluent-cloud].
       1. Click the burger menu at the top-right of the pane, then press 
          `Access control` > `Service accounts` >`Add service account`.
       1. Enter the following details:
       
          - Name: `tigercloud-access` 
          - Description: `Service account for the Tiger Cloud source connector`

       1. Add the service account owner role, then click `Next`.
      
       1. Select a role assignment, then click `Add` 

       1. Click `Next`, then click `Create service account`.

   1. **Create API keys**

       1. In Confluent Cloud, click `Home` > `Environments` > Select your environment > Select your cluster.
       1. Under `Cluster overview` in the left sidebar, select `API Keys`. 
       1. Click `Add key`, choose `Service Account` and click `Next`. 
       1. Select `tigercloud-access`, then click `Next`. 
       1. For your cluster, choose the `Operation` and select the following `Permission`s, then click `Next`:
          - `Resource type`: `Cluster`
          - `Operation`: `DESCRIBE`
          - `Permission`: `ALLOW`
       1. Click `Download and continue`, then securely store the ACL.  
       1. Use the same procedure to add the following keys:
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
          You need these to configure your Kafka source connector in $CLOUD_LONG.

</Procedure>

## Configure Confluent Cloud Schema Registry

$CLOUD_LONG requires access to the Schema Registry to fetch schemas for Kafka topics. To configure the Schema Registry: 

<Procedure>

   1. **Navigate to Schema Registry**

      In Confluent Cloud, click `Environments` and select your environment, then click `Stream Governance`.

   1. **Create a Schema Registry API key**

      1. Click `API Keys`, then click `Add API Key`.
      1. Choose `Service Account`, select `tigercloud-access`, then click `Next`. 
      1. Under `Resource scope`, choose `Schema Registry`, select the `default` environment, then click `Next`. 
      2. In `Create API Key`, add the following, then click `Create API Key` :
      
         - `Name`: `tigercloud-schema-registry-access`
         - `Description`: `API key for Tiger Cloud schema registry access`

      1. Click `Download API Key` and securely store the API key and secret, then click `Complete`.
   
   1. **Assign roles for Schema Registry**

      1. Click the burger menu at the top-right of the pane, then press 
          `Access control` > `Accounts & access` > `Service accounts`.
      1. Select the `tigercloud-access` service account.
      1. In the `Access` tab, add the following role assignments for `All schema subjects`:
      
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
1. **Go to `Connectors` > `Source connectors`. Click `New Connector`, then select `Kafka`**
1. **Click the pencil icon, then set the connector name**
1. **Set up Kafka authentication**

   Enter the name of your cluster in Confluent Cloud and the information from the first `api-key-*.txt` that you 
      downloaded, then click `Authenticate`.
1. **Set up the Schema Registry**

   Enter the Service account ID and the information from the second `api-key-*.txt` that you
   downloaded, then click `Authenticate`.
1. **Select topics to sync**

    Add the schema and table, map the columns in the table, and click `Create connector`.


Your Kafka connector is configured and ready to stream events. 

</Procedure>



[confluent-cloud]: https://confluent.cloud/
[connection-info]: /integrations/:currentVersion:/find-connection-details/
[confluence-signup]: https://www.confluent.io/get-started/
[create-kafka-cluster]: https://docs.confluent.io/cloud/current/clusters/create-cluster.html
[console]: https://console.cloud.timescale.com/dashboard/services