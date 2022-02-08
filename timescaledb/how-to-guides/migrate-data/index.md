# Migrate data
There are a number of choices available to migrate data into TimescaleDB:

1.  Same database: to set up TimescaleDB in the same database in the same
    PostgreSQL instance as your stored data,
    [follow these instructions][same-db].
1.  Different database: to migrate data from a different database or a different
    PostgreSQL instance altogether, [follow these instructions][different-db].
1.  Importing data from `.csv`: If you have a dataset stored in a `.csv` file,
    you can import it into an empty TimescaleDB hypertable.
    [Follow these instructions][import-data].
1.  Migrating from InfluxDB: to migrate data from InfluxDB,
    [follow these instructions][outflux]
1.  Migrating from Managed Service for TimescaleDB to Timescale Cloud: To
    migrate between Timescale's cloud services, [follow these
    instructions][mst-to-cloud].

<highlight type="warning">
Before you begin migrating data, ensure you have enough free disk space. In most
cases, you require free space of at least 1.5 times the size of the
original data and any indexes.
</highlight>

<highlight type="note">
When converting a normal SQL table to a hypertable, pay attention to how you
handle constraints. A hypertable can contain foreign keys to normal SQL table
columns, but the reverse is not allowed. UNIQUE and PRIMARY constraints must
include the partitioning key.
</highlight>


[same-db]: /how-to-guides/migrate-data/same-db/
[different-db]: /how-to-guides/migrate-data/different-db/
[import-data]: /how-to-guides/migrate-data/import-csv/
[mst-to-cloud]: /cloud/:currentVersion:/migrate-mst-cloud/
[outflux]: /how-to-guides/migrate-data/migrate-influxdb/
