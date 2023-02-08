---
title: Migrate your TimescaleDB database to Timescale Cloud
excerpt: Migrate from self-hosted TimescaleDB or Managed Service for TimescaleDB
product: cloud
keywords: [data migration, self-hosted, mst]
tags: [ingest]
---

# Migrate your TimescaleDB database to Timescale Cloud

You can migrate your data to Timescale Cloud from self-hosted TimescaleDB or
Managed Service for TimescaleDB. This allows you to use Timescale Cloud's
exclusive features, including separate scaling for compute and storage
requirements, first-class multi-node support, and more.

There are several methods for migrating your data:

*   [Migrate an existing PostgreSQL database][hypershift]: Use the
    hypershift tool to migrate an existing PostgreSQL database in one step,
    creating hypertables on the fly, and compressing data during migration.
*   [Migrate your entire database at once][migrate-entire]: This method
    directly transfers all data and schemas, including TimescaleDB-specific
    features. Your hypertables, continuous aggregates, and policies are
    automatically available in Cloud.
*   [Migrate your schema and data separately][migrate-separately]: With this
    method, you migrate your tables one by one for easier failure recovery. If
    migration fails mid-way, you can restart from the failure point rather than
    from the beginning. However, TimescaleDB-specific features won't be
    automatically migrated. Follow the instructions to restore your hypertables,
    continuous aggregates, and policies.

## Choose a migration method

Which method you choose depends on your database size, network upload and
download speeds, existing continuous aggregates, and tolerance for failure
recovery.

If your database is smaller than 100&nbsp;GB, choose to migrate your entire
database at once. If your source database is PostgreSQL, use the hypershift
tool to avoid having to dump your data to a directory before restoring it.

You can also migrate larger databases using this method, but
the copying process must keep running, potentially over days or weeks. If the
copy is interrupted, the process needs to be restarted. If you think an
interruption in the copy is possible, choose to migrate your schema and data
separately instead.

<highlight type="warning">
Migrating your schema and data separately does not retain continuous aggregates
calculated using already-deleted data. For example, if you delete raw data after
a month but retain downsampled data in a continuous aggregate for a year, the
continuous aggregate loses any data older than a month upon migration. If you
must keep continuous aggregates calculated using deleted data, migrate your
entire database at once regardless of database size.
</highlight>

If you aren't sure which method to use, try copying the entire database at once
to estimate the time required. If the time estimate is very long, stop the
migration and switch to the other method.

## Migrate an active database

If your database is actively ingesting data, take precautions to ensure that
Timescale Cloud contains the data that is ingested while the migration is
happening. Begin by running ingest in parallel on the source database and
Timescale Cloud. This ensures that the newest data is written to both databases.
Then backfill your data with one of the two migration methods.

[migrate-entire]: /cloud/:currentVersion:/migrate-to-cloud/entire-database/
[migrate-separately]: /cloud/:currentVersion:/migrate-to-cloud/schema-then-data/
[hypershift]: cloud/:currentVersion:/migrate-to-cloud/hypershift/
