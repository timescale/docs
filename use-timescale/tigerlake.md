---
title: BaseLake
excerpt: Unifies the Timescale Cloud operational architecture with datalake architectures. This enables real-time application building alongside efficient data pipeline management within a single system.
products: [cloud]
keywords: [data lake, lakehouse, s3, iceberg]
---

# BaseLake

BaseLake unifies operational architecture with datalake architectures of S3 and Iceberg. 
This enables real-time application building alongside efficient data pipeline management within a single system.

This experimental release is a native integration enabling continuous replication between AWS [S3 Tables](s3-tables) (managed Iceberg and catalog) running in your AWS account and
relational tables and hypertables in Timescale Cloud. 

## Getting started

To connect Timescale with AWS S3 Tables, the ARN of a table bucket and a ARN of role with permission to write to the table bucket, are required.
Three options are available to curate these ARNs:
* Using the AWS CouldFormation Console
* Through the AWS CLI with a CloudFormation template
* Step by step guide to create bucket and role

### Setup BaseLake using AWS Management Console

1. Sign in to the AWS Management Console and open  [CloudFormation console][cmc].
2. In the navigation bar on the top of the page:
   1. Choose the name of the currently displayed AWS Region
   2. Set it to the Region in which you want to create your table bucket. **This must match the region your Timescale service** is running in. If the regions do not match AWS charges you for cross-region data transfer.
3. Click `Create stack`. If prompted choose `With new resources`. This is the standard option.
4. Under `Specify Template`, copy the following URL into the Amazon S3 URL box and Click `Next`.
   ```
   https://tigerlake.s3.us-east-1.amazonaws.com/tigerlake-connect-cloudformation.yaml
   ```
5. Enter the following details, then click `Next`:
   * **Stack Name**: the name for this CloudFormation stack
   * **BucketName**: The name of the S3 table bucket which will be created
   * **ProjectID and ServiceID**: Your Timescale Cloud service details (see these instructions)
6. Check `I acknowledge that AWS CloudFormation might create IAM resources`, then click `Next`.
7. On the review page, click `Submit` and wait for the deployment to complete. 
8. Click `Outputs`, then copy all four outputs. 
9. Provide the outputs to Timescale. Timescale uses them to provision your BaseLake services.

### Setup BaseLake using the aws cloudformation CLI

Replace the following values in the command, then run it from the terminal:
* **Stack Name**: the name for this CloudFormation stack
* **BucketName**: The name of the S3 table bucket which will be created
* **ProjectID and ServiceID**: Your Timescale Cloud service details (see these instructions)

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

### Step by step guide

#### Create an S3 Bucket 
1. Log in to the [AWS Management Console](aws-console).
2. Open the [Amazon S3 console](s3-console).
3. In the navigation bar on the top of the page, choose the name of the currently displayed AWS Region. Next, choose the region in which you want to create your table bucket. **This should match the region your Timescale service** will be in, or AWS will charge you for cross-region data transfer.
4. In the left navigation pane, choose Table buckets
5. Click Create table bucket then enter a name for your bucket, and create it. Note down the bucket’s Amazon Resource Name (ARN) that is displayed.

### Create ARN role
1. Open [IAM Dashboard](iam-dashboard), to create a new Role.
2. In the left navigation pane click Roles, then click Create role and select Custom trust policy
3. Replace the entire **Custom trust policy** code block with the following, substituting `{PROJECT_ID}` and `{SERVICE_ID}` with the appropriate values for the Timescale Cloud project and the service you intend to use with TigerLake. To locate your Project ID and Service ID, [follow these steps](get-project-id).

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::142548018081442426855243142548018081:root"
            },
            "Action": "sts:AssumeRole",
            "Condition": {
                "StringEquals": {
                    "sts:ExternalId": "{PROJECT_ID}/{SERVICE_ID}"
                }
            }
        }
    ]
}
```

4. Click Next, then click Next again without selecting any permission policies.
5. Give the Role a name and click Create role.
6. In Roles Overview, select the role you just created, click Add Permissions > Create inline policy.
7. Select JSON then replace the entire Policy editor code block with the following, substituting the two instances of `{S3TABLE_BUCKET_ARN}` with the ARN for the table bucket you created earlier.

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
      "Resource": "{S3TABLE_BUCKET_ARN}"
    },
    {
      "Sid": "BucketTableOps",
      "Effect": "Allow",
      "Action": [
        "s3tables:*"
      ],
      "Resource": "{S3TABLE_BUCKET_ARN}/table/*"
    }
  ]
}
```

8. Click Next, then give the inline policy a name and click Create policy
9. Provide Timescale with the ARN of this role, the ARN of the S3 table bucket, and your Timescale Cloud Project and Service IDs.
10. We’ll spin up the services with the configurations and let you know when it’s completed.

## Start streaming

To stream a table from a Timescale Cloud service to Iceberg, run the following statement:

```sql
SELECT create_iceberg_sync('<TABLE_NAME>'::regclass);
```

When a stream is started, the full table is synchronized to Iceberg, this means that all prior records are imported first.

## Query your data

To execute queries against Iceberg, best practice is to use the following products:
* [AWS Athena][aws-athena]: ensure that integration with the AWS analytics services is enabled for the table bucket.
* [duckdb][duckdb]: support for S3 Tables is in preview. 
* [Apache Spark][apache-spark]

## Gotchas and known issues
- Only Postgres 17 is supported.
- Only the S3 Tables REST Iceberg catalog is supported.
- It is not possible to stop a stream from a Timescale Cloud service to Iceberg at the moment. Support for this feature is coming soon.
- When streaming a hypertable to Iceberg, the Iceberg table is partitioned with a hardcoded one-day partition interval. 
- Only tables with primary keys are supported.
- After setting up Iceberg sync, you cannot drop or rename columns or modifying a column’s data type. Support for these features is coming soon.
- Certain optimizations must be disabled in hypertables that have the columnstore enabled in order to retrieve correlating WAL events.

[cmc]: https://console.aws.amazon.com/cloudformation/
[aws-athena]: https://aws.amazon.com/athena/
[duckdb]: https://duckdb.org/docs/stable/extensions/iceberg/amazon_s3_tables
[apache-spark]: https://spark.apache.org/
[s3-tables]: https://aws.amazon.com/s3/features/tables/
[aws-console]: https://console.aws.amazon.com/
[s3-console]: https://console.aws.amazon.com/s3/
[iam-dashboard]: https://console.aws.amazon.com/iamv2/home
[get-project-id]: https://docs.timescale.com/integrations/latest/find-connection-details/#find-your-project-and-service-id
