# Alter a hypertable
You can run standard [`ALTER TABLE`][postgres-altertable] commands against both
regular and distributed hypertables.

```sql
ALTER TABLE TABLE_NAME
  ADD COLUMN humidity DOUBLE PRECISION NULL;
```

TimescaleDB automatically propagates the schema changes to
the chunks of the hypertable.

<highlight type="note">
Altering a table's schema is quite efficient provided that the default value for
any additional column is set to NULL.  If the default is set to a non-null
value, TimescaleDB needs to fill in this value for all rows of all chunks
belonging to the hypertable.
</highlight>

[postgres-altertable]: https://www.postgresql.org/docs/current/sql-altertable.html
