# Migrating Data
<highlight type="tip">
First make sure that you have properly [installed](/how-to-guides/install-timescaledb/) 
**AND [setup](/how-to-guides/install-timescaledb/post-install-setup/)** TimescaleDB 
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

---

## Migrate from the Same PostgreSQL Database [](same-db)

For this example we'll assume that you have a table named `old_table` that you
want to migrate to a table named `new_table`.  The steps are:

1. Create a new empty table with the same table structure and other constraints
as the old one, using `LIKE`.
1. Convert the table to a hypertable and insert data from the old table.
1. Add any additional indexes needed.

### 1. Creating the New Empty Table

There are two ways to go about this step: one more convenient, the other faster.

#### Convenient Method

This method recreates `old_table` indexes on `new_table` when it is created so that
when we convert it to a hypertable in the next step, we don't have to make them
ourselves.  It avoids a step, but slows down the data transfer due to the need to
update the indexes for each migrated row.

```sql
CREATE TABLE new_table (LIKE old_table INCLUDING DEFAULTS INCLUDING CONSTRAINTS INCLUDING INDEXES);
```

#### Faster Method

This method does not generate the indexes while making the table.  This makes the data
transfer faster than the convenient method, but requires us to add the indexes as a
final step.

```sql
CREATE TABLE new_table (LIKE old_table INCLUDING DEFAULTS INCLUDING CONSTRAINTS EXCLUDING INDEXES);
```

### 2. Convert the New Table to a Hypertable

We use the TimescaleDB function [`create_hypertable`][create_hypertable] to
convert `new_table` to a hypertable, then simply `INSERT` data from the old table:

```sql
-- Assuming 'time' is the time column for the dataset
SELECT create_hypertable('new_table', 'time');

-- Insert everything from old_table
INSERT INTO new_table SELECT * FROM old_table;
```

<highlight type="warning">
`create_hypertable` may fail if invalid UNIQUE or PRIMARY
KEY indexes existed on the old table (see this [note][unique_indexes]).
In this case, you would have to reconfigure your indexes
and/or schema.
</highlight>

### 3. Add Additional Indexes

If you used the convenient method, whatever indexes were on `old_table` are now
on `new_table` making this step optional. For the faster `CREATE TABLE` method
or for adding any indexes not on `old_table`, you need to add indexes to
this hypertable.

```sql
CREATE INDEX on new_table (column_name, <options>)
```

Tada!  You did it!

For more info on the best strategies for indexing, check out
our [schema management][indexing] section.

---

## Migrating from a Different PostgreSQL Database [](different-db)

To migrate your database from PostgreSQL to TimescaleDB, you
need `pg_dump` for exporting your schema and data.

Migration falls into three main steps:

1. Copy over the database schema and choose which tables will become
hypertables (i.e., those that currently have time-series data).
1. Backup data to comma-separated values (CSV).
1. Import the data into TimescaleDB

For this example we'll assume you have a PostgreSQL instance with a database
called `old_db` that contains a single table called `conditions` that you want to
convert into a hypertable in a new database called `new_db`.

### 1. Copying Schema & Setting up Hypertables

Copying over your database schema is easily done with `pg_dump`:
```bash
pg_dump --schema-only -f old_db.bak old_db
```

This creates a backup file called `old_db.bak` that contains only the
SQL commands to recreate all the tables in `old_db`, which in this case
is just `conditions`.

To create those tables in `new_db`:
```bash
psql -d new_db < old_db.bak
```

Now that we have the schema, we want to convert tables into hypertables
where appropriate. So let's connect with the client:
```bash
psql -d new_db
```
Then use the `create_hypertable` function on the tables to make hypertables.
Due to a current limitation, this must be run on a table while it is empty, so
we do this before importing data.
In this case, our hypertable target is `conditions` (using
column `time` as the time partitioning column):
```sql
SELECT create_hypertable('conditions', 'time');
```

Your new database is now ready for data.

### 2. Backing up Data to CSV

To backup your data to CSV, we can run a `COPY`:

```bash
# The following ensures 'conditions' outputs to a comma-separated .csv file
psql -d old_db -c "\COPY (SELECT * FROM conditions) TO old_db.csv DELIMITER ',' CSV"
```

Your data is now stored in a file called `old_db.csv`.

### 3. Import Data into TimescaleDB

Follow the [instructions below][csv-import] to insert data into your hypertable.

---

## Import data into TimescaleDB from .csv [](import-data)

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
[same-db]: #same-db
[different-db]: #different-db
[import-data]: #import-data
[outflux]: #outflux
[create_hypertable]: /api/:currentVersion:/hypertable/create_hypertable
[unique_indexes]: /how-to-guides/schema-management/indexing/#default-indexes
[indexing]: /how-to-guides/schema-management/indexing/#indexing-data
[csv-import]: #csv-import
[parallel importer]: https://github.com/timescale/timescaledb-parallel-copy
[outflux-tutorial]: /how-to-guides/migrate-data/migrate-influxdb/
[hypertable commands]: /how-to-guides/hypertables/
