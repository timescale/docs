---
title: Livesync S3 to Timescale Cloud
excerpt: Synchronize data from S3 to Timescale Cloud service in real time
products: [cloud]
keywords: [migration, low-downtime, backup]
tags: [recovery, logical backup, replication]
---

# Livesync from S3 to Timescale Cloud

S3 Livesync continuously imports data from an Amazon S3 bucket into your database. It monitors your S3 bucket for new files matching a specified pattern and automatically imports them into your designated database table.

## Key Concepts

- **Livesync**: A continuous import process that watches an S3 bucket for new files and imports them automatically. The sync runs on a configurable schedule and tracks processed files.
- **S3 bucket**: A storage container in Amazon S3 that holds the files to be imported.
- **IAM role**: An AWS Identity and Access Management role that provides secure access to S3 buckets. The role must have permissions to read objects from the specified bucket.
- **Pattern**: A glob pattern that filters which files to import (e.g., "logs/*.csv"). Patterns must be under 1024 characters and can include wildcards.
- **Frequency**: How often the system checks for new files, specified using cron expressions (e.g., "*/15 * * * *" for every 15 minutes). This sets the sync's execution schedule.

## Setting Up S3 Livesync

### Prerequisites

1. A standard Amazon S3 bucket containing your data files (Directory buckets not supported)
2. Appropriate credentials to access the S3 bucket

### Configuration Options

#### Connect to your S3 bucket

Provide your bucket name from the AWS console.

Two authentication types are supported:

1. **Public**: For publicly accessible buckets
2. **Role-based (RoleARN)**: Using AWS IAM roles for authentication, requires:
   - `arn`: The AWS IAM role ARN to assume

We recommend role-based access for better security. Follow the setup instructions carefully.

### Authentication

For security, our workers use a role in our AWS account to assume a role in your AWS account. You can then configure your role to access only necessary S3 data.

To prevent the confused [deputy problem][deputy-problem], we set ExternalId to your `projectId/ServiceId`. Set these correctly to avoid security risks.

Here's a CLI setup reference (using `timescale-s3-role-$BucketName` as an example role name):

Create role and trust policy:

```sh
aws iam create-role \
    --role-name timescale-s3-role-$BucketName \
    --assume-role-policy-document '{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {
                    "AWS": "arn:aws:iam::142548018081:role/timescale-s3-connections"
            },
            "Action": "sts:AssumeRole",
            "Condition": {
                "StringLike": {
                    "sts:ExternalId": "$ProjectId/$ServiceId" <- Replace this with real values
                }
            }
        }
    ]
}'
```

Attach access policy:

> Note: This policy grants full bucket access. Narrow permissions as needed.

```sh
aws iam put-role-policy \
--role-name timescale-s3-role-$BucketName \
--policy-name S3AccessPolicy \
--policy-document '{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "s3:GetObject"
                "s3:ListBucket"
            ],
            "Effect": "Allow",
            "Resource": [
                "arn:aws:s3:::$BucketName",
                "arn:aws:s3:::$BucketName/*"
            ]
        }
    ]
}
```

#### Define files to sync

First, specify your file format. We support:

- **CSV**
  - Maximum file size: 1GB (need more? Contact us!)
  - Maximum row size: 2MB
  - Supported compressed formats:
    - `.gz`
    - `.zip`
  - Advanced settings:
    - **Delimiter**: Character separating fields (default is ",")
    - **Skip Header**: Option to skip the first row if your file has headers
- **Parquet**
  - Maximum file size: 1GB
  - Maximum row group uncompressed size: 200MB
  - Maximum row size: 2MB

Next, match files in your bucket using glob patterns.

For files like:

```txt
logs/2024-03-15-14-30-00.csv
logs/2024-03-15-15-00-00.csv
logs/2024-03-15-15-30-00.csv
logs/2024-03-15-16-00-00.csv
```

Use the pattern `logs/*`

> TIP: `logs/` works too—any pattern ending with / automatically gets a * added.

Use the magnifier icon to preview matching files.

For files in subdirectories:

```txt
logs/2024-03/...
logs/2024-04/...
logs/2024-05/...
logs/2024-06/...
```

Use `logs/**` to match all recursively.

For specific file types (like CSVs) alongside metadata files, add the extension: `logs/**/*.csv`

Supported glob patterns:

- / separates path segments
- * matches zero or more characters in a segment
- ? matches one character in a segment
- ** matches any number of path segments (including none)
- {} groups conditions (e.g., {**/*.html,**/*.txt} matches all HTML and text files)
- [] declares a character range (e.g., example.[0-9] matches example.0, example.1, etc.)
- [!...] negates a character range (e.g., example.[!0-9] matches example.a, example.b, but not example.0)

> Warning: AWS S3 doesn't support complex filtering, so filtering happens in software. If your expression filters too many files, the list operation may timeout. This feature works best for filtering occasional files rather than matching a narrow set.
> We use prefix filters where possible, so place patterns carefully at the end of your glob expression.

#### Configure destination table

Choose an existing table or create a new one.

**Creating a new table:** We'll use the first matched file to suggest a table structure. Review our suggested data types to ensure they match your data. If your data has a timestamp column, you can create a hypertable by enabling the hypertable partition toggle.

**Using an existing table**: After selecting schema and table, arrange the insertion order to match your CSV file's column order (This builds the COPY command for data insertion).

### Configure frequency

Set how often we check for new files (minimum: 1 minute).

To minimize S3 API calls, set this close to your data addition frequency.

Example: For data added every 30 minutes, use `0,30 * * * *`

> Note: Cron accuracy depends on system load. We aim for 30-second precision in worst cases. Monitor timing through file import logs.

Cron expression format:

```txt
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of the month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of the week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
* * * * *
```

Common cron tags supported:

- @yearly
- @annually
- @monthly
- @daily
- @weekly
- @hourly
- @5minutes
- @10minutes
- @15minutes
- @30minutes
- @always

## Operation

Monitor import progress in the console.

File import logs show states: `Paused`, `In Queue`, `Running`, `Completed`, or `Failed`.

- Only one file runs at a time
- Click failed rows to see error details

You can pause live sync anytime. Queued imports pause while running imports complete.

During pauses, you can edit the configuration before resuming.

## How it works

### Polling

We use ListObjectsV2 with a prefix from your pattern. For `logs/**/*csv`, we list objects with prefix `logs/`, then filter using glob matching.

We track up to 100 files per iteration, using the last found object for subsequent queries. This enables lexicographical file processing.

> Note: This efficient approach requires files to be added in lexicographical order.

Files appear in File Import logs as `In Queue`.

To prevent system overload, we limit the queue to 100 files. Additional checks only fill empty queue slots.

For large backlogs, we check every minute until caught up. Otherwise, we follow your cron schedule. Use `Pull now` to check manually.

### Data ingestion

**CSV**: First checked for compression using https://mimesniff.spec.whatwg.org/, looking for `text/plain; charset=utf-8`, `applicatin/zip`, or `application/x-gzip`. Other types return errors.

Processing uses [timescaledb-parallel-copy][parallel-copy]

**Parquet**: Converted to CSV, then processed with [timescaledb-parallel-copy][parallel-copy]

[parallel-copy]: https://github.com/timescale/timescaledb-parallel-copy
[deputy-problem]: https://docs.aws.amazon.com/IAM/latest/UserGuide/confused-deputy.html