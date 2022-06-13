---
title: Drop a hypertable
topic: hypertables
section: do
excerpt: Drop a hypertable from a database
tags: [drop]
---

# Drop a hypertable
Drop a hypertable using a standard PostgreSQL [`DROP TABLE`][postgres-droptable]
command. This works for both regular and distributed hypertables:
```sql
DROP TABLE <TABLE_NAME>;
```

TimescaleDB deletes all data chunks belonging to the hypertable.

 [postgres-droptable]: https://www.postgresql.org/docs/current/sql-droptable.html
