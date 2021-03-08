# Dropping a Hypertable

Dropping a hypertable works just like the standard `DROP TABLE` 
command, where TimescaleDB will correspondingly delete all chunks belonging 
to the hypertable.

```sql
DROP TABLE conditions;
```