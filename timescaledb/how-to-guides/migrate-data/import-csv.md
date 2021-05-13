# Import data into TimescaleDB from .csv
<highlight type="tip">
First make sure that you have properly [installed](/timescaledb/latest/how-to-guides/install-timescaledb/)
**AND [setup](/timescaledb/latest/how-to-guides/install-timescaledb/post-install-setup/)** TimescaleDB
within your PostgreSQL instance.
</highlight>

If you have data stored in an external `.csv` file, you can import it into TimescaleDB:

1. Create a new empty table with the same schema as the data file and convert the table to a hypertable.
2.  Insert the data from the file.

### 1. Creating the new Empty Table

Creating the empty table requires foreknowledge of the schema of the data in the file, but is otherwise the same as creating any new hypertable.  Our example is a database named `new_db` and a data file named `old_db.csv`.

First create a new empty PostgreSQL table:

```sql
-- Assuming the data file's columns are time, location, temperature
CREATE TABLE conditions (
    time        TIMESTAMPTZ         NOT NULL,
    location    text                NOT NULL,
    temperature DOUBLE PRECISION    NULL
);
```

Then convert that table into a hypertable using [`create_hypertable`][create_hypertable]:

```sql
SELECT create_hypertable('conditions', 'time');
```

### 2. Inserting data into the hypertable [](csv-import)

#### Recommended: Using `timescaledb-parallel-copy`

To bulk insert data into the new table, we recommend using our
[open sourced Go program][parallel importer] that can speed up large data migrations by running multiple `COPY`s
concurrently. For example, to use 4 workers:
```bash
timescaledb-parallel-copy --db-name new_db --table conditions \
    --file old_db.csv --workers 4 --copy-options "CSV"
```

In addition to parallelizing the workload, the tool also offers flags
to improve the copy experience. [See the repo on GitHub][parallel importer] for full details.

<highlight type="tip">
We recommend not setting the number of workers higher than
the number of available CPU cores on the machine.
Above that, the workers tend to compete with each other for
resources and reduce the performance improvements.
</highlight>

#### Using PostgreSQL's `COPY`

Although we recommend our [open sourced Go program][parallel importer]
for better bulk insert performance, we can also use PostgreSQL's bulk insert command `COPY` to copy data
from the `.csv` into our new db:

```bash
psql -d new_db -c "\COPY conditions FROM old_db.csv CSV"
```

This method is straightforward and requires no extra tools, but for
large datasets it can be impractical and time-consuming because
`COPY` is single-threaded. For a faster method that can utilize more
of the CPU, use the previous method.

## Migration from InfluxDB to TimescaleDB using Outflux [](outflux)

Outflux is an open-source tool that users can use to batch migrate data from
InfluxDB to TimescaleDB. Anyone who is currently running an InfluxDB instance
can migrate their workload to TimescaleDB with a single command: `outflux migrate`.
You must also have [TimescaleDB installed][installed] and a means to connect to it.

With Outflux, users can pipe exported data directly into TimescaleDB.
Outflux manages schema discovery, validation, and creation.

For more information on how to get started, please follow [this tutorial][outflux-tutorial].


Now check out some common [hypertable commands][] for exploring your data.


[installed]: /how-to-guides/install-timescaledb/
[setup]: /how-to-guides/install-timescaledb/post-install-setup/
[outflux]: /how-to-guides/migrate-data/migrate-influxdb/
[create_hypertable]: /api/:currentVersion:/hypertable/create_hypertable
[unique_indexes]: /how-to-guides/schema-management/indexing/#default-indexes
[indexing]: /how-to-guides/schema-management/indexing/#indexing-data
[parallel importer]: https://github.com/timescale/timescaledb-parallel-copy
[outflux-tutorial]: /how-to-guides/migrate-data/migrate-influxdb/
[hypertable commands]: /how-to-guides/hypertables/
