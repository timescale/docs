# Migrate from the Same PostgreSQL Database
<highlight type="tip">
First make sure that you have properly [installed](/timescaledb/latest/how-to-guides/install-timescaledb/)
**AND [setup](/timescaledb/latest/how-to-guides/install-timescaledb/post-install-setup/)** TimescaleDB
within your PostgreSQL instance.
</highlight>

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

Now check out some common [hypertable commands][] for exploring your data.


[installed]: /how-to-guides/install-timescaledb/
[setup]: /how-to-guides/install-timescaledb/post-install-setup/
[create_hypertable]: /api/:currentVersion:/hypertable/create_hypertable
[unique_indexes]: /how-to-guides/schema-management/indexing/#default-indexes
[indexing]: /how-to-guides/schema-management/indexing/#indexing-data
[hypertable commands]: /how-to-guides/hypertables/
