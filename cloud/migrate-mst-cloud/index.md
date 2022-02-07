# Migrate from Managed Service for TimescaleDB to Timescale Cloud

Migrate your data to Timescale Cloud to experience Cloud's exclusive features.
These include separate scaling for compute and storage requirements, first-class
multi-node support, and more.

Choose between two methods for migrating your data:

- [**Migrate your entire database at once.**][migrate-entire] Choose
  this option for smaller databases. This method directly transfers all data and
  schemas, including TimescaleDB-specific features. Your hypertables, continuous
  aggregates, and policies are automatically available in Cloud.

- [**Migrate your schema and data separately.**][migrate-separately] Choose this
  option for larger databases. With this method, you migrate your tables one by
  one for easier failure recovery. If migration fails mid-way, you can restart
  from the failure point rather than from the beginning. However,
  TimescaleDB-specific features won't be automatically migrated. Follow the
  instructions to restore your hypertables, continuous aggregates, and policies. 

<highlight type="note">The recommended migration method depends on your database
size and your network upload and download speeds. If you aren't sure which
method to use, run the first method on one table to estimate the time required,
and switch to the second method if necessary.</highlight>

[migrate-entire]: migrate-mst-cloud/entire-database/
[migrate-separately]: migrate-mst-cloud/schema-then-data/