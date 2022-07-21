---
title: Alter a hpyertable
excerpt: How to alter a hypertable
keywords: [hypertables, schemas, alter]
tags: [change]
---

# Alter a hypertable
You can alter a hypertable, for example to add a column, by using a standard
[`ALTER TABLE`][postgres-altertable] command. This works for both regular and
distributed hypertables.

In the following example, the hypertable is named `conditions` and the new
column is named `humidity`:
```sql
ALTER TABLE conditions
  ADD COLUMN humidity DOUBLE PRECISION NULL;
```

<highlight type="note">
Adding a column is efficient so long as you set its default value to `NULL`. If
you set the default to a non-null value, it takes longer, because TimescaleDB
needs to fill in this value for all existing rows of all existing chunks.
</highlight>

[postgres-altertable]: https://www.postgresql.org/docs/current/sql-altertable.html
