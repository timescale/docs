---
title: Import data from CSV
excerpt: Import data into a Timescale Cloud service from an external .csv file
products: [cloud]
keywords: [data migration]
tags: [import, csv]
---

import ImportPrerequisites from "versionContent/_partials/_migrate_import_prerequisites.mdx";
import SetupConnectionString from "versionContent/_partials/_migrate_import_setup_connection_strings_parquet.mdx";

# Import data from CSV

CSV is a file format that is widely used for data migration. This page shows you how to import data into 
your $SERVICE_LONG from a CSV file. 

## Prerequisites

<ImportPrerequisites />

- Install [Go](https://go.dev/doc/install) v1.13 or later

- Install [timescaledb-parallel-copy][install-parallel-copy]
  
  [timescaledb-parallel-copy][parallel importer] Improves performance for large datasets by parallelizing the import
  process. It also preserves row order and uses a round-robin approach to optimize memory management and disk operations.

  To verify your installation, run `timescaledb-parallel-copy --version`.

- Ensured that the time column in the CSV file uses the `TIMESTAMPZ` data type.


## Import data into your $SERVICE_SHORT

To import data from a CSV file:

<Procedure>

1. **Setup your connection string**

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

1. **Import your data**

   In the folder containing your CSV files, either:

   - Use [timescaledb-parallel-copy][install-parallel-copy]:

     - **For a $SERVICE_LONG**: 

       ```bash
       timescaledb-parallel-copy \
       --connection $TARGET \
       --db-name tsdb \
       --table <TABLE_NAME> \
       --file <FILE_NAME>.csv \
       --workers <NUM_WORKERS> \
       --reporting-period 30s
       ```
    
     - **For self-hosted $TIMESCALE_DB** 

       ```bash
       timescaledb-parallel-copy \
       --connection "host=localhost user=postgres sslmode=disable" \
       --db-name tsdb \
       --table <TABLE_NAME> \
       --file <FILE_NAME>.csv \
       --workers <NUM_WORKERS> \
       --reporting-period 30s
       ```

     For the best performances while avoiding resource competition, set `<NUM_WORKERS>` to twice the
     number of CPUs in your $SERVICE_SHORT, but less than the the available CPU cores in the following command:

   - Use psql:

      psql COPY is single-threaded, and may be slower for large datasets.

      ```bash
      psql -d <DATABASE_NAME> -c "\COPY <TABLE_NAME> FROM <FILENAME>.csv CSV"
      ```

</Procedure>

And that is it, you have imported your data from a CSV file.

[parallel importer]: https://github.com/timescale/timescaledb-parallel-copy
[install-parallel-copy]: https://github.com/timescale/timescaledb-parallel-copy?tab=readme-ov-file#go
[hypertable-docs]: /use-timescale/:currentVersion:/hypertables/
[data-mode]: /getting-started/:currentVersion:/run-queries-from-console/#data-mode
