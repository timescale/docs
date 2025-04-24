---
title: Livesync S3 to Timescale Cloud
excerpt: Synchronize data from S3 to Timescale Cloud service in real time
products: [cloud]
keywords: [migration, low-downtime, backup]
tags: [recovery, logical backup, replication]
---

import PrereqCloud from "versionContent/_partials/_prereqs-cloud-only.mdx";
import EarlyAccessNoRelease from "versionContent/_partials/_early_access.mdx";

# Livesync from S3 to Timescale Cloud

You use $LIVESYNC to synchronize tabular data, from an S3 bucket to your
$SERVICE_LONG in real-time. You run $LIVESYNC continuously, turning S3 into a primary database with your
$SERVICE_LONG as a logical replica. This enables you to leverage $CLOUD_LONG’s real-time analytics capabilities on
your replica data.

![$LIVESYNC_CAP view status](https://assets.timescale.com/docs/images/livesync-s3-view-status.png)

You use $LIVESYNC for data synchronization, rather than migration. Livesync can:

* Sync data from an S3 bucket instance to a $SERVICE_LONG:
   - $LIVESYNC uses Glob patterns to identify the objects to sync.
   - $LIVESYNC uses the objects returned for subsequent queries. This efficient approach means files are synced in
    [lexicographical order][lex-order].
   - $LIVESYNC watches an S3 bucket for new files and imports them automatically. $LIVESYNC runs on a configurable 
     schedule and tracks processed files.
   - For large backlogs, $LIVESYNC checks every minute until caught up. 

* Sync data from multiple file formats:

  * CSV: checked for compression in `.gz` and `.zip` format, then processing using [timescaledb-parallel-copy][parallel-copy]

  * Parquet: converted to CSV, then processed using [timescaledb-parallel-copy][parallel-copy]

* Enable features such as [hypertables][about-hypertables], [columnstore][compression], and
  [continuous aggregates][caggs] on your logical replica.

$LIVESYNC for S3 continuously imports data from an Amazon S3 bucket into your database. It monitors your S3 bucket for new
files matching a specified pattern and automatically imports them into your designated database table.

<EarlyAccessNoRelease />: livesync is not supported for production use. If you have an questions or feedback, talk to us in <a href="https://app.slack.com/client/T4GT3N2JK/C086NU9EZ88">#livesync in Timescale Community</a>.

## Prerequisites

<PrereqCloud />

- Access to a standard Amazon S3 bucket containing your data files.
  Directory buckets are not supported.
- Access credentials for the S3 bucket.  
  - The following credentials are supported: 
    - [IAM Role][credentials-iam].
      Your role needs the following: 
      - Authorize the $LIVESYNC role: `arn:aws:iam::142548018081:role/timescale-s3-connections`
      - Permissions: `s3:GetObject`, `s3:ListBucket`
        
    - [Public anonymous user][credentials-public].

## Limitations

- **CSV**:
   - Maximum file size: 1GB 
      To increase these limits, contact sales@timescale.com
   - Maximum row size: 2MB
   - Supported compressed formats:
      - `.gz`
      - `.zip`
   - Advanced settings:
      - **Delimiter**: the default character is `,`, you can choose a different delimiter
      - **Skip Header**: skip the first row if your file has headers
- **Parquet**:
   - Maximum file size: 1GB
   - Maximum row group uncompressed size: 200MB
   - Maximum row size: 2MB
- **Sync iteration**:
   To prevent system overload, $LIVESYNC track up to 100 files for each sync iteration. Additional checks only fill
   empty queue slots. 

## Synchronize data to your $SERVICE_LONG

To sync data from your S3 bucket to your $SERVICE_LONG using $CONSOLE:

<Procedure>

1. **Connect to your $SERVICE_LONG**

   In [$CONSOLE][portal-ops-mode], select the service to sync live data to.
1. **Start livesync**
   1. Click `Actions` > `livesync for S3`.
   2. Click `New Livesync for S3`

1. **Connect the source s3 bucket to the target $SERVICE_SHORT**

   ![Livesync connect to bucket](https://assets.timescale.com/docs/images/livesync-s3-wizard.png)

   1. In `Livesync for S3`, set the `Bucket name` and `Authentication method`, then press `Continue`.
   
      For instruction on creating the IAM role you need to connect your S3 bucket, click `Learn how`:
      ![Livesync connect to bucket](https://assets.timescale.com/docs/images/livesync-s3-create-credentials.png) 
      $CONSOLE connects to the source bucket.
   1. In `Define files to sync`, choose the `File type` and set the `Glob pattern`.
   
      Use the following patterns:
      - `<folder name>/*`: match all files in a folder. Also, any pattern ending with `/` is treated as  `/*`.
      - `<folder name>/**`: match all recursively.
      - `<folder name>/**/*.csv`: match a specific file type
      
      $LIVESYNC uses prefix filters where possible, place patterns carefully at the end of your glob expression.
      AWS S3 doesn't support complex filtering. If your expression filters too many files, the list operation may timeout.
      
   1. Click the search icon, you see files to sync. Click `Continue`

1. **Optimize the data to synchronize in hypertables**

   $CONSOLE checks the file schema and, if possible suggests the column to use as the time dimension in a 
   [hypertable][about-hypertables].
     
   ![Livesync choose table](https://assets.timescale.com/docs/images/livesync-s3-create-tables.png)
   
   1. Choose the `Data type` for each column, then click `Continue`.
   1. Choose the interval. This can be a minute, an hour or use a [cron expression][cron-expression].  
   1. Repeat this step for each table you want to sync.
   1. Press `Start Livesync`.

      $CONSOLE starts $LIVESYNC between the source database and the target $SERVICE_SHORT and displays the progress.

1. **Monitor syncronization**
   1. To view the progress of the livesync, click the name of the $LIVESYNC process:
      You see the status of the file being synced. Only one file runs at a time.
      ![livesync view status](https://assets.timescale.com/docs/images/livesync-s3-view-status.png)
   1. To pause and restart livesync, click the buttons on the right of the $LIVESYNC process and select an action:
      During pauses, you can edit the configuration before resuming.
      ![livesync start stop](https://assets.timescale.com/docs/images/livesync-s3-start-stop.png)

</Procedure>

And that is it, you are using $LIVESYNC to synchronize all the data, or specific files, from an s3 bucket to your 
$SERVICE_LONG in real-time.


[about-hypertables]: /use-timescale/:currentVersion:/hypertables/about-hypertables/
[lives-sync-specify-tables]: /migrate/:currentVersion:/livesync-for-postgresql/#specify-the-tables-to-synchronize
[compression]: /use-timescale/:currentVersion:/compression/about-compression
[caggs]: /use-timescale/:currentVersion:/continuous-aggregates/about-continuous-aggregates/
[join-livesync-on-slack]: https://app.slack.com/client/T4GT3N2JK/C086NU9EZ88
[parallel-copy]: https://github.com/timescale/timescaledb-parallel-copy
[deputy-problem]: https://docs.aws.amazon.com/IAM/latest/UserGuide/confused-deputy.html
[lex-order]:https://en.wikipedia.org/wiki/Lexicographic_order
[credentials-iam]: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html#roles-creatingrole-user-console
[credentials-public]: https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html#example-bucket-policies-anonymous-user
[portal-ops-mode]: https://console.cloud.timescale.com/dashboard/services
[hypertable-docs]: /use-timescale/:currentVersion:/hypertables/
[cron-expression]: https://en.wikipedia.org/wiki/Cron#Cron_expression
