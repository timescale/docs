---
title: Altering and updating table schemas
excerpt: Modify the schema of an existing hypertable
products: [cloud, mst, self_hosted]
keywords: [hypertables, schemas, alter]
tags: [change]
---

# Altering and updating table schemas

To modify the schema of an existing hypertable, you can use the `ALTER TABLE`
command. When you change the hypertable schema, the changes are also propagated
to each underlying chunk.

<Highlight type="note">
While you can change the schema of an existing hypertable, you cannot change
the schema of a continuous aggregate. For continuous aggregates, the only
permissible changes are renaming a view, setting a schema, changing the owner,
and adjusting other parameters.
</Highlight>

For example, to add a new column called `address` to a table called `distributors`:

```sql
ALTER TABLE distributors
  ADD COLUMN address varchar(30);
```

This creates the new column, with all existing entries recording `NULL` for the
new column.

Changing the schema can, in some cases, consume a lot of resources. This is
especially true if it requires underlying data to be rewritten. If you want to
check your schema change before you apply it, you can use a `CHECK` constraint,
like this:

```sql
ALTER TABLE distributors
  ADD CONSTRAINT zipchk
  CHECK (char_length(zipcode) = 5);
```

This scans the table to verify that existing rows meet the constraint, but does
not require a table rewrite.

For more information, see the
[PostgreSQL ALTER TABLE documentation][postgres-alter-table].

[postgres-alter-table]: https://www.postgresql.org/docs/current/static/sql-altertable.html
