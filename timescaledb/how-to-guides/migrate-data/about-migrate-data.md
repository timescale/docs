# About data migration
You can migrate your existing data into TimescaleDB.

*   For data stored in PostgreSQL, see instructions for:
    *   [Migrating data within the same database][same-db]
    *   [Migrating data from a separate database][different-db]

*   For data stored in a `.csv` file, see instructions for [importing data from
    a `.csv`][import-data].

*   For data stored in InfluxDB, see instructions for [migrating data with
    Outflux][outflux].

You can also migrate data between TimescaleDB instances. See instructions for
[migrating to Timescale Cloud][mst-to-cloud] from another TimescaleDB service or
a self-hosted database.

## Considerations for data migration
For a successful migration, your destination database must have enough free disk
space. In most cases, you need disk space of at least 1.5 times the size of the
original data and any indexes. If your migration method requires decompression,
you should also account for the size of any temporarily decompressed tables. For
more information, see the specific instructions for your use case.

[same-db]: /how-to-guides/migrate-data/same-db/
[different-db]: /how-to-guides/migrate-data/different-db/
[import-data]: /how-to-guides/migrate-data/import-csv/
[mst-to-cloud]: /cloud/:currentVersion:/migrate-to-cloud/
[outflux]: /how-to-guides/migrate-data/migrate-influxdb/
