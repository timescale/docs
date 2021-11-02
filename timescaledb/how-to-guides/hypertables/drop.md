# Drop a hypertable
You can run standard [`DROP TABLE`][postgres-droptable] commands against both
regular and distributed hypertables:

```sql
DROP TABLE TABLE_NAME;
```

TimescaleDB deletes all data chunks belonging to the hypertable.


 [postgres-droptable]: https://www.postgresql.org/docs/current/sql-droptable.html
