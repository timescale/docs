---
title: Alter a hypertable
excerpt: How to alter a hypertable
products: [cloud, mst, self_hosted]
keywords: [hypertables, schemas, alter]
tags: [change]
---

# Alter a hypertable

You can alter a hypertable, for example to add a column, by using the PostgreSQL
[`ALTER TABLE`][postgres-altertable] command. This works for both regular and
distributed hypertables.

## Add a column to a hypertable

You can add a column to a hypertable using the `ALTER TABLE` command. In this
example, the hypertable is named `conditions` and the new column is named
`humidity`:

```sql
ALTER TABLE conditions
  ADD COLUMN humidity DOUBLE PRECISION NULL;
```

If the column you are adding has the default value set to `NULL`, or has no
default value, then adding a column is relatively fast. If you set the default
to a non-null value, it takes longer, because it needs to fill in this value for
all existing rows of all existing chunks.

<Highlight type="important">
You cannot add a column with constraints or defaults to a hypertable that has
compression enabled. To add the column, you need to decompress the data in the
hypertable, add the column, and then recompress the data.
</Highlight>

## Rename a hypertable

You can change the name of a hypertable using the `ALTER TABLE` command. In this
example, the hypertable is called `conditions`, and is being changed to the new
name, `weather`:

```sql
ALTER TABLE conditions
  RENAME TO weather;
```

[postgres-altertable]: https://www.postgresql.org/docs/current/sql-altertable.html
