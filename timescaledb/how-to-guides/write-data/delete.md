## DELETE [](delete)

Data can be deleted from a hypertable using the standard `DELETE` SQL
command ([PostgreSQL docs][postgres-delete]), which will propagate
down to the appropriate chunks that comprise the hypertable.

```sql
DELETE FROM conditions WHERE temperature < 35 OR humidity < 60;

DELETE FROM conditions WHERE time < NOW() - INTERVAL '1 month';
```

After running a large `DELETE` operation, users are recommended to
`VACUUM` or `VACUUM FULL` the hypertable to reclaim storage occupied
by deleted or obsoleted rows ([PostgreSQL docs][postgres-vacuum]).

<highlight type="tip">
For deleting old data, such as in the second example
 above, we recommend using the TimescaleDB function
 [`drop_chunks`][drop_chunks] instead.  This feature is much more
 performant: it deletes entire *chunks* of data (basically, removing
 files), rather than at the individual row level (necessitating
 vacuuming). See the section on [data retention][].
</highlight>


[postgres-delete]: https://www.postgresql.org/docs/current/static/sql-delete.html
[postgres-vacuum]: https://www.postgresql.org/docs/current/static/sql-vacuum.html
[drop_chunks]: /api#drop_chunks
[data retention]: /using-timescaledb/data-retention