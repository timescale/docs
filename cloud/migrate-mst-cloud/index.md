# Migrate from Managed Service for TimescaleDB to Timescale Cloud

Migrate your data to Timescale Cloud to experience Cloud's exclusive features.
These include separate scaling for compute and storage requirements, first-class
multi-node support, and more.

There are two methods for migrating your data:

- [**Migrate your entire database at once.**][migrate-entire] This method
  directly transfers all data and schemas, including TimescaleDB-specific
  features. Your hypertables, continuous aggregates, and policies are
  automatically available in Cloud.

- [**Migrate your schema and data separately.**][migrate-separately] With this
  method, you migrate your tables one by one for easier failure recovery. If
  migration fails mid-way, you can restart from the failure point rather than
  from the beginning. However, TimescaleDB-specific features won't be
  automatically migrated. Follow the instructions to restore your hypertables,
  continuous aggregates, and policies. 

## Choosing a migration method
  
The recommended method depends on your database size, network upload and
download speeds, and tolerance for failure recovery. As a starting guideline,
the first method may work well for databases smaller than ??? GB. 

Larger databases can also be migrated using the first method. However, the
copying process must keep running, potentially over days or weeks. If
interruptions are a concern, the second method may work better.

If you aren't sure which method to use, try running the first method to estimate
the time required. Abort and switch to the second method if necessary.

## Migrating an active database

If your database is actively ingesting data, take precautions to ensure that
your new database contains data ingested while migration is happening. First,
run ingest in parallel on both databases. This ensure that the newest data is
written to both Managed Service for TimescaleDB and Timescale Cloud. Then
backfill your data with one of the two migration methods.

[migrate-entire]: migrate-mst-cloud/entire-database/
[migrate-separately]: migrate-mst-cloud/schema-then-data/