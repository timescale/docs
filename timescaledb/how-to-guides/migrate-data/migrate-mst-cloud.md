# Migrate from Managed Service for TimescaleDB to Timescale Cloud

Migrate your data from Managed Service for TimescaleDB to Timescale Cloud to take
advantage of Cloud's features.
These include separate scaling for compute and storage requirements, first-class 
multi-node support, and more.

There are two methods for migrating your data:

- **Directly migrate your entire database at once using `pg_dump` and `pg_restore`.**
  Choose this option for smaller databases.
  This method directly transfers all data, including Timescale-specific features.
  So your hypertables, continuous aggregates, and policies are automatically
  available in Cloud.

- **Migrate your schema, then migrate your data separately.**
  Choose this option for larger databases.
  This method allows you to individually migrate tables and chunks. 

<highlight type="tip">
The recommended migration method depends on both your database size and your network
upload and download speeds.

</highlight>

## Migrate your entire database at once

## Migrate your schema and data separately