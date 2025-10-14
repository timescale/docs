---
title: Upload a file into your service using Tiger Console
excerpt: You can upload CSV, Parquet, and text files into your service using Tiger Console. Just drag and drop from your local machine, or provide a path to the file in S3
products: [cloud]
keywords: [import]
---

import ImportPrerequisitesCloudNoConnection from "versionContent/_partials/_prereqs-cloud-no-connection.mdx";
import EarlyAccessGeneral from "versionContent/_partials/_early_access.mdx";
import NotSupportedAzure from "versionContent/_partials/_not-supported-for-azure.mdx";

# Upload a file into your $SERVICE_SHORT using $CONSOLE_LONG

You can upload files into your $SERVICE_SHORT using $CONSOLE_LONG. This page explains how to upload CSV, Parquet, and text files, from your local machine and from an S3 bucket.

<Tabs label="Upload files using Tiger Console" persistKey="console-import">

<Tab title="From a local machine" label="local-import">

$CONSOLE_LONG enables you to drag and drop files to upload from your local machine.

<EarlyAccessGeneral /> 

## Prerequisites

<ImportPrerequisitesCloudNoConnection />

<NotSupportedAzure />

<Tabs label="Upload files from a local machine" persistKey="file-import">

<Tab title="From CSV" label="import-csv">

To upload a CSV file to your $SERVICE_SHORT:

<Procedure>

1. **Select your $SERVICE_SHORT in [$CONSOLE_SHORT][console], then click `Actions` > `Import data` > `Upload your files` > `Upload CSV file`**

   ![Import from CSV into Tiger](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-console-import-csv-file.png)

1. **Click to browse, or drag the file to import**
1. **Configure the import**

   ![Configure the CSV import in Tiger](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-console-configure-csv-file-import.png)

   - Set a delimiter.
   - Toggle to skip or keep the header.
   - Select to ingest the data into an existing table or create a new one. 
   - Provide the new or existing table name. 
   - <Optional /> For a new table with a time column, toggle the time column to create a hypertable instead of a regular table.

1. **Click `Process CSV file`**

   When the processing is completed, to find the data your imported, click `Explorer`.

</Procedure>

</Tab>

<Tab title="From Parquet" label="import-parquet">

To upload a Parquet file to your $SERVICE_SHORT:

<Procedure>

1. **Select your $SERVICE_SHORT in [$CONSOLE_SHORT][console], then click `Actions` > `Import data` > `Upload your files` > `Upload Parquet file`**

   ![Import from Parquet into Tiger](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-console-import-parquet-file.png)

1. **Click to browse, or drag the file to import**
1. **Configure the import**

   ![Configure the Parquet import in Tiger](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-console-configure-parquet-file-import.png)

   - Select to ingest the data into an existing table or create a new one.
   - Provide the new or existing table name.
   - <Optional /> For a new table with a time column, toggle the time column to create a hypertable instead of a regular table.
   
1. **Click `Process Parquet file`**

   When the processing is completed, to find the data your imported, click `Explorer`.

</Procedure>

</Tab>

<Tab title="From a text file" label="import-txt">

To upload a TXT or MD file to your $SERVICE_SHORT:

<Procedure>

1. **Select your $SERVICE_SHORT in $CONSOLE_SHORT, then click `Actions` > `Import data` > `Upload your files` > `Upload Text file`**

   ![Import from a text file into Tiger](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-console-import-txt-file.png)

1. **Click to browse, or drag and drop the file to import**
1. **Configure the import**

   Provide a name to create a new table, or select an existing table to add data to. 

   ![Configure the text file import in Tiger](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-console-configure-txt-file-import.png)

1. **Click `Upload files`**

   When the upload is finished, find your data imported to a new or existing table in `Explorer`.

</Procedure>

</Tab>

</Tabs>
    
</Tab>

<Tab title="From S3" label="s3-import">

$CONSOLE_LONG enables you to upload CSV and Parquet files, including archives compressed using GZIP and ZIP, by connecting to an S3 bucket.

## Prerequisites

<ImportPrerequisitesCloudNoConnection />

- Ensure access to a standard Amazon S3 bucket containing your data files.
- Configure access credentials for the S3 bucket. The following credentials are supported:
   - [IAM Role][credentials-iam].
   - [Public anonymous user][credentials-public].

<NotSupportedAzure />

<Tabs label="Import files from S3" persistKey="file-import">

<Tab title="From CSV" label="import-csv">

To import a CSV file from an S3 bucket:

<Procedure>

1. **Select your $SERVICE_SHORT in $CONSOLE_SHORT, then click `Actions` > `Import data` > `Explore import options` > `Import from S3`**

1. **Select your file in the S3 bucket**

   ![Import CSV from S3 in Tiger](https://assets.timescale.com/docs/images/tiger-cloud-console/import-csv-file-from-s3.png)

   1. Provide your file path.
   1. Select `CSV` in the file type dropdown.
   1. Select the authentication method: 
      - `IAM role` and provide the role.
      - `Public`. 
   1. Click `Continue`.

1. **Configure the import**

   ![Configure CSV import from S3 in Tiger](https://assets.timescale.com/docs/images/tiger-cloud-console/configure-csv-file-import-from-s3.png)

   - Set a delimiter.
   - Toggle to skip or keep the header.
   - Select to ingest the data into an existing table or create a new one.
   - Provide the new or existing table name.
   - <Optional /> For a new table with a time column, toggle the time column to create a hypertable instead of a regular table.

1. **Click `Process CSV file`**

   When the processing is completed, to find the data your imported, click `Explorer`.

</Procedure>
    
</Tab>

<Tab title="From Parquet" label="import-parquet">

To import a Parquet file from an S3 bucket:

<Procedure>

1. **Select your $SERVICE_SHORT in $CONSOLE_SHORT, then click `Actions` > `Import from S3`**

1. **Select your file in the S3 bucket**

   ![Import Parquet from S3 in Tiger](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-cloud-import-parquet-file-from-s3.png)

   1. Provide your file path.
   1. Select `Parquet` in the file type dropdown.
   1. Select the authentication method: 
     - `IAM role` and provide the role.
     - `Public`. 
   1. Click `Continue`.

1. **Configure the import**

   - Select `Create a new table for your data` or `Ingest data to an existing table`.
   - Provide the new or existing table name.
   - <Optional /> For a new table with a time column, toggle the time column to create a hypertable instead of a regular table.

1. **Click `Process Parquet file`**

   When the processing is completed, to find the data your imported, click `Explorer`.

</Procedure>

</Tab>

</Tabs>
    
</Tab>

</Tabs>

And that is it, you have imported your data to your $SERVICE_LONG.





[credentials-iam]: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html#roles-creatingrole-user-console
[credentials-public]: https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html#example-bucket-policies-anonymous-user
[console]: hhttps://console.cloud.timescale.com/dashboard/services
