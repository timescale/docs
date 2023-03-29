---
title: Drop a hypertable
excerpt: Delete a hypertable from your database
products: [cloud, mst, self_hosted]
keywords: [hypertables, delete]
tags: [delete]
---

# Drop a hypertable

Drop a hypertable using a standard PostgreSQL [`DROP TABLE`][postgres-droptable]
command:

```sql
DROP TABLE <TABLE_NAME>;
```

All data chunks belonging to the hypertable are deleted.

[postgres-droptable]: https://www.postgresql.org/docs/current/sql-droptable.html
