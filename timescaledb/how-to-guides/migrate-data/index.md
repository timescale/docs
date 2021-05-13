# Migrating Data
<highlight type="tip">
First make sure that you have properly [installed](/timescaledb/latest/how-to-guides/install-timescaledb/)
**AND [setup](/timescaledb/latest/how-to-guides/install-timescaledb/post-install-setup/)** TimescaleDB
within your PostgreSQL instance.
</highlight>

There are a number of choices available to migrate data into TimescaleDB:

### 1. Migrating from an existing PostgreSQL instance
Depending on where your data is currently stored,
the steps to migrate it to TimescaleDB are slightly different.

  1. **Same database**:  If you want to setup TimescaleDB in the
same database in the same PostgreSQL instance as your stored
data, [follow these instructions][same-db].

  2. **Different database**: If you want to migrate data from
a different database or a different PostgreSQL instance
altogether, [follow these instructions][different-db].

### 2. Importing data from `.csv`
If you have a dataset stored in a `.csv` file, you can import it into an empty
TimescaleDB hypertable. [follow these instructions][import-data]

<highlight type="tip">
When converting a normal SQL table to a hypertable, pay attention to how you handle constraints.
A hypertable can contain foreign keys to normal SQL table columns, but the reverse is not allowed.
UNIQUE and PRIMARY constraints must include the partitioning key.
</highlight>

### 3. Migrating from InfluxDB
If you want to migrate data from InfluxDB, [follow these instructions][outflux]


[installed]: /how-to-guides/install-timescaledb/
[setup]: /how-to-guides/install-timescaledb/post-install-setup/
[same-db]: /how-to-guides/migrate-data/same-db/
[different-db]: /how-to-guides/migrate-data/different-db/
[import-data]: /how-to-guides/migrate-data/import-csv/
[outflux]: /how-to-guides/migrate-data/migrate-influxdb/
