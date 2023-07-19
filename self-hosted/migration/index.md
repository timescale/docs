---
title: Migrate your PostgreSQL database to self-hosted TimescaleDB
excerpt: Migrate an existing PostgreSQL database to Timescale
products: [self_hosted]
keywords: [data migration, self_hosted, postgresql, RDS]
tags: [ingest, migrate, RDS]
---

# Migrate your PostgreSQL database to self-hosted TimescaleDB

You can migrate your existing PostgreSQL database to your self-hosted Timescale
installation.

There are several methods for migrating your data:

*   If the database you want to migrate is smaller than 100&nbsp;GB,
    [migrate your entire database at once][migrate-entire]:
    This method directly transfers all data and schemas, including
    Timescale-specific features. Your hypertables, continuous aggregates, and
    policies are automatically available in the new Timescale database.
*   For databases larger than 100&nbsp;GB,
    [migrate your schema and data separately][migrate-separately]: With this
    method, you migrate your tables one by one for easier failure recovery. If
    migration fails mid-way, you can restart from the failure point rather than
    from the beginning. However, Timescale-specific features won't be
    automatically migrated. Follow the instructions to restore your hypertables,
    continuous aggregates, and policies.
*   If you need to move data from PostgreSQL tables into hypertables within an
    existing Timescale database,
    [migrate within the same database][migrate-same-db]: This method assumes that
    you have Timescale set up in the same database instance as your existing table.
*   If you have data in an InfluxDB database,
    [migrate using Outflux][outflux]:
    Outflux pipes exported data directly to Timescale, and manages schema
    discovery, validation, and creation. Outflux works with earlier versions of
    InfluxDB. It does not work with InfluxDB version 2 and later.

## Choose a migration method

Which method you choose depends on your database size, network upload and
download speeds, existing continuous aggregates, and tolerance for failure
recovery.

<Highlight type="note">
If you are migrating from an Amazon RDS service, Amazon charges for the amount
of data transferred out of the service. You could be charged by Amazon for all
data egressed, even if the migration fails.
</Highlight>

If your database is smaller than 100&nbsp;GB, choose to migrate your entire
database at once. You can also migrate larger databases using this method, but
the copying process must keep running, potentially over days or weeks. If the
copy is interrupted, the process needs to be restarted. If you think an
interruption in the copy is possible, choose to migrate your schema and data
separately instead.

<Highlight type="warning">
Migrating your schema and data separately does not retain continuous aggregates
calculated using already-deleted data. For example, if you delete raw data after
a month but retain downsampled data in a continuous aggregate for a year, the
continuous aggregate loses any data older than a month upon migration. If you
must keep continuous aggregates calculated using deleted data, migrate your
entire database at once regardless of database size.
</Highlight>

If you aren't sure which method to use, try copying the entire database at once
to estimate the time required. If the time estimate is very long, stop the
migration and switch to the other method.

## Migrate an active database

If your database is actively ingesting data, take precautions to ensure that
your Timescale database contains the data that is ingested while the migration
is happening. Begin by running ingest in parallel on the source and target
databases. This ensures that the newest data is written to both databases. Then
backfill your data with one of the two migration methods.

[migrate-entire]: /self-hosted/:currentVersion:/migration/entire-database/
[migrate-separately]: /self-hosted/:currentVersion:/migration/schema-then-data/
[migrate-same-db]: /self-hosted/:currentVersion:/migration/same-db/
[outflux]: /self-hosted/:currentVersion:/migration/migrate-influxdb/
