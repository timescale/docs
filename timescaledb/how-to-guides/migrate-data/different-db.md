# Migrating from a different PostgreSQL database

<highlight type="tip">
First make sure that you have properly [installed](/install/latest/)
**AND [setup](/install/latest/)** TimescaleDB
within your PostgreSQL instance.
</highlight>

To migrate your database from PostgreSQL to TimescaleDB, you
need `pg_dump` for exporting your schema and data.

Migration falls into three main steps:

1. Copy over the database schema and choose which tables become
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

Follow [these instructions][csv-import] to insert data into your hypertable.

Now check out some common [hypertable commands][] for exploring your data.


[installed]: /install/latest/
[setup]: /install/latest/
[csv-import]: /how-to-guides/migrate-data/import-csv/
[hypertable commands]: /how-to-guides/hypertables/
