# Indexing data
Because looking up data can take a long time, especially if you have a lot of data in your hypertable, you can use an index to speed up read operations. You can create an index on any combination of columns, as long as you include the `time` column, for time-series data. Which column you choose to create your index on depends on what kind of data you have stored. 

Consider a simple example with temperatures collected from two locations called `office` and `garage`:

An index on `(location, time DESC)` is organized like this:
```
garage-0940
garage-0930
garage-0920
garage-0910
office-0930
office-0920
office-0910
```

An index on `(time DESC, location)` is organized like this:
```
0940-garage
0930-garage
0930-office
0920-garage
0920-office
0910-garage
0910-office
```

A good rule of thumb with indexes is to think in layers. Start by choosing the columns that you typically want to run equality operators on, such as `location = garage`. Then finish by choosing columns you want to use range operators on, such as `time > 0930`. 

As a more complex example, imagine you have a number of of devices tracking 1,000 different retail stores. You have 100 devices per store, and 5 different types of devices. All of these devices report metrics as `float` values, and you decide to store all the metrics in the same table, like this:

```sql
CREATE TABLE devices (
     time timestamptz,
     device_id int,
     device_type int,
     store_id int,
     value float
);
```      

When you create this table, an index is automatically generated on the time column, making it faster to query your data based on time.

If you want to query your data on something other than time, you can cerate different indexes. For example, you might want to query data from the last month for just a given `device_id`. Or you could query all data for a singhle `store_id` for the last three months.

You want to keep the index on time so that you can quickly filter for a given time range, and add another index on `device_id` and `store_id`. This creates a composite index. A composite index on `(store_id, device_id, time)` orders by `store_id` first. Each unique `store_id`, will then be sorted by `device_id` in order. And each entry with the same `store_id` and `device_id` are then ordered by `time`. 

If you have this composite index on your hypertable, you can run a range of different queries. Here are some examples:

```sql
SELECT * FROM devices WHERE store_id = x
```

This queries the portion of the list with a specific store_id. The index is effective for this query, but could be a bit bloated; an index on just `store_id` would probably be more efficient.

```sql
SELECT * FROM devices WHERE store_id = x, time > 10
```

This query is not effective, because it would need to scan multiple sections of the list. This is because the part of the list that contains data for `time > 10` for one device would be located in a different section than for a different device. In this case, consider building an index on `(store_id, time)` insetad.

```sql
SELECT * FROM devices WHERE device_id = M, time > 10
```

The index in our example is useless for this query, because the data for `device M` is located in a completely different section of the list for each `store_id`.

```sql
SELECT * FROM devices WHERE store_id = M, device_id = M, time > 10
```

This is a perfect query for this index. It narrows down the list to a very particular portion.





TimescaleDB supports the range of PostgreSQL index types, and creating, altering,
or dropping an index on the hypertable ([PostgreSQL docs][postgres-createindex])
is similarly propagated to all its constituent chunks.

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

## Best practices

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

<highlight type="note">
To define an index as UNIQUE or PRIMARY KEY, the time column and, if it
exists, the partitioning column **must** be part of the index.
That is, using our running example, you can define a unique index on just the
(time, location) fields, or to include additional columns (say, temperature).
That said, we find UNIQUE indexes in time-series data to be much less prevalent than
in traditional relational data models.
</highlight>

## Default indexes

By default, TimescaleDB automatically creates a time index on your
data when a hypertable is created.

```sql
CREATE INDEX ON conditions (time DESC);
```

Additionally, if the `create_hypertable` command specifies an optional
"space partition" in addition to time (say, the `location` column),
TimescaleDB automatically creates the following index:

```sql
CREATE INDEX ON conditions (location, time DESC);
```

This default behavior can be overridden when executing the [`create_hypertable`][create_hypertable] command.


[create_hypertable]: /api/:currentVersion:/hypertable/create_hypertable/
