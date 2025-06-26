---
title: Integrate data lakes with Tiger Cloud
excerpt: Unifies the Tiger Cloud operational architecture with data lake architectures. This enables real-time application building alongside efficient data pipeline management within a single system.
products: [cloud]
price_plans: [scale, enterprise]
keywords: [data lake, lakehouse, s3, iceberg]
---

import IntegrationPrereqsCloud from "versionContent/_partials/_integration-prereqs-cloud-only.mdx";

# Integrate data lakes with $CLOUD_LONG

$LAKE_LONG unifies the $CLOUD_LONG operational architecture with data lake architectures. $LAKE_LONG enables you to build 
real-time applications alongside efficient data pipeline management within a single system.

This experimental release is a native integration enabling continuous replication between managed Iceberg and catalog 
running in AWS [S3 Tables][s3-tables] in your AWS account and relational tables and $HYPERTABLEs in $CLOUD_LONG. 

## Prerequisites

<IntegrationPrereqsCloud/>

## Integrate a data lake with your $SERVICE_LONG

To connect a $SERVICE_LONG to the AWS S3 Tables that make up your data lake, you need the following:

- The ARN of the data lake table bucket
- The ARN of a role with permissions to write to the table bucket

You set up the data lake table bucket and role ARNs, using one of the following methods:

<Tabs label="Install TimescaleDB">

<Tab title="AWS Management Console">

<Procedure >

1. **Set the AWS Region to host your table bucket**
   1. In [AWS CloudFormation][cmc], select the currently AWS Region at the top-right of the page.
   2. Set it to the Region to create your table bucket in. 

   **This must match the region your $SERVICE_LONG is running in**: if the regions do not match AWS charges you for 
   cross-region data transfer.

1. **Create your CloudFormation stack**
   1. Click `Create stack`, then select `With new resources (standard)`.
   1. In `Amazon S3 URL`, paste the following URL, then click `Next`.
      ```
      https://tigerlake.s3.us-east-1.amazonaws.com/tigerlake-connect-cloudformation.yaml
      ```
   1. In `Specify stack details`, enter the following details, then click `Next`:
      * `Stack Name`: a name for this CloudFormation stack
      * `BucketName`: a name for this S3 table bucket
      * `ProjectID` and `ServiceID`: enter the [connection details][get-project-id] for your $LAKE_LONG $SERVICE_SHORT.
   1. In `Configure stack options` check `I acknowledge that AWS CloudFormation might create IAM resources`, then 
      click `Next`.
   1. In `Review and create`, click `Submit`. and wait for the deployment to complete. 
       AWS deploys your stack and creates the S3 table bucket and IAM role.
   1. Click `Outputs`, then copy all four outputs.

1. **Provide this information to $COMPANY**

   Provide $COMPANY with the ARN of this role, the ARN of the S3 table bucket, and your
   [$PROJECT_LONG and $SERVICE_SHORT IDs][get-project-id].
   $COMPANY uses these outputs to provision your $LAKE_LONG services.

   $COMPANY uses this configuration to spin up your $LAKE_LONG services, then let you know when the $SERVICE_SHORT is
   ready to use. Provisioning takes about 10-15 minutes, during this time the $SERVICE_SHORT is restarted.

</Procedure>

</Tab>

<Tab title="AWS CloudFormation CLI">

<Procedure >

1. **Create your CloudFormation stack** 
   Replace the following values in the command, then run it from the terminal:
   
      * `CapabilityIAM`: IAIN, I added this 'cos it looks like a variable to me
      * `StackName`: the name for this CloudFormation stack
      * `BucketName`: The name of the S3 table bucket to crate
      * `ProjectID`: enter your $SERVICE_LONG [connection details][get-project-id] 
      * `ServiceID`: enter your $SERVICE_LONG [connection details][get-project-id]
   
   ```shell
   aws cloudformation create-stack \
     --capabilities <CapabilityIAM> \
     --template-url https://tigerlake.s3.us-east-1.amazonaws.com/tigerlake-connect-cloudformation.yaml \
     --stack-name <StackName> \
     --parameters \
       ParameterKey=BucketName,ParameterValue="<BucketName>" \
       ParameterKey=ProjectID,ParameterValue="<ProjectID>" \
       ParameterKey=ServiceID,ParameterValue="<ServiceID>"
   ```

1. **Provide this information to $COMPANY**

   Provide $COMPANY with the ARN of this role, the ARN of the S3 table bucket, and your
   [$PROJECT_LONG and $SERVICE_SHORT IDs][get-project-id].
   $COMPANY uses these outputs to provision your $LAKE_LONG services.

   $COMPANY uses this configuration to spin up your $LAKE_LONG services, then let you know when the $SERVICE_SHORT is
   ready to use. Provisioning takes about 10-15 minutes, during this time the $SERVICE_SHORT is restarted.

</Procedure>

</Tab>

<Tab title="Manual configuration">

<Procedure >

1. **Create a S3 Bucket** 

   1. Set the AWS Region to host your table bucket
      1. In [Amazon S3 console][s3-console], select the currently AWS Region at the top-right of the page.
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

1. **Provide this information to $COMPANY**

   Provide $COMPANY with the ARN of this role, the ARN of the S3 table bucket, and your
   [$PROJECT_LONG and $SERVICE_SHORT IDs][get-project-id].
   $COMPANY uses these outputs to provision your $LAKE_LONG services.

   $COMPANY uses this configuration to spin up your $LAKE_LONG services, then let you know when the $SERVICE_SHORT is 
   ready to use. Provisioning takes about 10-15 minutes, during this time the $SERVICE_SHORT is restarted.

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
  partitioning specification of the $HYPERTABLE is used. Streamed $PG tables can have a partition specification 
  for the Iceberg table, if intentially defined. Please refer to [partitioning](#partitioning) for more details.

Only tables or $HYPERTABLEs with primary keys are supported, this includes composite primary keys as well. 
A primary key is necessary for Iceberg to perform update or delete statements.

When a stream is started, the full table is synchronized to Iceberg, this means that all prior records are imported first.
The write throughput is ranging at approximately 40.000 records / second, for larger tables a full import can take some time.

### Partitioning

By default, the partition interval for an Iceberg table is the same as the one from a $HYPERTABLE.
The sync of a Postgres table does not enable any partitioning in Iceberg, but can be set through the [API](#api) with `tigerlake.iceberg_partitionby`.

The following partition intervals and specifications are supported, and the define behavior of [Iceberg partition specification][iceberg-partition-spec].

| Interval      | Description | Source types | Result type |
| ------------- | --- | --- | --- |
| `hour`        | Extract a date or timestamp day, as days from 1970-01-01 | `date`, `timestamp`, `timestamptz` | `int` |
| `day`         | Extract a date or timestamp day, as days from 1970-01-01 | `date`, `timestamp`, `timestamptz` | `int` |
| `month`       | Extract a date or timestamp day, as days from 1970-01-01 | `date`, `timestamp`, `timestamptz` | `int` |
| `year`        | Extract a date or timestamp day, as days from 1970-01-01 | `date`, `timestamp`, `timestamptz` | `int` |
| `truncate[W]` | Value truncated to width W, see [options][iceberg-truncate-options] | `int`, `long`, `decimal`, `string`, `binary` | `int` |

## Query your data

IAIN: I don't get why we are talking about Iceberg here. Do you mean against the data lake or the service? 

To execute queries against Iceberg, best practice is to use the following products:
* [AWS Athena][aws-athena]: ensure that integration with the AWS analytics services is enabled for the table bucket.
* [duckdb][duckdb]: support for S3 Tables is in preview. 
* [Apache Spark][apache-spark]


## Reference

### Limitations

* Only Postgres 17 is supported.
* Only the S3 Tables REST Iceberg catalog is supported.
* Certain columnstore optimizations must be disabled in $HYPERTABLEs in order to collect correlating WAL events.
* Truncate is not supported
* Tiered chunks are excluded
* The following is not root: 
   ```json
   "Principal": {
                  "AWS": "arn:aws:iam::142548018081:root"
              }, 
    ```        
* rename table

### Replicas

What happens on fail over?


### Schemas and roles created in your $LAKE_LONG $SERVICE_SHORT

```sql
CREATE SCHEMA _timescaledb_lake_catalog;
CREATE SCHEMA _timescaledb_lake_tables;

CREATE TABLE _timescaledb_lake_catalog.sync_tables(
    id              SERIAL PRIMARY KEY,
    pg_schema       NAME,
    pg_table        NAME,
    iceberg_schema  TEXT,
    iceberg_table   TEXT,
    column_list     TEXT[] DEFAULT NULL,
    partition_by    TEXT[]
);
ALTER TABLE _timescaledb_lake_catalog.sync_tables ADD CONSTRAINT
    sync_tables_uniq_pg_schema_pg_table UNIQUE (pg_schema, pg_table);

-- Create signal table for Debezium
CREATE TABLE _timescaledb_lake_tables.dbz_signals (
    id TEXT DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL,
    data TEXT
);
CREATE TABLE _timescaledb_lake_tables.dbz_heartbeat (
    id INTEGER PRIMARY KEY,
    count INTEGER
);

GRANT USAGE ON SCHEMA _timescaledb_lake_catalog, _timescaledb_lake_tables TO PUBLIC;
GRANT SELECT ON ALL TABLES IN SCHEMA _timescaledb_lake_catalog, _timescaledb_lake_tables TO PUBLIC;
```

[cmc]: https://console.aws.amazon.com/cloudformation/
[aws-athena]: https://aws.amazon.com/athena/
[duckdb]: https://duckdb.org/docs/stable/extensions/iceberg/amazon_s3_tables
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
