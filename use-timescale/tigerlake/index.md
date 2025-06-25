---
title: TigerLake
excerpt: Unifies the Tiger Cloud operational architecture with the data lake (S3 + Iceberg) architectures. This enables real-time application building alongside efficient data pipeline management within a single system
products: [cloud]
keywords: [data lake]
---

# TigerLake

TigerLake unifies the $CLOUD_LONG operational architecture with the data lake (S3 + Iceberg) architectures. This enables real-time application building alongside efficient data pipeline management within a single system.

This experimental release is a native integration enabling continuous replication
between AWS S3 Tables (managed Iceberg and catalog) running in your AWS account and
relational tables and hypertables in $CLOUD_LONG. 

You interact directly with TigerLake using $CONSOLE_LONG. The pricing associated
with the integration will be introduced at a later date. This document explains how to
get started for the early access partners. There are no costs associated with the $SERVICE_LONG—we set everything up and then invite you to the project.

## Get started

You first create an S3 table bucket, then use an with an ARN role to enable $CLOUD_LONG to write to this bucket. $CONSOLE_LONG supplies a CloudFormation template. You set up $CLOUD_LONG
using either:

- AWS Management Console
- AWS CloudFormation CLI


### Set up TigerLake using AWS Management Console

1. Sign in to the AWS Management Console and open  [CloudFormation console][cmc].
1. In the navigation bar on the top of the page:
   1. Choose the name of the currently displayed AWS Region.
   2. Set it to the Region in which you want to create your table bucket.
   
   This must match the region your $SERVICE_LONG is running in. If the regions do
   not match, AWS charges you for cross-region data transfer.
1. Click `Create stack`. 

   If prompted, choose `With new resources`. This is the standard option.

1. Under `Specify Template`, copy the following URL into the Amazon S3 URL box and click `Next`.

   ```yaml
   https://tigerlake.s3.us-east-1.amazonaws.com/tigerlake-connect-cloudformation.yaml

1. Enter the following details, then click `Next`:
   - **Stack Name**: the name for this CloudFormation stack
   - **BucketName**: The name of the S3 table bucket which will be created
   - **ProjectID and ServiceID**: Your $SERVICE_LONG details (see these instructions)

1. Check `I acknowledge that AWS CloudFormation might create IAM resources`, then click `Next`.
1. On the review page, click `Submit` and wait for the deployment to complete. 
1. Click `Outputs`, then copy all four outputs. 
1. Provide the outputs to $COMPANY.  
   Timescale uses them to provision your TigerLake services.


### Set up TigerLake using the AWS CloudFormation CLI

Copy the following command, and replace the values for:
- **Stack Name**: the name for this CloudFormation stack
- **BucketName**: the name of the S3 table bucket which will be created
- **ProjectID and ServiceID**: Your Timescale Cloud service details (see these instructions)

```shell
aws cloudformation create-stack \
--capabilities CAPABILITY_IAM \
--template-url https://tigerlake.s3.us-east-1.amazonaws.com/tigerlake-connect-cloudformation.yaml \
--stack-name {STACK_NAME} \
--parameters \
ParameterKey=BucketName,ParameterValue="{BUCKET_NAME}" \
ParameterKey=ProjectID,ParameterValue="{ProjectID}" \
ParameterKey=ServiceID,ParameterValue="{ServiceID}"
```


## Start streaming

To stream a table from a $SERVICE_LONG to Iceberg, run the following statement:
```sql
SELECT create_iceberg_sync('<TABLE_NAME>'::regclass);
```

When a stream is started, the full table is synchronized to Iceberg, meaning that all prior records will be imported first.

## Query your data

To execute queries against Iceberg, best practice is to use the following:

- [AWS Athena][aws-athena]: ensure that integration with AWS analytics services is enabled for the table bucket.
- [duckdb][duckdb]: support for S3 Tables is in preview. 
- [Apache Spark][apache-spark]

## Gotchas and known issues

- Only $PG 17 is supported.
- The only supported Iceberg catalog is the S3 Tables REST catalog.
- It is not possible to stop a stream from TimescaleDB to Iceberg at the moment, this ability is under implementation.
- When streaming a hypertable to Iceberg, the Iceberg table will be partitioned with a hardcoded one-day partition interval.
- Only tables with primary keys are supported.
- We have some limitations on the changes you can make to a table after setting up Iceberg sync: dropping/renaming columns and modifying a column’s data type is not permitted. We will add support for this soon.
- Certain optimizations must be disabled in hypertables with the columnstore enabled to retrieve correlating WAL events.

## What’s next
We love to get all your feedback, on what worked, and what didn’t. If possible, we would love to have a call and learn more about the problems you tried to solve and what would be the next thing we could build to support you.

[cmc]: https://console.aws.amazon.com/cloudformation/
[aws-athena]: https://aws.amazon.com/athena/
[duckdb]: https://duckdb.org/docs/stable/extensions/iceberg/amazon_s3_tables
[apache-spark]: https://spark.apache.org/