### Alter a Hypertable [](alter)

You can execute standard `ALTER TABLE` commands against the hypertable ([PostgreSQL docs][postgres-altertable]).

```sql
ALTER TABLE conditions
  ADD COLUMN humidity DOUBLE PRECISION NULL;
```

TimescaleDB will then automatically propagate these schema changes to
the chunks that constitute this hypertable.

<highlight type="warning">
Altering a table's schema is quite efficient provided that the default
 value for any additional column is set to NULL.  If the default is set to a
 non-null value, TimescaleDB will need to fill in this value for all rows
 (of all chunks) belonging to this hypertable.
 </highlight>


 [postgres-altertable]: https://www.postgresql.org/docs/current/sql-altertable.html