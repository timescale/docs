---
title: Indexing data
excerpt: How indexes work
products: [cloud, mst, self_hosted]
keywords: [schemas, indexes]
---

# Indexing data

Because looking up data can take a long time, especially if you have a lot of
data in your hypertable, you can use an index to speed up read operations. You
can create an index on any combination of columns, as long as you include the
`time` column, for time-series data. Which column you choose to create your
index on depends on what kind of data you have stored.

<Highlight type="note">
While it is possible to add an index that does not include the `time` column,
doing so results in very slow ingest speeds. For time-series data, indexing
on the time column allows one index to be created per chunk.
</Highlight>

Consider a simple example with temperatures collected from two locations named
`office` and `garage`:

An index on `(location, time DESC)` is organized like this:

```sql
garage-0940
garage-0930
garage-0920
garage-0910
office-0930
office-0920
office-0910
```

An index on `(time DESC, location)` is organized like this:

```sql
0940-garage
0930-garage
0930-office
0920-garage
0920-office
0910-garage
0910-office
```

A good rule of thumb with indexes is to think in layers. Start by choosing the
columns that you typically want to run equality operators on, such as
`location = garage`. Then finish by choosing columns you want to use range
operators on, such as `time > 0930`.

As a more complex example, imagine you have a number of devices tracking
1,000 different retail stores. You have 100 devices per store, and 5 different
types of devices. All of these devices report metrics as `float` values, and you
decide to store all the metrics in the same table, like this:

```sql
CREATE TABLE devices (
     time timestamptz,
     device_id int,
     device_type int,
     store_id int,
     value float
);
```

When you create this table, an index is automatically generated on the time
column, making it faster to query your data based on time.

If you want to query your data on something other than time, you can create
different indexes. For example, you might want to query data from the last month
for just a given `device_id`. Or you could query all data for a single
`store_id` for the last three months.

You want to keep the index on time so that you can quickly filter for a given
time range, and add another index on `device_id` and `store_id`. This creates a
composite index. A composite index on `(store_id, device_id, time)` orders by
`store_id` first. Each unique `store_id`, will then be sorted by `device_id` in
order. And each entry with the same `store_id` and `device_id` are then ordered
by `time`. To create this index, use this command:

```sql
CREATE INDEX ON devices (store_id, device_id, time DESC);
```

When you have this composite index on your hypertable, you can run a range of
different queries. Here are some examples:

```sql
SELECT * FROM devices WHERE store_id = x
```

This queries the portion of the list with a specific store_id. The index is
effective for this query, but could be a bit bloated; an index on just
`store_id` would probably be more efficient.

```sql
SELECT * FROM devices WHERE store_id = x, time > 10
```

This query is not effective, because it would need to scan multiple sections of
the list. This is because the part of the list that contains data for
`time > 10` for one device would be located in a different section than for a
different device. In this case, consider building an index on `(store_id, time)`
instead.

```sql
SELECT * FROM devices WHERE device_id = M, time > 10
```

The index in the example is useless for this query, because the data for
`device M` is located in a completely different section of the list for each
`store_id`.

```sql
SELECT * FROM devices WHERE store_id = M, device_id = M, time > 10
```

This is an accurate query for this index. It narrows down the list to a very
specific portion.
