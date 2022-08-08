---
title: Permission denied when changing ownership of tables and hypertables
section: troubleshooting
product: mst
topics: [hypertables]
errors:
  - language: bash
    message: |-
      ERROR: permission denied for schema _timescaledb_internal
keywords: [hypertables]
tags: [alter]
---

You might see this error when using the `ALTER TABLE` command to change the
ownership of tables or hypertables.

This use of `ALTER TABLE` is blocked because the `tsdbadmin` user is not a
superuser.

To change table ownership, use the [`REASSIGN`][sql-reassign] command instead:

```sql
REASSIGN OWNED BY <current_role> TO <desired_role>
```

[sql-reassign]: https://www.postgresql.org/docs/current/sql-reassign-owned.html
