# Indexing Data

TimescaleDB supports the range of PostgreSQL index types, and creating, altering,
or dropping an index on the hypertable ([PostgreSQL docs][postgres-createindex])
will similarly be propagated to all its constituent chunks.

Data is indexed via the SQL `CREATE INDEX` command. For instance,
```sql
CREATE INDEX ON conditions (location, time DESC);
```
This can be done before or after converting the table to a hypertable.

<highlight type="tip">
For sparse data where a column is often NULL, we suggest adding
a `WHERE column IS NOT NULL` clause to the index (unless you are often
searching for missing data). For example,

```sql
CREATE INDEX ON conditions (time DESC, humidity)
  WHERE humidity IS NOT NULL;
```

this creates a more compact, and thus efficient, index.
</highlight>

## Best Practices

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

Now, with a predicate like `WHERE location = 'garage' and time >= 1 and time < 4`, 
the top is much better to use: all readings from a given
location are contiguous, so the first bit of the index precisely finds
all metrics from "garage", and then we can use any additional time
predicates to further narrow down the selected set.  With the latter,
you would have to look over all of the time records [1,4), and then once
again find the right device in each. Much less efficient.

On the other hand, consider if our conditional was instead asking `temperature > 80`,
 particularly if that conditional matched a larger number of
values.  You still need to search through all sets of time values
matching your predicate, but in each one, your query also grabs a
(potentially large) subset of the values, rather than just one
distinct one.

<highlight type="tip">
[](unique_indexes) To define an index as UNIQUE or PRIMARY KEY, the time column and, if it
exists, the partitioning column **must** be part of the index.
That is, using our running example, you can define a unique index on just the
(time, location) fields, or to include additional columns (say, temperature).
That said, we find UNIQUE indexes in time-series data to be much less prevalent than
in traditional relational data models.
</highlight>

## Default Indexes

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


[create_hypertable]: /api#create_hypertable
