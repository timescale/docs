---
title: Integrate data lakes with Tiger Cloud
excerpt: Unifies the Tiger Cloud operational architecture with data lake architectures. This enables real-time application building alongside efficient data pipeline management within a single system.
products: [cloud]
price_plans: [scale, enterprise]
keywords: [data lake, lakehouse, s3, iceberg]
---

import IntegrationPrereqsCloud from "versionContent/_partials/_integration-prereqs-cloud-only.mdx";

# Integrate data lakes with $CLOUD_LONG

$LAKE_LONG enables you to build real-time applications alongside efficient data pipeline management within a single 
system. $LAKE_LONG unifies the $CLOUD_LONG operational architecture with data lake architectures. 

This experimental release is a native integration enabling synchronization between a $SERVICE_LONG and Iceberg tables
running in AWS [S3 Tables][s3-tables] in your AWS account and relational tables and $HYPERTABLEs in $CLOUD_LONG. 

## Prerequisites

<IntegrationPrereqsCloud/>

## Integrate a data lake with your $SERVICE_LONG

To connect a $SERVICE_LONG to your data lake:

<Tabs label="Install TimescaleDB">

<Tab title="AWS Management Console">

<Procedure >

1. **Set the AWS region to host your table bucket**
  1. In [AWS CloudFormation][cmc], select the current AWS region at the top-right of the page.
  2. Set it to the Region to create your table bucket in. 

  **This must match the region your $SERVICE_LONG is running in**: if the regions do not match AWS charges you for cross-region data transfer.

1. **Create your CloudFormation stack**
  1. Click `Create stack`, then select `With new resources (standard)`.
  2. In `Amazon S3 URL`, paste the following URL, then click `Next`.
   
    ```http request
    https://tigerlake.s3.us-east-1.amazonaws.com/tigerlake-connect-cloudformation.yaml
    ```
   
  3. In `Specify stack details`, enter the following details, then click `Next`:
    * `Stack Name`: a name for this CloudFormation stack
    * `BucketName`: a name for this S3 table bucket
    * `ProjectID` and `ServiceID`: enter the [connection details][get-project-id] for your $LAKE_LONG $SERVICE_SHORT.
  4. In `Configure stack options` check `I acknowledge that AWS CloudFormation might create IAM resources`, then click `Next`.
  5. In `Review and create`, click `Submit`. and wait for the deployment to complete. 
      AWS deploys your stack and creates the S3 table bucket and IAM role.
  6. Click `Outputs`, then copy all four outputs.

1. **Connect your $SERVICE_SHORT to the data lake**

  1. In [$CONSOLE][services-portal], select the $SERVICE_SHORT you want to integrate with AWS S3 Tables, then click `Connectors`.
   
  2. Select the Apache Iceberg connector and supply the:
    - ARN of the S3Table bucket
    - ARN of a role with permissions to write to the table bucket   

    Provisioning takes a couple of minutes, during this time the $SERVICE_SHORT is restarted.

</Procedure>

</Tab>

<Tab title="AWS CloudFormation CLI">

<Procedure >

1. **Create your CloudFormation stack** 
  Replace the following values in the command, then run it from the terminal:

  * `StackName`: the name for this CloudFormation stack
  * `BucketName`: the name of the S3 table bucket to create
  * `ProjectID`: enter your $SERVICE_LONG [connection details][get-project-id] 
  * `ServiceID`: enter your $SERVICE_LONG [connection details][get-project-id]
   
  ```shell
  aws cloudformation create-stack \
    --capabilities CapabilityIAM \
    --template-url https://tigerlake.s3.us-east-1.amazonaws.com/tigerlake-connect-cloudformation.yaml \
    --stack-name <StackName> \
    --parameters \
      ParameterKey=BucketName,ParameterValue="<BucketName>" \
      ParameterKey=ProjectID,ParameterValue="<ProjectID>" \
      ParameterKey=ServiceID,ParameterValue="<ServiceID>"
  ```

  Setting up the integration through the Console in CLOUD_LONG, provides a conveniant copy-paste option with the placeholders populated.

1. **Connect your $SERVICE_SHORT to the data lake**

  1. In [$CONSOLE][services-portal], select the $SERVICE_SHORT you want to integrate with AWS S3 Tables, then click `Connectors`.

  1. Select the Apache Iceberg connector and supply the:
    - ARN of the S3Table bucket
    - ARN of a role with permissions to write to the table bucket

    Provisioning takes a couple of minutes, during this time the $SERVICE_SHORT is restarted.

</Procedure>

</Tab>

<Tab title="Manual configuration">

<Procedure >

1. **Create a S3 Bucket** 

   1. Set the AWS region to host your table bucket
      1. In [Amazon S3 console][s3-console], select the current AWS region at the top-right of the page.
      2. Set it to the Region to create your table bucket in.

      **This must match the region your $SERVICE_LONG is running in**: if the regions do not match AWS charges you for
      cross-region data transfer.
   1. In the left navigation pane, click `Table buckets`, then click `Create table bucket`.
   1. Enter `Table bucket name`, then click `Create table bucket`. 
   1. Copy the `Amazon Resource Name (ARN)` for your table bucket.

1. **Create an ARN role**
   1. In [IAM Dashboard][iam-dashboard], click `Roles` then click `Create role`
   1. In `Select trusted entity`, click `Custom trust policy`, replace the **Custom trust policy** code block with the 
      following: 
   
      ```json
      {
          "Version": "2012-10-17",
          "Statement": [
              {
                  "Effect": "Allow",
                  "Principal": {
                      "AWS": "arn:aws:iam::142548018081:root"
                  },
                  "Action": "sts:AssumeRole",
                  "Condition": {
                      "StringEquals": {
                          "sts:ExternalId": "<ProjectID>/<ServiceID>"
                      }
                  }
              }
          ]
      }
      ```
      
      `"Principal": { "AWS": "arn:aws:iam::123456789012:root" }` does not mean `root` access. This delegates 
        permissions to the entire AWS account, not just the root user.

   1. Replace `<ProjectID>` and `<ServiceID>` with the the [connection details][get-project-id] for your $LAKE_LONG 
         $SERVICE_SHORT, then click `Next`.  

   1. In `Permissions policies`. click `Next`.
   1. In `Role details`, enter `Role name`, then click `Create role`.
   1. In `Roles`, select the role you just created, then click `Add Permissions` > `Create inline policy`.
   1. Select `JSON` then replace the `Policy editor` code block with the following:
   
         ```json
         {
           "Version": "2012-10-17",
           "Statement": [
             {
               "Sid": "BucketOps",
               "Effect": "Allow",
               "Action": [
                 "s3tables:*"
               ],
               "Resource": "<S3TABLE_BUCKET_ARN>"
             },
             {
               "Sid": "BucketTableOps",
               "Effect": "Allow",
               "Action": [
                 "s3tables:*"
               ],
               "Resource": "<S3TABLE_BUCKET_ARN>/table/*"
             }
           ]
         }
         ```
   1. Replace `<S3TABLE_BUCKET_ARN>` with the `Amazon Resource Name (ARN)` for the table bucket you just created.
   1. Click `Next`, then give the inline policy a name and click `Create policy`.

1. **Connect your $SERVICE_SHORT to the data lake**

  1. In [$CONSOLE][services-portal], select the $SERVICE_SHORT you want to integrate with AWS S3 Tables, then click `Connectors`.

  1. Select the Apache Iceberg connector and supply the:
    - ARN of the S3Table bucket
    - ARN of a role with permissions to write to the table bucket

    Provisioning takes a couple of minutes, during this time the $SERVICE_SHORT is restarted.

</Procedure>

</Tab>

</Tabs>

## Stream data from your $SERVICE_LONG to your data lake

To stream data from a $PG relational table, or a $HYPERTABLE in your $SERVICE_LONG to your data lake, run the following 
statement:

```sql
ALTER TABLE <table_name> SET (
  tigerlake.iceberg_sync = true | false,
  tigerlake.iceberg_partitionby = '<partition_specification>'
)
```

* `tigerlake.iceberg_sync`: `boolean`, set to `true` to start streaming, or `false` to stop the stream. A stream 
  **cannot** resume after being stopped. 
* `tigerlake.iceberg_partitionby`: optional property to define a partition specification in Iceberg. By default the 
   the Iceberg table is partitioned as day(<time-column of $HYPERTABLE>). This default behavior is applicable only to hypertables. 
  for the Iceberg table, if intentially defined. Please refer to [partitioning](#partitioning) for more details.

Only tables or $HYPERTABLEs with primary keys are supported, this includes composite primary keys as well. 
A primary key is necessary for Iceberg to perform update or delete statements.

When a stream is started, the full table is synchronized to Iceberg, this means that all prior records are imported first.
The write throughput is ranging at approximately 40.000 records / second, for larger tables a full import can take some time.

### Partitioning

By default, the partition interval for an Iceberg table is day(time-column) for a $HYPERTABLE, 
The sync of a Postgres table does not enable any partitioning in Iceberg for non-hypertables, but can be set through the [API](#api) with `tigerlake.iceberg_partitionby`.

The following partition intervals and specifications are supported, and the define behavior of [Iceberg partition specification][iceberg-partition-spec].

| Interval      | Description                                                             | Source types | 
| ------------- |-------------------------------------------------------------------------| --- | 
| `hour`        | Extract a date or timestamp day, as days from epoch. That is 1970-01-01 | `date`, `timestamp`, `timestamptz` | 
| `day`         | Extract a date or timestamp day, as days from epoch.                    | `date`, `timestamp`, `timestamptz` | 
| `month`       | Extract a date or timestamp day, as days from epoch.                    | `date`, `timestamp`, `timestamptz` | 
| `year`        | Extract a date or timestamp day, as days from epoch.                    | `date`, `timestamp`, `timestamptz` | 
| `truncate[W]` | Value truncated to width W, see [options][iceberg-truncate-options]     |

### Sample code

A $HYPERTABLE with a one-day chunk interval on the `ts_column` column.

The following statement, will start the sync of the $HYPERTABLE and forward the one-day chunk interval as partitioning scheme to the Iceberg table, which is equivalent to `day(ts_column)`.

```sql
ALTER TABLE my_hypertable SET (tigerlake.iceberg_sync = true);
```

The property `tigerlake.iceberg_partitionby` specifies a different partitioning scheme for the Iceberg table at sync start.
For example, with the same $HYPERTABLE, to enforce an hourly partition scheme rather than the daily one from the  chunks on `ts_column`:

```sql
ALTER TABLE my_hypertable SET (
  tigerlake.iceberg_sync = true,
  tigerlake.iceberg_partitionby = 'hour(ts_column)'
);
```

$PG tables do not forward a partitioning scheme to Iceberg, therefore must be explicitly stated with `tigerlake.iceberg_partitionby` when starting the sync.
For example, the $PG table `my_postgres_table` has column of type `TIMESTAMP` acting as partitioning column.
The following statement starts the sync to the Iceberg table with a daily partitioning.

```sql
ALTER TABLE my_postgres_table SET (
  tigerlake.iceberg_sync = true,
  tigerlake.iceberg_partitionby = 'day(timestamp_col)'
);
```

Stop sync to an Iceberg table, for either a $HYPERTABLE or a $PG relational table:

```sql
ALTER TABLE my_hypertable SET (tigerlake.iceberg_sync = false);
```

## Limitations

* Only Postgres 17.4 is supported. A service running on Postgres 17.5, will be downgraded to 17.4.
* Ony S3 Tables REST Iceberg catalog is supported.
* Certain columnstore optimizations will be disabled in $HYPERTABLEs in order to collect deletes made to columstore.
* The `TRUNCATE` statement is not supported, and will not truncate data in the corresponding Iceberg table.
* The [tiered data](/use-timescale/latest/data-tiering/) of a $HYPERTABLE will not be synced.
* Renaming a table in Postgres will stop the syncing to Iceberg, causing unexpected behavior.
* Writing to the same S3 table bucket from multiple services is not supported, bucket to service mapping is one to one at the moment.
* The retention policy for Iceberg snapshots is set to 12 hours, we do not recommend increasing the duration at this point in time.

[cmc]: https://console.aws.amazon.com/cloudformation/
[aws-athena]: https://aws.amazon.com/athena/
[apache-spark]: https://spark.apache.org/
[s3-tables]: https://aws.amazon.com/s3/features/tables/
[aws-console]: https://console.aws.amazon.com/
[s3-console]: https://console.aws.amazon.com/s3/
[iam-dashboard]: https://console.aws.amazon.com/iamv2/home
[iceberg-partition-spec]: https://iceberg.apache.org/spec/#partition-transforms
[iceberg-truncate-options]: https://iceberg.apache.org/spec/#truncate-transform-details
[get-project-id]: /integrations/:currentVersion:/find-connection-details/#find-your-project-and-service-id
[setup-console]: /use-timescale/:currentVersion:/tigerlake/#setup-tiger-lake-using-aws-management-console
[setup-cli]: /use-timescale/:currentVersion:/tigerlake/#setup-tiger-lake-using-the-aws-cloudformation-cli
[setup-manual]: /use-timescale/:currentVersion:/tigerlake/#setup-tiger-lake-manually
[services-portal]: https://console.cloud.timescale.com/dashboard/services
