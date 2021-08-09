# Move data
The [`move_chunk`][api-move-chunk] function requires multiple tablespaces set up in PostgreSQL, so let's
start with a quick review of how this works.

## Creating a tablespace
First, add a storage mount that will serve as a home for your new tablespace. This
process will differ based on how you are deployed, but your system administrator
should be able to arrange setting up the mount point. The key here is to provision
your tablespace with storage that is appropriate for how its resident data will be used.

To create a [tablespace][] in Postgres:

```sql
CREATE TABLESPACE history
OWNER postgres
LOCATION '/mnt/history';
```

Here we are creating a tablespace called `history` that will be
owned by the default `postgres` user, using the storage mounted at `/mnt/history`.

## Move Chunks [](move_chunks)
Now that we have set up a new, empty tablespace, we can move individual chunks
to there from the default tablespace.  The move chunks command also allows you
to move indexes belonging to those chunks to the secondary tablespace (or
another one).

In addition, the [`move_chunk`][api-move-chunk] function has the
ability to "reorder" the chunk during the migration in order to enable faster
queries.  This behavior is similar to [`reorder_chunk`][api-reorder-chunk]; please
see that documentation for more information.

To determine which chunks to move, we can list chunks that fit a specific
criteria.  For example, to identify chunks older than two days:

```sql
SELECT show_chunks('conditions', older_than => INTERVAL '2 days');
```

We then can move `_timescaledb_internal._hyper_1_4_chunk` along with its index
over to `history`, while reordering the chunk based on its time index:


```sql
SELECT move_chunk(
  chunk => '_timescaledb_internal._hyper_1_4_chunk',
  destination_tablespace => 'history',
  index_destination_tablespace => 'history',
  reorder_index => '_timescaledb_internal._hyper_1_4_chunk_netdata_time_idx',
  verbose => TRUE
);
```
Once this successfully executes, we can verify that our chunk now lives on the
`history` tablespace by querying `pg_tables` to list all of the chunks that
are on `history`:

```sql
SELECT tablename from pg_tables
  WHERE tablespace = 'history' and tablename like '_hyper_%_%_chunk';
```

As you will see, the target chunk is now listed as residing on `history`; we
can similarly validate the location of our index:

```sql
SELECT indexname FROM pg_indexes WHERE tablespace = 'history';
```

## Additional data tiering examples [](other-examples)
After moving a chunk to a slower tablespace, you may want to move a chunk back
to the default, faster tablespace:

```sql
SELECT move_chunk(
  chunk => '_timescaledb_internal._hyper_1_4_chunk',
  destination_tablespace => 'pg_default',
  index_destination_tablespace => 'pg_default',
  reorder_index => '_timescaledb_internal._hyper_1_4_chunk_netdata_time_idx'
);
```

Alternatively, you may decide to move a data chunk to your slower tablespace,
but keep the chunk's indexes on the default, faster tablespace:

```sql
SELECT move_chunk(
  chunk => '_timescaledb_internal._hyper_1_4_chunk',
  destination_tablespace => 'history',
  index_destination_tablespace => 'pg_default',
  reorder_index => '_timescaledb_internal._hyper_1_4_chunk_netdata_time_idx'
);
```

You could perform the opposite as well (keeping the data in `pg_default` but
moving the index to `history`), or setup a third tablespace
(`history_indexes`) and move the data to `history` and its corresponding
indexes to `history_indexes`.

Finally, with the introduction of user-exposed automation in TimescaleDB 2.0,
you can use `move_chunk` within TimescaleDB's job scheduler framework.  Please see
our [Actions documentation][actions] for more information.

[api-move-chunk]: /api/:currentVersion:/hypertable/move_chunk
[api-reorder-chunk]: /api/:currentVersion:/hypertable/reorder_chunk
[tablespace]: https://www.postgresql.org/docs/10/sql-createtablespace.html
[actions]: /how-to-guides/user-defined-actions/
