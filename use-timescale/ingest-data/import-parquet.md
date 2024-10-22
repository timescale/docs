---
title: Import data from Parquet
excerpt: Import data into a Timescale Cloud service from an external Apache Parquet file
products: [cloud]
keywords: [data migration]
tags: [import, parquet]
---

import ImportPrerequisites from "versionContent/_partials/_migrate_import_prerequisites.mdx";
import SetupConnectionString from "versionContent/_partials/_migrate_import_setup_connection_strings_parquet.mdx";

# Import data from Parquet

[Apache Parquet][apache-parquet] is a free and open-source column-oriented data storage format in the 
Apache Hadoop ecosystem. It provides efficient data compression and encoding schemes with 
enhanced performance to handle complex data in bulk. 

This page shows you how to import data into your $SERVICE_LONG from a Parquet file.

## Prerequisites

<ImportPrerequisites />

- [Install DuckDB][install-duckdb] on the source machine where the Parquet file is located.
- Ensured that the time column in the Parquet file uses the `TIMESTAMP` data type. 

For faster data transfer, best practice is that your target $SERVICE_SHORT, and the system
running the data import are in the same region.

## Import data into your $SERVICE_SHORT

To import data from a Parquet file:

<Procedure>

1. **Setup your $SERVICE_SHORT connection string**

    <SetupConnectionString />

1. **Create a [hypertable][hypertable-docs] to hold your data** 

   1.  Create a new empty table with a schema that is compatible with the data in your parquet file.  
  
       For example, if your parquet file contains the columns `ts`, `location`, and `temperature` with types 
       `TIMESTAMP`, `STRING`, and `DOUBLE`:
  
       ```sql
       psql $TARGET -c  "CREATE TABLE <TABLE_NAME> ( \
           ts          TIMESTAMPTZ         NOT NULL,  \
           location    TEXT                NOT NULL,  \
           temperature DOUBLE PRECISION    NULL  \
       );"
       ```
       If you prefer using a secure UI to the command line, use [Data mode in $CONSOLE][data-mode].

   1.  Convert the empty table to a hypertable:

       In the following command, replace `<TABLE NAME>` with the name of the table you just created, and `<COLUMN_NAME>`
       with the partitioning column in `<TABLE NAME>`.
       ```sql
       psql $TARGET -c  "SELECT create_hypertable('<TABLE_NAME>', by_range('<COLUMN_NAME>'))"
       ```

1. **Setup a DuckDB connection to your $SERVICE_SHORT**

   1.  In Terminal on the source machine with your Parquet files, start a new DuckDB interactive session:

       ```bash
       duckdb
       ```
   1. Connect to your $SERVICE_SHORT in your DuckDB session:
   
      ```bash
      ATTACH '<Paste the value of $TARGET here' AS db (type postgres);
      ```
      `$TARGET` is the connection string you used to connect to your $SERVICE_SHORT using psql. 

1. **Import data from Parquet to your $SERVICE_SHORT**

   1. In DuckDB, upload the table data to your $SERVICE_SHORT    
      ```bash
      COPY db.<TABLE_NAME> FROM '<FILENAME>.parquet' (FORMAT parquet);
      ```
      Where: 

      - `<TABLE_NAME>`: the hypertable you created to import data to 
      - `<FILENAME>`: the Parquet file to import data from

   1. Exit the DuckDB session:

       ```bash
       EXIT;
       ```

1. **Verify the data was imported correctly into your $SERVICE_SHORT**

   In your `psql` session, or using [Data mode in $CONSOLE][data-mode], view the data in <TABLE_NAME>  
   ```sql
   SELECT * FROM <TABLE_NAME>;
   ```

</Procedure>

And that is it, you have imported your data from a Parquet file to your $SERVICE_LONG.

[apache-parquet]: https://parquet.apache.org/
[apache-parquet-file-format]: https://parquet.apache.org/docs/file-format/
[install-duckdb]: https://duckdb.org/docs/installation/
[hypertable-docs]: /use-timescale/:currentVersion:/hypertables/
[data-mode]: /getting-started/:currentVersion:/run-queries-from-console/#data-mode
