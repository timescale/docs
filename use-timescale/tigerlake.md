---
title: Integrate data lakes with Tiger
excerpt: Unifies the Tiger operational architecture with data lake architectures. This enables real-time application building alongside efficient data pipeline management within a single system.
products: [cloud]
price_plans: [scale, enterprise]
keywords: [data lake, lakehouse, s3, iceberg]
---

import IntegrationPrereqsCloud from "versionContent/_partials/_integration-prereqs-cloud-only.mdx";
import EarlyAccessGeneral from "versionContent/_partials/_early_access.mdx";

# Integrate data lakes with $CLOUD_LONG

$LAKE_LONG enables you to build real-time applications alongside efficient data pipeline management within a single 
system. $LAKE_LONG unifies the $CLOUD_LONG operational architecture with data lake architectures. 

![Tiger Lake architecture](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-lake-integration-tiger.svg)

$LAKE_LONG is a native integration enabling synchronization between $HYPERTABLEs and relational tables
running in $SERVICE_LONGs to Iceberg tables running in [Amazon S3 Tables][s3-tables] in your AWS account. 

<Highlight type="important">

Tiger Lake is currently in private beta. Please contact us to request access.

</Highlight>

## Prerequisites

<IntegrationPrereqsCloud/>

## Integrate a data lake with your $SERVICE_LONG

To connect a $SERVICE_LONG to your data lake:

<Tabs label="Install TimescaleDB">

<Tab title="AWS Management Console">

<Procedure >

1. **Set the AWS region to host your table bucket**
   1. In [AWS CloudFormation][cmc], select the current AWS region at the top-right of the page.
   1. Set it to the Region you want to create your table bucket in. 

   **This must match the region your $SERVICE_LONG is running in**: if the regions do not match AWS charges you for 
   cross-region data transfer.

1. **Create your CloudFormation stack**
   1. Click `Create stack`, then select `With new resources (standard)`.
   1. In `Amazon S3 URL`, paste the following URL, then click `Next`.
   
      ```http request
      https://tigerlake.s3.us-east-1.amazonaws.com/tigerlake-connect-cloudformation.yaml
      ```
   
   1. In `Specify stack details`, enter the following details, then click `Next`:
      * `Stack Name`: a name for this CloudFormation stack
      * `BucketName`: a name for this S3 table bucket
      * `ProjectID` and `ServiceID`: enter the [connection details][get-project-id] for your $LAKE_LONG $SERVICE_SHORT
   1. In `Configure stack options` check `I acknowledge that AWS CloudFormation might create IAM resources`, then 
      click `Next`.
   1. In `Review and create`, click `Submit`, then wait for the deployment to complete. 
      AWS deploys your stack and creates the S3 table bucket and IAM role.
   1. Click `Outputs`, then copy all four outputs.

1. **Connect your $SERVICE_SHORT to the data lake**

   1. In [$CONSOLE][services-portal], select the $SERVICE_SHORT you want to integrate with AWS S3 Tables, then click 
      `Connectors`.
   
   1. Select the Apache Iceberg connector and supply the:
      - ARN of the S3Table bucket
      - ARN of a role with permissions to write to the table bucket   

   Provisioning takes a couple of minutes.

</Procedure>

</Tab>

<Tab title="AWS CloudFormation CLI">

<Procedure >

1. **Create your CloudFormation stack** 

   Replace the following values in the command, then run it from the terminal:

   * `Region`: region of the S3 table bucket
   * `StackName`: the name for this CloudFormation stack
   * `BucketName`: the name of the S3 table bucket to create
   * `ProjectID`: enter your $SERVICE_LONG [connection details][get-project-id] 
   * `ServiceID`: enter your $SERVICE_LONG [connection details][get-project-id]
   
   ```shell
   aws cloudformation create-stack \
    --capabilities CAPABILITY_IAM \
    --template-url https://tigerlake.s3.us-east-1.amazonaws.com/tigerlake-connect-cloudformation.yaml \
    --region <Region> \
    --stack-name <StackName> \
    --parameters \
      ParameterKey=BucketName,ParameterValue="<BucketName>" \
      ParameterKey=ProjectID,ParameterValue="<ProjectID>" \
      ParameterKey=ServiceID,ParameterValue="<ServiceID>"
   ```

  Setting up the integration through $CONSOLE in $CLOUD_LONG, provides a convenient copy-paste option with the 
  placeholders populated.

1. **Connect your $SERVICE_SHORT to the data lake**

   1. In [$CONSOLE][services-portal], select the $SERVICE_SHORT you want to integrate with AWS S3 Tables, then click 
      `Connectors`.

   1. Select the Apache Iceberg connector and supply the:
      - ARN of the S3Table bucket
      - ARN of a role with permissions to write to the table bucket

   Provisioning takes a couple of minutes.

</Procedure>

</Tab>

<Tab title="Manual configuration">

<Procedure >

1. **Create a S3 Bucket** 

   1. Set the AWS region to host your table bucket
      1. In [Amazon S3 console][s3-console], select the current AWS region at the top-right of the page.
      2. Set it to the Region your you want to create your table bucket in.

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

   1. In [$CONSOLE][services-portal], select the $SERVICE_SHORT you want to integrate with AWS S3 Tables, then click 
      `Connectors`.

   1. Select the Apache Iceberg connector and supply the:
      - ARN of the S3Table bucket
      - ARN of a role with permissions to write to the table bucket

   Provisioning takes a couple of minutes.

</Procedure>

</Tab>

</Tabs>

## Stream data from your $SERVICE_LONG to your data lake

When you start streaming, all data in the table is synchronized to Iceberg. Records are imported in time order, from
oldest to youngest. The write throughput is approximately 40.000 records / second. For larger tables, a full import can 
take some time.

For Iceberg to perform update or delete statements, your $HYPERTABLE or relational table must have a primary key. 
This includes composite primary keys.

To stream data from a $PG relational table, or a $HYPERTABLE in your $SERVICE_LONG to your data lake, run the following 
statement:

```sql
ALTER TABLE <table_name> SET (
  tigerlake.iceberg_sync = true | false,
  tigerlake.iceberg_partitionby = '<partition_specification>',
  tigerlake.iceberg_namespace = '<namespace>',
  tigerlake.iceberg_table = '<table>'
)
```

* `tigerlake.iceberg_sync`: `boolean`, set to `true` to start streaming, or `false` to stop the stream. A stream 
  **cannot** resume after being stopped. 
* `tigerlake.iceberg_partitionby`: optional property to define a partition specification in Iceberg. By default the 
   Iceberg table is partitioned as `day(<time-column of $HYPERTABLE>)`. This default behavior is only applicable  
   to $HYPERTABLEs. For more information, see [partitioning][partitioning].
* `tigerlake.iceberg_namespace`: optional property to set a namespace, the default is `timescaledb`.
* `tigerlake.iceberg_table`: optional property to specify a different table name. If no name is specified the $PG table name is used.

### Partitioning intervals

By default, the partition interval for an Iceberg table is one day(time-column) for a $HYPERTABLE. 
$PG table sync does not enable any partitioning in Iceberg for non-hypertables. You can set it using 
[tigerlake.iceberg_partitionby][samples]. The following partition intervals and specifications are supported:

| Interval      | Description                                                               | Source types | 
| ------------- |---------------------------------------------------------------------------| --- | 
| `hour`        | Extract a date or timestamp day, as days from epoch. Epoch is 1970-01-01. | `date`, `timestamp`, `timestamptz` | 
| `day`         | Extract a date or timestamp day, as days from epoch.                      | `date`, `timestamp`, `timestamptz` | 
| `month`       | Extract a date or timestamp day, as days from epoch.                      | `date`, `timestamp`, `timestamptz` | 
| `year`        | Extract a date or timestamp day, as days from epoch.                      | `date`, `timestamp`, `timestamptz` | 
| `truncate[W]` | Value truncated to width W, see [options][iceberg-truncate-options]       |

These partitions define the behavior using the [Iceberg partition specification][iceberg-partition-spec]:

### Sample code

The following samples show you how to tune data sync from a $HYPERTABLE or a $PG relational table to your
data lake:

- **Sync a $HYPERTABLE with the default one-day partitioning interval on the `ts_column` column**

   To start syncing data from a $HYPERTABLE to your data lake using the default one-day chunk interval as the 
   partitioning scheme to the Iceberg table, run the following statement: 
   
   ```sql
   ALTER TABLE my_hypertable SET (tigerlake.iceberg_sync = true);
   ```

   This is equivalent to `day(ts_column)`.

- **Specify a custom partitioning scheme for a $HYPERTABLE**

   You use the `tigerlake.iceberg_partitionby` property to specify a different partitioning scheme for the Iceberg 
   table at sync start.  For example, to enforce an hourly partition scheme from the chunks on `ts_column` on a
   $HYPERTABLE, run the following statement:
   
   ```sql
   ALTER TABLE my_hypertable SET (
     tigerlake.iceberg_sync = true,
     tigerlake.iceberg_partitionby = 'hour(ts_column)'
   );
   ```

- **Set the partition to sync relational tables**

   $PG relational tables do not forward a partitioning scheme to Iceberg, you must specify the partitioning scheme using
   `tigerlake.iceberg_partitionby` when you start the sync. For example, for a standard $PG table to sync to the Iceberg 
   table with daily partitioning , run the following statement:
   
   ```sql
   ALTER TABLE my_postgres_table SET (
     tigerlake.iceberg_sync = true,
     tigerlake.iceberg_partitionby = 'day(timestamp_col)'
   );
   ```

- **Stop sync to an Iceberg table for a $HYPERTABLE or a $PG relational table**

   ```sql
   ALTER TABLE my_hypertable SET (tigerlake.iceberg_sync = false);
   ```

- **Update or add the partitioning scheme of an Iceberg table**

   To change the partitioning scheme of an Iceberg table, you specify the desired partitioning scheme using the `tigerlake.iceberg_partitionby` property.
   For example. if the `samples` table has an hourly (`hour(ts)`) partition on the `ts` timestamp column,  
   to change to daily partitioning, call the following statement:
   
   ```sql
   ALTER TABLE samples SET (tigerlake.iceberg_partitionby = 'day(ts)');
   ```

   This statement is also correct for Iceberg tables without a partitioning scheme.
   When you change the partition, you **do not** have to pause the sync to Iceberg. 
   Apache Iceberg handles the partitioning operation in function of the internal implementation.

**Specify a different namespace**

   By default, tables are created in the the `timescaledb` namespace. To specify a different namespace when you start the sync, use the  `tigerlake.iceberg_namespace` property. For example:
   
   ```sql
   ALTER TABLE my_hypertable SET (
     tigerlake.iceberg_sync = true,
     tigerlake.iceberg_namespace = 'my_namespace'
   );
   ```

**Specify a different Iceberg table name**

   The table name in Iceberg is the same as the source table in $CLOUD_LONG. 
   Some services do not allow mixed case, or have other constraints for table names. 
   To define a different table name for the Iceberg table at sync start,  use the `tigerlake.iceberg_table` property. For example: 
   
   ```sql
   ALTER TABLE Mixed_CASE_TableNAME SET (
     tigerlake.iceberg_sync = true,
     tigerlake.iceberg_table = 'my_table_name'
   );
   ```

## Limitations

* Service requires $PG 17.6 and above is supported.
* Consistent ingestion rates of over 30000 records / second can lead to a lost replication slot. Burst can be feathered out over time. 
* [Amazon S3 Tables Iceberg REST][aws-s3-tables] catalog only is supported.
* In order to collect deletes made to data in the columstore, certain columnstore optimizations are disabled for $HYPERTABLEs.
* [Direct Compress][direct-compress] is not supported.
* The `TRUNCATE` statement is not supported, and does not truncate data in the corresponding Iceberg table.
* Data in a $HYPERTABLE that has been moved to the [low-cost object storage tier][data-tiering] is not synced.
* Writing to the same S3 table bucket from multiple services is not supported, bucket-to-service mapping is one-to-one.
* Iceberg snapshots are pruned automatically if the amount exceeds 2500.

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
[samples]: /use-timescale/:currentVersion:/tigerlake/#sample-code
[partitioning]: /use-timescale/:currentVersion:/tigerlake/#partitioning-intervals
[services-portal]: https://console.cloud.timescale.com/dashboard/services
[aws-s3-tables]: https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables-integrating-open-source.html
[data-tiering]: /use-timescale/:currentVersion:/data-tiering/
[direct-compress]: /use-timescale/:currentVersion:/hypertables/hypertable-crud/#speed-up-data-ingestion