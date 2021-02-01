## CREATE INDEX (Transaction Per Chunk) 

```SQL
CREATE INDEX ... WITH (timescaledb.transaction_per_chunk, ...);
```

This option extends [`CREATE INDEX`][postgres-createindex] with the
ability to use a separate transaction for each chunk it creates an
index on, instead of using a single transaction for the entire hypertable.
This allows `INSERT`s, and other operations to to be performed concurrently
during most of the duration of the `CREATE INDEX` command.
While the index is being created on an individual chunk, it functions as
if a regular `CREATE INDEX` were called on that chunk, however other chunks are
completely un-blocked.

<highlight type="tip">
	This version of `CREATE INDEX` can be used as an alternative to `CREATE INDEX CONCURRENTLY`, which is not currently supported on hypertables.
</highlight>

<highlight type="warning">
	If the operation fails partway through, indexes may not be created on all hypertable chunks. If this occurs, the index on the root table of the hypertable will be marked as invalid (this can be seen by running `\d+` on the hypertable). The index will still work, and will be created on new chunks, but if you wish to ensure _all_ chunks have a copy of the index, drop and recreate it.
</highlight>


#### Sample Usage 

Anonymous index
```SQL
CREATE INDEX ON conditions(time, device_id) WITH (timescaledb.transaction_per_chunk);
```
Other index methods
```SQL
CREATE INDEX ON conditions(time, location) USING brin
  WITH (timescaledb.transaction_per_chunk);
```