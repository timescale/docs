---
title: Import data using Tiger Cloud Console
excerpt: 
products: [cloud]
keywords: [import]
---

import ImportPrerequisitesCloudNoConnection from "versionContent/_partials/_prereqs-cloud-no-connection.mdx";
import EarlyAccessGeneral from "versionContent/_partials/_early_access.mdx";

# Import data into your $SERVICE_SHORT using $CONSOLE_LONG

You can import data into your $SERVICE_SHORT using $CONSOLE_LONG. This page explains how to import CSV, Parquet, and TXT files, from your local machine and from an S3 bucket.

<Tabs label="Import files using Tiger Cloud Console">

<Tab title="From a local machine">

$CONSOLE_LONG enables you to drag and drop files to upload from your local machine.

<EarlyAccessGeneral /> 

## Prerequisites

<ImportPrerequisitesCloudNoConnection />

<Tabs label="Upload files from a local machine">

<Tab title="From CSV">

To upload a CSV file to your $SERVICE_SHORT:

<Procedure>

1. **Select your $SERVICE_SHORT in $CONSOLE_SHORT, then click `Actions` > `Import data` > `Upload .CSV`**

   ![Import from CSV into Tiger Cloud](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-data-console-import-csv.png)

1. **Click to browse, or drag and drop the file to import**
1. **Configure the import**

   Configure the following:

   1. Set a delimiter.
   1. Toggle to skip or keep the header.
   1. Select to ingest the data into an existing table or create a new one. 
   1. Provide the new or existing table name. 
   1. For a new table with a time column, toggle the time column to create a hypertable instead of a regular table. 

   ![Configure the CSV import in Tiger Cloud](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-cloud-configure-csv-import.png)

1. **Click `Process CSV file`**

   Find your data uploaded to a new or existing table in `Explorer`. 

</Procedure>

</Tab>

<Tab title="From Parquet">

To upload a Parquet file to your $SERVICE_SHORT:

<Procedure>

1. **Select your $SERVICE_SHORT in $CONSOLE_SHORT, then click `Actions` > `Import data` > `Upload Parquet`**

   ![Import from Parquet into Tiger Cloud](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-data-console-import-parquet.png)

1. **Click to browse, or drag and drop the file to import**
1. **Configure the import**

   Configure the following:

   1. Select to ingest the data into an existing table or create a new one.
   1. Provide the new or existing table name.
   1. For a new table with a time column, toggle the time column to create a hypertable instead of a regular table.

   ![Configure the Parquet import in Tiger Cloud](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-cloud-configure-parquet-import.png)

1. **Click `Process Parquet file`**

   Find your data uploaded to a new or existing table in `Explorer`.

</Procedure>

</Tab>

<Tab title="From TXT">

To upload a TXT file to your $SERVICE_SHORT:

<Procedure>

1. **Select your $SERVICE_SHORT in $CONSOLE_SHORT, then click `Actions` > `Import data` > `Upload text files`**

   ![Import from TXT into Tiger Cloud](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-data-console-import-txt.png)

1. **Click to browse, or drag and drop the file to import**
1. **Configure the import**

   Provide a name to create a new table, or select an existing table to add data to. 

   ![Configure the TXT import in Tiger Cloud](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-cloud-configure-txt-import.png)

1. **Click `Upload files`**

   Find your data uploaded to a new or existing table in `Explorer`.

</Procedure>

</Tab>

</Tabs>
    
</Tab>

<Tab title="From S3">

$CONSOLE_LONG enables you to upload CSV and Parquet files, including compressed formats (GZIP and ZIP), by connecting to an S3 bucket.

## Prerequisites

<ImportPrerequisitesCloudNoConnection />
- Ensure access to a standard Amazon S3 bucket containing your data files.
- Configure access credentials for the S3 bucket.  
  The following credentials are supported:
   - [IAM Role][credentials-iam].
   - [Public anonymous user][credentials-public].

To import your files from S3:

<Procedure>

1. **Select your $SERVICE_SHORT in $CONSOLE_SHORT, then click `Actions` > `Import from S3`**

1. **Configure the import**

   1. Provide your bucket address.
   1. Select the file type.
   1. Select the authentication method: `IAM role` or `Public`. For `IAM role`, provide the role. 
   1. Click `Continue`. 

</Procedure>
    
</Tab>

</Tabs>



[credentials-iam]: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html#roles-creatingrole-user-console
[credentials-public]: https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html#example-bucket-policies-anonymous-user

