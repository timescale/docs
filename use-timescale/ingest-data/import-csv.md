---
title: Import data from CSV
excerpt: Import data into a Timescale Cloud service from an external .csv file
products: [cloud]
keywords: [data migration]
tags: [import, csv]
---

# Import data from CSV

## Introduction

This guide covers how to import data into Timescale from external CSV files, including the use of timescaledb-parallel-copy for faster bulk inserts.

## Prerequisites

Before you begin, ensure you have:

- A [free Timescale account](https://www.timescale.com/getting-started)
- Time column in the source data using the TIMESTAMPTZ data type
- [Go runtime](https://go.dev/doc/install) version 1.13 or later (for timescaledb-parallel-copy)
- A [Timescale service](https://www.timescale.com/getting-started)
- Connection details for your Timescale service

## Importing Data

1. Connect to your Timescale service and create a new empty table matching your CSV schema:

   ```sql
   CREATE TABLE <TABLE_NAME> (
       ts        TIMESTAMPTZ         NOT NULL,
       location  TEXT                NOT NULL,
       temperature DOUBLE PRECISION  NULL
   );
   ```

2. Convert the empty table to a hypertable:

   ```sql
   SELECT create_hypertable('<TABLE_NAME>', by_range('ts'));
   ```

3. Choose an import method:
   - Use timescaledb-parallel-copy (recommended for large datasets)
   - Use PostgreSQL's native COPY command

### Using timescaledb-parallel-copy

1. Install timescaledb-parallel-copy:

   ```bash
   go install github.com/timescale/timescaledb-parallel-copy/cmd/timescaledb-parallel-copy@latest
   ```

2. Verify the installation:

   ```bash
   timescaledb-parallel-copy --version
   ```

3. Navigate to the directory containing your CSV files.

4. Import data (for Timescale Cloud):

   ```bash
   timescaledb-parallel-copy \
   --connection "host=<CLOUD_HOST> \
   user=tsdbadmin password=<CLOUD_PASSWORD> \
   port=<CLOUD_PORT> \
   sslmode=require" \
   --db-name tsdb \
   --table <TABLE_NAME> \
   --file <FILE_NAME>.csv \
   --workers <NUM_WORKERS> \
   --reporting-period 30s
   ```

   Set `<NUM_WORKERS>` to twice the number of CPUs in your database.

   For localhost, use: `--connection "host=localhost user=postgres sslmode=disable"`

### Using PostgreSQL COPY Command

If you prefer not to use timescaledb-parallel-copy, use the PostgreSQL COPY command:

```bash
psql -d <DATABASE_NAME> -c "\COPY <TABLE_NAME> FROM <FILENAME>.csv CSV"
```

## Notes

- [timescaledb-parallel-copy][parallel importer] improves performance for large datasets by parallelizing the import process.
- It preserves row order and uses a round-robin approach to optimize memory management and disk operations.
- Don't set the number of workers higher than available CPU cores to avoid resource competition.
- The PostgreSQL COPY command is single-threaded and may be slower for large datasets.

[parallel importer]: https://github.com/timescale/timescaledb-parallel-copy
