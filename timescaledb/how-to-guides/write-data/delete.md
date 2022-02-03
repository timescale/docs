# DELETE

Delete data from a hypertable using the standard [`DELETE`][postgres-delete] SQL
command.

```sql
DELETE FROM conditions WHERE temperature < 35 OR humidity < 60;

DELETE FROM conditions WHERE time < NOW() - INTERVAL '1 month';
```

After running a large `DELETE` operation, [`VACUUM`][postgres-vacuum] or `VACUUM
FULL` the hypertable to reclaim storage from deleted or obsolete rows.

<highlight type="tip"> 
To delete old data, use
[`drop_chunks`](https://docs.timescale.com/api/latest/hypertable/drop_chunks/)
instead. `drop-chunks` is more performant as it deletes entire chunks by
removing files, rather than deleting individual rows that need vacuuming. To
learn more, see the [data retention 
section](https://docs.timescale.com/timescaledb/latest/how-to-guides/data-retention/).
</highlight>


[postgres-delete]: https://www.postgresql.org/docs/current/static/sql-delete.html
[postgres-vacuum]: https://www.postgresql.org/docs/current/static/sql-vacuum.html
