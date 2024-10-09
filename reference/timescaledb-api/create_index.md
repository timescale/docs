---
api_name: CREATE INDEX (Transaction Per Chunk)
excerpt: Create a hypertable index using a separate transaction for each chunk
topics: [hypertables]
keywords: [hypertables, indexes, chunks, create]
api:
  license: apache
  type: command
---

# CREATE INDEX (Transaction Per Chunk)

```SQL
CREATE INDEX ... WITH (timescaledb.transaction_per_chunk, ...);
```

This option extends [`CREATE INDEX`][postgres-createindex] with the ability to
use a separate transaction for each chunk it creates an index on, instead of
using a single transaction for the entire hypertable. This allows `INSERT`s, and
other operations to be performed concurrently during most of the duration of the
`CREATE INDEX` command. While the index is being created on an individual chunk,
it functions as if a regular `CREATE INDEX` were called on that chunk, however
other chunks are completely un-blocked.

<Highlight type="note">
This version of `CREATE INDEX` can be used as an alternative to
`CREATE INDEX CONCURRENTLY`, which is not currently supported on hypertables.
</Highlight>

<Highlight type="warning">
If the operation fails partway through, indexes might not be created on all
hypertable chunks. If this occurs, the index on the root table of the hypertable
is marked as invalid. You can check this by running `\d+` on the hypertable. The
index still works, and is created on new chunks, but if you want to ensure all
chunks have a copy of the index, drop and recreate it.

You can also use the following query to find all invalid indexes:

```SQL
SELECT * FROM pg_index i WHERE i.indisvalid IS FALSE;
```

</Highlight>

### Sample usage

Create an anonymous index:

```SQL
CREATE INDEX ON conditions(time, device_id)
    WITH (timescaledb.transaction_per_chunk);
```

Alternatively:

```SQL
CREATE INDEX ON conditions USING brin(time, location)
    WITH (timescaledb.transaction_per_chunk);
```

[postgres-createindex]: https://www.postgresql.org/docs/current/manage-ag-tablespaces.html
