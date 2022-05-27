# Move data for data tiering
PostgreSQL uses tablespaces to determine the physical location of your data. In
most cases, you want to use faster storage to store data that is accessed
frequently, and slower storage for data that is accessed less often.

In TimescaleDB, you can move chunks between different tablespaces using the
[`move_chunk`][api-move-chunk] API call.

<highlight type="note">
You must be logged in as a super user, such as the `postgres` user,
to use the `move_chunk()` API call.
</highlight>

## Move data
To set up data tiering, you first need to create the new tablespace and set
the storage mount point. You can then use the [`move_chunk`][api-move-chunk] API
call to move individual chunks from the default tablespace to the new
tablespace. The `move_chunk` command also allows you to move indexes belonging
to those chunks to an approprate tablespace.

Additionally, `move_chunk` allows you reorder the chunk during the migration.
This can be used to make your queries faster, and works in a similar way to the
[`reorder_chunk` command][api-reorder-chunk].

<procedure>

### Moving data
1.  Create a new tablespace. In this example, the tablespace is called
    `history`, it is owned by the `postgres` super user, and the mount point is
    `/mnt/history`:
    ```sql
    CREATE TABLESPACE history
    OWNER postgres
    LOCATION '/mnt/history';
    ```
1.  List chunks that you want to move. In this example, chunks that contain data
    that is older than two days:
    ```sql
    SELECT show_chunks('conditions', older_than => INTERVAL '2 days');
    ```
1.  Move a chunk and its index to the new tablespace. You can also reorder the
    data in this step. In this example, the chunk called
    `_timescaledb_internal._hyper_1_4_chunk` is moved to the `history`
    tablespace, and is reordered based on its time index:
    ```sql
    SELECT move_chunk(
      chunk => '_timescaledb_internal._hyper_1_4_chunk',
      destination_tablespace => 'history',
      index_destination_tablespace => 'history',
      reorder_index => '_timescaledb_internal._hyper_1_4_chunk_netdata_time_idx',
      verbose => TRUE
    );
    ```
1.  You can verify that the chunk now resides in the correct tablespace by
    querying `pg_tables` to list all of the chunks on the tablespace:
    ```sql
    SELECT tablename from pg_tables
      WHERE tablespace = 'history' and tablename like '_hyper_%_%_chunk';
    ```
    You can also verify that the index is in the correct location:
    ```sql
    SELECT indexname FROM pg_indexes WHERE tablespace = 'history';
    ```

</procedure>

## Move data in bulk
To move several chunks at once, select the chunks you want to move by using
`FROM show_chunks(...)`. For example, to move chunks containing data between 1
and 3 weeks old, in a hypertable named `example`:
```sql
SELECT move_chunk(
  chunk => i, 
  destination_tablespace => '<TABLESPACE>') 
FROM show_chunks('example', now() - INTERVAL '1 week', now() - INTERVAL '3 weeks') i;
```

## Examples
After moving a chunk to a slower tablespace, you can move it back to the
default, faster tablespace:

```sql
SELECT move_chunk(
  chunk => '_timescaledb_internal._hyper_1_4_chunk',
  destination_tablespace => 'pg_default',
  index_destination_tablespace => 'pg_default',
  reorder_index => '_timescaledb_internal._hyper_1_4_chunk_netdata_time_idx'
);
```

You can move a data chunk to the slower tablespace, but keep the chunk's indexes
on the default, faster tablespace:
```sql
SELECT move_chunk(
  chunk => '_timescaledb_internal._hyper_1_4_chunk',
  destination_tablespace => 'history',
  index_destination_tablespace => 'pg_default',
  reorder_index => '_timescaledb_internal._hyper_1_4_chunk_netdata_time_idx'
);
```

You can also keep the data in `pg_default` but move the index to `history`.
Alternatively, you can set up a third tablespace called `history_indexes`,
and move the data to `history` and the indexes to `history_indexes`.

In TimescaleDB 2.0 and later, you can use `move_chunk` with the job scheduler
framework. For more information, see the [user-defined actions section][actions].


[api-move-chunk]: /api/:currentVersion:/hypertable/move_chunk
[api-reorder-chunk]: /api/:currentVersion:/hypertable/reorder_chunk
[tablespace]: https://www.postgresql.org/docs/10/sql-createtablespace.html
[actions]: /how-to-guides/user-defined-actions/
