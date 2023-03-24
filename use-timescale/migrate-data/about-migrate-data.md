---
title: About data migration
excerpt: Learn how to migrate your data into TimescaleDB
products: [mst, self_hosted]
keywords: [data migration]
tags: [csv, import]
---

# About data migration

You can migrate your existing data into TimescaleDB.

*   For data stored in PostgreSQL, see instructions for:
    *   [Migrating data within the same database][same-db]
    *   [Migrating data from a separate database][different-db]

*   For data stored in a `.csv` file, see instructions for [importing data from
    a `.csv`][import-data].

*   For data stored in InfluxDB, see instructions for [migrating data with
    Outflux][outflux].

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
