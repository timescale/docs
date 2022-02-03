# Migrate from Managed Service for TimescaleDB to Timescale Cloud

Migrate your data to Timescale Cloud to take advantage of Cloud's advanced
features. These include separate scaling for compute and storage requirements,
first-class multi-node support, and more.

There are two methods for migrating your data:

- [**Migrate the entire database at once using the PostgreSQL utilities 
  `pg_dump` and `pg_restore`.**](#migrate-the-entire-database-at-once) Choose
  this option for smaller databases. This method directly transfers all data and
  schemas, including TimescaleDB-specific features. Your hypertables, continuous
  aggregates, and policies are automatically available in Cloud.

- [**Migrate the schema, and then migrate the data
  separately.**](#migrate-the-schema-and-data-separately) Choose this option for
  larger databases. This method allows you to individually migrate tables and
  chunks. If the migration fails mid-way, you can restart from the failure point
  rather than the beginning. With this method, TimescaleDB-specific features
  won't be migrated. See the instructions below to restore your hypertables,
  continuous aggregates, and policies. 

<highlight type="tip"> 
The recommended migration method depends on both your
database size and your network upload and download speeds. If you aren't sure
which method to use, start with the first method and try running `pg_dump` on
one table. If it takes too long, switch to the second method. 
</highlight>





