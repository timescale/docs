# Dropping a Distributed Hypertable

Dropping a distributed hypertable works just like the standard `DROP TABLE` 
command, where TimescaleDB will correspondingly delete all chunks belonging 
to the distributed hypertable.

```sql
DROP TABLE conditions;
```