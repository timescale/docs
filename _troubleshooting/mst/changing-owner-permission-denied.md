---
title: Permission denied when changing ownership of tables and hypertables
section: troubleshooting
products: [mst]
topics: [hypertables]
errors:
  - language: bash
    message: |-
      ERROR: permission denied for schema _timescaledb_internal
keywords: [hypertables]
tags: [alter]
---

{/*
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
*/}

You might see this error when using the `ALTER TABLE` command to change the
ownership of tables or hypertables.

This use of `ALTER TABLE` is blocked because the `tsdbadmin` user is not a
superuser.

To change table ownership, use the [`REASSIGN`][sql-reassign] command instead:

```sql
REASSIGN OWNED BY <current_role> TO <desired_role>
```

[sql-reassign]: https://www.postgresql.org/docs/current/sql-reassign-owned.html
