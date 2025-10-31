---
title: Sync data from S3 to your service
excerpt: Synchronize data from S3 to Tiger Cloud service in real time
products: [cloud]
price_plans: [performance, scale, enterprise]
keywords: [migration, low-downtime, backup]
tags: [recovery, logical backup, replication]
---

import PrereqCloud from "versionContent/_partials/_prereqs-cloud-only.mdx";
import EarlyAccessNoRelease from "versionContent/_partials/_early_access.mdx";
import NotSupportedAzure from "versionContent/_partials/_not-supported-for-azure.mdx";

# Sync data from S3

You use the $S3_CONNECTOR in $CLOUD_LONG to synchronize CSV and Parquet files from an S3 bucket to your $SERVICE_LONG in real time. The connector runs continuously, enabling you to leverage $CLOUD_LONG as your analytics database with data constantly synced from S3. This lets you take full advantage of $CLOUD_LONG's real-time analytics capabilities without having to develop or manage custom ETL solutions between S3 and $CLOUD_LONG.

![$CLOUD_LONG overview](https://assets.timescale.com/docs/images/tiger-on-azure/tiger-console-connector-overview.png)

You can use the $S3_CONNECTOR to synchronize your existing and new data. Here's what the connector can do:

* Sync data from an S3 bucket instance to a $SERVICE_LONG:
    - Use glob patterns to identify the objects to sync.
    - Watch an S3 bucket for new files and import them automatically. It runs on a configurable schedule and tracks processed files.
    - **Important**: The connector processes files in [lexicographical order][lex-order]. It uses the name of the last file processed as a marker and fetches only files later in the alphabet in subsequent queries. Files added with names earlier in the alphabet than the marker are skipped and never synced. For example, if you add the file Bob when the marker is at Elephant, Bob is never processed. 
    - For large backlogs, check every minute until caught up. 

* Sync data from multiple file formats:
    - CSV: check for compression in GZ and ZIP format, then process using [timescaledb-parallel-copy][parallel-copy].
    - Parquet: convert to CSV, then process using [timescaledb-parallel-copy][parallel-copy].

* The $S3_CONNECTOR offers an option to enable a [$HYPERTABLE][about-hypertables] during the file-to-table schema mapping setup. You can enable [columnstore][compression] and [continuous aggregates][caggs] through the SQL editor once the connector has started running.

* The connector offers a default 1-minute polling interval. This means that $CLOUD_LONG checks the S3 source every minute for new data. You can customize this interval by setting up a cron expression.

The $S3_CONNECTOR continuously imports data from an Amazon S3 bucket into your database. It monitors your S3 bucket for new files matching a specified pattern and automatically imports them into your designated database table.

**Note**: the connector currently only syncs existing and new files—it does not support updating or deleting records based on updates and deletes from S3 to tables in a $SERVICE_LONG.

<EarlyAccessNoRelease />: this source S3 connector is not supported for production use. If you have any questions or feedback, talk to us in <a href="https://app.slack.com/client/T4GT3N2JK/C086NU9EZ88">#livesync in the Tiger Community</a>.

## Prerequisites

<PrereqCloud />

- Ensure access to a standard Amazon S3 bucket containing your data files.
  
  Directory buckets are not supported.
- Configure access credentials for the S3 bucket.  
  The following credentials are supported: 
    - [IAM Role][credentials-iam].
    
      - Configure the trust policy. Set the: 
      
        - `Principal`: `arn:aws:iam::142548018081:role/timescale-s3-connections`.
        - `ExternalID`: set to the [$CLOUD_LONG project and $SERVICE_LONG ID][connection-project-service-id] of the 
           $SERVICE_SHORT you are syncing to in the format `<projectId>/<serviceId>`.
        
           This is to avoid the [confused deputy problem][confused-deputy-problem].
      - Give the following access permissions:

        - `s3:GetObject`.
        - `s3:ListBucket`.
       
    - [Public anonymous user][credentials-public].

<NotSupportedAzure />

## Limitations

- **File naming**:
  Files must follow lexicographical ordering conventions. Files with names that sort earlier than already-processed files are permanently skipped. Example: if `file_2024_01_15.csv` has been processed, a file named `file_2024_01_10.csv` added later will never be synced. 
  Recommended naming patterns: timestamps (for example, `YYYY-MM-DD-HHMMSS`), sequential numbers with fixed padding (for example, `file_00001`, `file_00002`).

- **CSV**:
   - Maximum file size: 1 GB 
  
      To increase this limit, contact sales@tigerdata.com
   - Maximum row size: 2 MB
   - Supported compressed formats:
      - GZ
      - ZIP
   - Advanced settings:
      - Delimiter: the default character is `,`, you can choose a different delimiter
      - Skip header: skip the first row if your file has headers
- **Parquet**:
   - Maximum file size: 1 GB
   - Maximum row size: 2 MB
- **Sync iteration**:

   To prevent system overload, the connector tracks up to 100 files for each sync iteration. Additional checks only fill
   empty queue slots. 

## Synchronize data to your $SERVICE_LONG

To sync data from your S3 bucket to your $SERVICE_LONG using $CONSOLE:

<Procedure>

1. **Connect to your $SERVICE_LONG**

   In [$CONSOLE][portal-ops-mode], select the $SERVICE_SHORT to sync live data to.

1. **Connect the source S3 bucket to the target $SERVICE_SHORT**

   ![Connect $CLOUD_LONG to S3 bucket](https://assets.timescale.com/docs/images/tiger-on-azure/s3-connector-tiger-console.png)

   1. Click `Connectors` > `Amazon S3`.
   1. Click the pencil icon, then set the name for the new connector.
   1. Set the `Bucket name` and `Authentication method`, then click `Continue`.
   
      For instruction on creating the IAM role to connect your S3 bucket, click `Learn how`. $CONSOLE connects to the source bucket.
   1. In `Define files to sync`, choose the `File type` and set the `Glob pattern`.
   
      Use the following patterns:
      - `<folder name>/*`: match all files in a folder. Also, any pattern ending with `/` is treated as  `/*`.
      - `<folder name>/**`: match all recursively.
      - `<folder name>/**/*.csv`: match a specific file type.
      
      The $S3_CONNECTOR uses prefix filters where possible, place patterns carefully at the end of your glob expression.
      AWS S3 doesn't support complex filtering. If your expression filters too many files, the list operation may time out.
      
   1. Click the search icon. You see the files to sync. Click `Continue`.

1. **Optimize the data to synchronize in $HYPERTABLEs**

   ![S3 connector table selection](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-console-s3-connector-create-tables.png)

   $CONSOLE checks the file schema and, if possible, suggests the column to use as the time dimension in a 
   [$HYPERTABLE][about-hypertables].
   
   1. Choose `Create a new table for your data` or `Ingest data to an existing table`. 
   1. Choose the `Data type` for each column, then click `Continue`.
   1. Choose the interval. This can be a minute, an hour, or use a [cron expression][cron-expression].
   1. Click `Start Connector`.

      $CONSOLE starts the connection between the source database and the target $SERVICE_SHORT and displays the progress.

1. **Monitor synchronization**

    1. To view the amount of data replicated, click `Connectors`. The diagram in `Connector data flow` gives you an overview of the connectors you have created, their status, and how much data has been replicated.

       ![$CLOUD_LONG connectors overview](https://assets.timescale.com/docs/images/tiger-on-azure/tiger-console-connector-overview.png)

    1. To view file import statistics and logs, click `Connectors` > `Source connectors`, then select the name of your connector in the table.

       ![S3 connector stats](https://assets.timescale.com/docs/images/tiger-on-azure/tiger-console-s3-connector-import-stats.png)


1. **Manage the connector**

    1. To pause the connector, click `Connectors` > `Source connectors`. Open the three-dot menu next to your connector in the table, then click `Pause`.

      ![Edit S3 connector](https://assets.timescale.com/docs/images/tiger-on-azure/tiger-console-s3-connector-pause.png)

    1. To edit the connector, click `Connectors` > `Source connectors`. Open the three-dot menu next to your connector in the table, then click `Edit` and scroll down to `Modify your Connector`. You must pause the connector before editing it. 

      ![S3 connector change config](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-console-s3-connector-edit.png)

    1. To pause or delete the connector, click `Connectors` > `Source connectors`, then open the three-dot menu on the right and select an option. You must pause the connector before deleting it. 


</Procedure>

And that is it, you are using the $S3_CONNECTOR to synchronize all the data, or specific files, from an S3 bucket to your 
$SERVICE_LONG in real time.



[about-hypertables]: /use-timescale/:currentVersion:/hypertables/
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
[confused-deputy-problem]: https://docs.aws.amazon.com/IAM/latest/UserGuide/confused-deputy.html
[connection-project-service-id]: /integrations/:currentVersion:/find-connection-details/#find-your-project-and-service-id
