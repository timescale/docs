---
title: Troubleshooting known issues
excerpt: Troubleshooting known issues in database migrations
products: [cloud, self_hosted]
keywords: [backups, restore]
tags: [recovery, logical backup, pg_dump, pg_restore]
---

# Troubleshooting known issues

## The metadata table

The `_timescaledb_catalog.metadata` table contains data used in telemetry. By 
default, this table is populated automatically. Therefore, the target database
will most likely already contain rows. The table has a primary key constraint. 
Dumping the data from this table out of the source database and loading it into
the target database will cause a primary key constraint violation.

One option is to avoid dumping the table out of the source. You may use this
argument to pg_dump to do so `--exclude-table='_timescaledb_catalog.metadata'`.

Alternatively, you can use the `--list` flag to pg_restore to create a file 
listing the contents of the dump. Then, you can remove the 
`_timescaledb_catalog.metadata` line from the file, and provide the file to
pg_restore's `--use-list` argument which will cause it to skip over the table.

```bash
pg_restore \
    --format=directory \
    --schema='_timescaledb_catalog' \
    --list \
    dump > list

sed -i -E -e '/ TABLE DATA _timescaledb_catalog metadata /d' list

pg_restore -d "$TARGET" \
    --format=directory \
    --use-list=list \
    --exit-on-error \
    --no-tablespaces \
    --no-owner \
    --no-privileges \
    dump
```

## Restoring with concurrency

If the directory format is used for pg_dump and pg_restore, concurrency can be
employed to speed up the process. Unfortunately, loading the tables in the 
`timescaledb_catalog` schema concurrently will cause errors. Furthermore, the 
`tsdbadmin` does not have sufficient privileges to disable triggers in this 
schema. To get around this limitation, load this schema serially, and then load 
the rest of the database concurrently.

```bash
# first, load JUST the _timescaledb_catalog serially
pg_restore -d "$TARGET" \
    --format=directory \
    --schema='_timescaledb_catalog' \
    --exit-on-error \
    --no-tablespaces \
    --no-owner \
    --no-privileges \
    dump

# next, load everything EXCEPT the _timescaledb_catalog with concurrency
pg_restore -d "$TARGET" \
    --format=directory \
    --jobs=8 \
    --exclude-schema='_timescaledb_catalog' \
    --exit-on-error \
    --disable-triggers \
    --no-tablespaces \
    --no-owner \
    --no-privileges \
    dump
```