# Table management

Designing proper table objects is a key part of using PostgreSQL. Creating the
appropriate indexes and table schema for a given workload can result in
significant performance improvements (and conversely, designing the wrong schema
can result in significant performance degradation).

TimescaleDB supports all table objects supported within PostgreSQL, including
data types, indexes, and triggers.

Note that sometimes it is useful to have a flexible schema, in particular when storing
semi-structured data (e.g., storing readings from IoT sensors collecting
varying measurements). For these cases, TimescaleDB also supports the
PostgreSQL JSON and JSONB datatypes.

In this section, we provide detailed examples and best practices of how to
create appropriate indexes, triggers, constraints, and tablespaces on your tables,
as well as how to appropriately utilize the JSON and JSONB datatypes.

>:TIP: One of the most common ways of getting information about various aspects
of your database is through `psql`, the interactive terminal.  See the
[PostgreSQL docs][psql-docs] for more information.

## Indexing Data [](indexing)

TimescaleDB supports the range of PostgreSQL index types, and creating, altering,
or dropping an index on the hypertable ([PostgreSQL docs][postgres-createindex])
will similarly be propagated to all its constituent chunks.

Data is indexed via the SQL `CREATE INDEX` command. For instance,
```sql
CREATE INDEX ON conditions (location, time DESC);
```
This can be done before or after converting the table to a hypertable.

>:TIP: For sparse data where a column is often NULL, we suggest adding
a `WHERE column IS NOT NULL` clause to the index (unless you are often
searching for missing data). For example,
```sql
CREATE INDEX ON conditions (time DESC, humidity)
  WHERE humidity IS NOT NULL;
```
this creates a more compact, and thus efficient, index.

### Best Practices  [](indexing-best-practices)

Our experience has shown that for time-series data, the most-useful index type
varies depending on your data.

For indexing columns with discrete (limited-cardinality) values (e.g., where you
are most likely to use an "equals" or "not equals" comparator) we suggest using
an index like this (using our hypertable `conditions` for the example):
```sql
CREATE INDEX ON conditions (location, time DESC);
```
For all other types of columns, i.e., columns with continuous values (e.g.,
where you are most likely to use a
"less than" or "greater than" comparator) the index should be in the form:
```sql
CREATE INDEX ON conditions (time DESC, temperature);
```
Having a `time DESC` column specification in the index allows for efficient
queries by column-value and time. For example, the index defined above would
optimize the following query:
```sql
SELECT * FROM conditions WHERE location = 'garage'
  ORDER BY time DESC LIMIT 10
```

To understand why composite indexes should be defined in such a
fashion, consider an example with two locations ("office" and "garage"), and
various timestamps and temperatures:

An index on `(location, time DESC)` would be organized in sorted order
as follows:

```
garage-4
garage-3
garage-2
garage-1
office-3
office-2
office-1
```

An index on `(time DESC, location)` would be organized in sorted order
as follows:

```
4-garage
3-garage
3-office
2-garage
2-office
1-garage
1-office
```

One can think of an index's btrees as being constructed from the most
significant bit downwards, so it first matches on the first character,
then second, etc., while in the above example they are conveniently shown
as two separate tuples.

Now, with a predicate like `WHERE location = 'garage' and time >= 1 and time < 4`, the top is much better to use: all readings from a given
location are contiguous, so the first bit of the index precisely finds
all metrics from "garage", and then we can use any additional time
predicates to further narrow down the selected set.  With the latter,
you would have to look over all of the time records [1,4), and then once
again find the right device in each. Much less efficient.

On the other hand, consider if our conditional was instead asking `temperature > 80`, particularly if that conditional matched a larger number of
values.  You still need to search through all sets of time values
matching your predicate, but in each one, your query also grabs a
(potentially large) subset of the values, rather than just one
distinct one.

>:TIP: [](unique_indexes) To define an index as UNIQUE or PRIMARY KEY, the time column and, if it
exists, the partitioning column **must** be part of the index.
That is, using our running example, you can define a unique index on just the
{time, location} fields, or to include additional columns (say, temperature).
That said, we find UNIQUE indexes in time-series data to be much less prevalent than
in traditional relational data models.


### Default Indexes

By default, TimescaleDB automatically creates a time index on your
data when a hypertable is created.

```sql
CREATE INDEX ON conditions (time DESC);
```

Additionally, if the `create_hypertable` command specifies an optional
"space partition" in addition to time (say, the `location` column),
TimescaleDB will automatically create the following index:

```sql
CREATE INDEX ON conditions (location, time DESC);
```

This default behavior can be overridden when executing the [`create_hypertable`][create_hypertable] command.

---

## Creating Triggers [](triggers)

TimescaleDB supports the full range of PostgreSQL triggers, and creating,
altering, or dropping triggers on the hypertable will similarly
propagate these changes to all of a hypertable's constituent chunks.

In the following example, let's say you want to create a new
table `error_conditions` with the same schema as `conditions`, but designed
to only store records which are deemed erroneous, where an application
signals a sensor error by sending a `temperature` or `humidity` having a
value >= 1000.

So, we'll take a two-step approach. First, let's create a function that
will insert data deemed erroneous into this second table:

```sql
CREATE OR REPLACE FUNCTION record_error()
  RETURNS trigger AS $record_error$
BEGIN
 IF NEW.temperature >= 1000 OR NEW.humidity >= 1000 THEN
   INSERT INTO error_conditions
     VALUES(NEW.time, NEW.location, NEW.temperature, NEW.humidity);
 END IF;
 RETURN NEW;
END;
$record_error$ LANGUAGE plpgsql;
```
Second, create a trigger that will call this function whenever a new row is
inserted into the hypertable.

```sql
CREATE TRIGGER record_error
  BEFORE INSERT ON conditions
  FOR EACH ROW
  EXECUTE PROCEDURE record_error();
```
Now, all data is inserted into the `conditions` data, but any row deemed
erroneous is _also_ added to the `error_conditions` table.

TimescaleDB supports the full gamut of
triggers: `BEFORE INSERT`, `AFTER INSERT`, `BEFORE UPDATE`, `AFTER UPDATE`, `BEFORE DELETE`, `AFTER DELETE`.
For additional information, see the [PostgreSQL docs][postgres-createtrigger].

---

## Adding Constraints [](constraints)

Hypertables support all standard PostgreSQL constraint types, with the
exception of foreign key constraints on other tables that reference
values in a hypertable. Creating, deleting, or altering constraints on
hypertables will propagate to chunks, accounting also for any indexes
associated with the constraints. For instance, a table can be created
as follows:


```sql
CREATE TABLE conditions (
    time       TIMESTAMPTZ
    temp       FLOAT NOT NULL,
    device_id  INTEGER CHECK (device_id > 0),
    location   INTEGER REFERENCES locations (id),
    PRIMARY KEY(time, device_id)
);

SELECT create_hypertable('conditions', 'time');
```

This table will only allow positive device IDs, non-null temperature
readings, and will guarantee unique time values for each device. It
also references values in another `locations` table via a foreign key
constraint. Note that time columns used for partitioning do not allow
`NULL` values by default. TimescaleDB will automatically add a `NOT
NULL` constraint to such columns if missing.

For additional information on how to manage constraints, see the
[PostgreSQL docs][postgres-createconstraint].

---

## JSON support for semi-structured data [](json)

TimescaleDB can work with any data types available in PostgreSQL, including JSON
and JSONB. These datatypes are most useful for data that contains user-defined
fields (i.e., fields names that are defined by individual users and vary from
user-to-user). We recommend using this in a semi-structured way:

```sql
CREATE TABLE metrics (
  time TIMESTAMPTZ,
  user_id INT,
  device_id INT,
  data JSONB
);
```
The above model schema demonstrates some best practices when using JSON:
1. Common fields such as time, user_id, and device_id are pulled outside of the
JSONB structure and stored as columns. This is because field accesses are more
efficient on table columns than inside of JSONB structures. Storage is also more
efficient.

2. We use the JSONB data type (that is, JSON stored in a binary format) and not the JSON data type. JSONB data types are
are more efficient in both storage overhead and lookup performance.

>:TIP: [](sparse_json) Often, people use JSON for sparse data as opposed
to user-defined data. We do not recommend this usage inside TimescaleDB for most
datasets (unless the data is extremely sparse, e.g., more than 95% of fields for
a row are empty). Instead, we suggest using NULLable fields and, if possible,
running on top of a compressed file system like ZFS.


### Indexing the entire JSONB structure [](indexing-all-json)

When indexing JSONB data across all fields that may be contained inside, it is
often best to use a GIN index. PostgreSQL documentation has
a [nice description][json-indexing] of the different types of GIN indexes
available on JSON data. If in doubt, it is best to use the default GIN operator
since it allows for more powerful queries:

```sql
CREATE INDEX idxgin ON metrics USING GIN (data);
```

Please note that this index will only optimize queries for which the WHERE clause
uses the `?`, `?&`, `?|`, or `@>` operator (for a description of these operators
see [this table][json-operators] in the PostgreSQL docs). So you should make
sure to structure your queries appropriately.

### Indexing individual fields within a JSONB [](indexing-json-fields)

Sometimes, JSONB columns have common fields whose values are useful to index
individually. Such indexes could be useful for ordering operations on field
values, [multicolumn indexes][multicolumn-index], and indexes on  specialized
types (for example, using a field value as a postGIS geography type). Another
advantage of indexes on individual field values is that they are often smaller
than GIN indexes on the entire JSONB field. To create such an index, it is often
useful to use a [partial index][partial-index] on an
[expression][expression-index] accessing the field. For example,

```sql
CREATE INDEX idxcpu
  ON metrics(((data->>'cpu')::double precision))
  WHERE data ? 'cpu';
```

In this example, the expression being indexed is the `cpu` field inside the
`data` JSONB object cast to a double. The cast reduces the size of the index by
storing the (much smaller) double instead of a string. The WHERE clause ensures
that the only rows included in the index are those that contain a `cpu` field
(i.e.,  `data ? 'cpu'` returns true). This also serves to reduce the size
of the index by not including rows without a `cpu` field. Note that in order for
a query to use the index, it must have `data ? 'cpu'` in the WHERE clause.

The expression above can be used with a multi-column index (e.g., adding `time
DESC` as a leading column). Note, however, that to enable index-only scans, you
need `data` as a column, not the full expression `((data->>'cpu')::double
precision)`.

---

## Altering/updating table schemas [](updating-schemas)

TimescaleDB supports using the `ALTER TABLE` command to modify the schema of the
hypertable. A change to the hypertable schema results in changes to the schema of each
underlying chunk.

This change can be a potentially expensive operation if it requires a rewrite of
the underlying data.  However, a common modification is to add a field with a
default value of NULL (if no DEFAULT clause is specified, then the default will
be NULL); such a schema modification is inexpensive. More details can be found
in the Notes section of the [PostgreSQL documentation on ALTER TABLE][postgres-alter-table].

---

## Storage management with tablespaces [](tablespaces)

An administrator can use tablespaces to manage storage for a
hypertable. A tablespace is a location on a file system where database
objects (e.g., tables and indexes) are stored. Review the standard
PostgreSQL [documentation on tablespaces][postgres-tablespaces] for
more information, including how to create tablespaces.

Since a hypertable comprises a number of chunks, each chunk can be
placed in a specific tablespace, allowing the hypertable to grow
across many disks. To this end, TimescaleDB allows
[attaching][attach_tablespace] and [detaching][detach_tablespace]
tablespaces on a hypertable. When new chunks are created, one of the
hypertable's attached tablespaces is picked by the runtime to store
the chunk's data. Thus, a typical use case is to detach a tablespace
from a hypertable when the tablespace runs out of disk space and
attach a new one that has free space. A hypertable's attached
tablespaces can be viewed with the
[`show_tablespaces`][show_tablespaces] command.

### How hypertable chunks are assigned tablespaces

A hypertable can be partitioned in multiple dimensions, but only one
of the dimensions is used to determine the tablespace assigned to a
particular hypertable chunk. If a hypertable has one or more hash-partitioned
("space") dimensions, then the first hash-partitioned dimension
is used. Otherwise, the first time dimension is used. This assignment
strategy ensures that hash-partitioned hypertables will have chunks
colocated according to hash partition, as long as the list of
tablespaces attached to the hypertable remains the same. Modulo
calculation is used to pick a tablespace, so there can be more partitions
than tablespaces (e.g., if there are two tablespaces, partition number
three will use the first tablespace).

>:TIP: Note that attaching more tablespaces than there are partitions for the
hypertable might leave some tablespaces unused until some of them are detached
or additional partitions are added. This is especially true for
hash-partitioned tables.

Hypertables that are only time-partitioned will add new
partitions continuously, and will therefore have chunks assigned to
tablespaces in a way similar to round-robin.

[psql-docs]: https://www.postgresql.org/docs/current/static/app-psql.html
[postgres-createindex]: https://www.postgresql.org/docs/current/static/sql-createindex.html
[create_hypertable]: /api#create_hypertable
[postgres-createtrigger]: https://www.postgresql.org/docs/current/static/sql-createtrigger.html
[postgres-createconstraint]: https://www.postgresql.org/docs/current/static/ddl-constraints.html
[json-indexing]: https://www.postgresql.org/docs/current/static/datatype-json.html#JSON-INDEXING
[json-operators]: https://www.postgresql.org/docs/current/static/functions-json.html#FUNCTIONS-JSONB-OP-TABLE
[multicolumn-index]: https://www.postgresql.org/docs/current/static/indexes-multicolumn.html
[partial-index]: https://www.postgresql.org/docs/current/static/indexes-partial.html
[expression-index]: https://www.postgresql.org/docs/current/static/indexes-expressional.html
[postgres-alter-table]: https://www.postgresql.org/docs/current/static/sql-altertable.html
[postgres-tablespaces]: https://www.postgresql.org/docs/current/static/manage-ag-tablespaces.html
[attach_tablespace]: /api/#attach_tablespace
[detach_tablespace]: /api/#detach_tablespace
[show_tablespaces]: /api/#show_tablespaces
