---
title: Data migration
excerpt: Migrate your existing data into Timescale
products: [cloud, mst, self_hosted]
keywords: [data migration]
tags: [csv, import, postgresql, influx, outflux]
---

# About data migration

You can migrate time-series data into your Timescale hypertables:

*   For data stored in PostgreSQL, see instructions for:
    *   [Migrating data within the same database][same-db]
    *   [Migrating data from a separate database][different-db]
*   For data stored in a `.csv` file, see instructions for
    [importing data from a `.csv`][import-data].
*   For data stored in InfluxDB, see instructions for
    [migrating data with Outflux][outflux].

If you need to migrate an entire database, see the section on
[database migration][migrate-db] instead.

## Considerations for data migration

For a successful migration, your destination database must have enough free disk
space. In most cases, you need disk space of at least 1.5 times the size of the
original data and any indexes. If your migration method requires decompression,
you should also account for the size of any temporarily decompressed tables. For
more information, see the specific instructions for your use case.

[different-db]: /use-timescale/:currentVersion:/migrate-data/different-db/
[import-data]: /use-timescale/:currentVersion:/migrate-data/import-csv/
[mst-to-cloud]: /use-timescale/:currentVersion:/migrate-data/
[outflux]: /use-timescale/:currentVersion:/migrate-data/migrate-influxdb/
[same-db]: /use-timescale/:currentVersion:/migrate-data/same-db/
[migrate-db]: /use-timescale/:currentVersion:/migrate-db/
