---
title: Altering and updating table schemas
excerpt: In TimescaleDB, you can modify the schema of an existing hypertable with the ALTER TABLE command. See examples for adding a table and checking the schema before applying it
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

## Altering hypertables with columnstore enabled

Most common schema modifications work on hypertables with columnstore enabled, including adding
columns, renaming columns, dropping columns, adding constraints, setting NOT NULL,
and changing defaults. However, some operations are blocked, the most common of them being:

- **Changing column data type** (`ALTER COLUMN ... TYPE`)
- **Changing column storage** (`ALTER COLUMN ... SET STORAGE`)
- **Dropping orderby or segmentby columns**
- **Row-level security operations** (`ENABLE/DISABLE ROW SECURITY`)

When you attempt a blocked operation, you receive an error:

```
ERROR: operation not supported on hypertables that have columnstore enabled
```

If you encounter this error, you need to:

1. Stop any columnstore policy
2. Convert the affected chunks back into rowstore
3. Disable columnstore
4. Perform the schema change
5. Re-enable columnstore and restart the policy

### Example: Changing column type on a hypertable with columnstore enabled

This example shows how to change a column's data type on a hypertable with
columnstore enabled, which requires conversion to rowstore:

```sql
-- Step 1: Check if you have a columnstore policy and note its settings
SELECT job_id, config FROM timescaledb_information.jobs
WHERE proc_name = 'policy_compression'
  AND hypertable_name = 'conditions';

-- Step 2: If a policy exists, pause it
SELECT alter_job(<job_id>, scheduled => false);

-- Step 3: Convert all chunks back to rowstore
-- For all chunks:
SELECT decompress_chunk(show_chunks('conditions'));

-- Or for specific time ranges:
SELECT decompress_chunk(c)
FROM show_chunks('conditions', older_than => INTERVAL '1 month') c;

-- Step 4: Disable columnstore (required for some operations)
ALTER TABLE conditions SET (timescaledb.enable_columnstore = false);

-- Step 5: Perform the schema modification
ALTER TABLE conditions
  ALTER COLUMN temperature TYPE numeric(10,2);

-- Step 6: Re-enable columnstore with original settings
ALTER TABLE conditions SET (
  timescaledb.enable_columnstore = true,
  timescaledb.compress_orderby = 'time DESC',
  timescaledb.compress_segmentby = 'device_id'
);

-- Step 7: Restart the columnstore policy
SELECT alter_job(<job_id>, scheduled => true);

-- Step 8: Optionally, manually convert the chunks to columnstore immediately
SELECT compress_chunk(chunk_schema || '.' || chunk_name)
FROM timescaledb_information.chunks
WHERE hypertable_name = 'conditions'
  AND is_compressed = false;
```

For more information about PostgreSQL ALTER TABLE operations, see the
[$PG ALTER TABLE documentation][postgres-alter-table].

[postgres-alter-table]: https://www.postgresql.org/docs/current/sql-altertable.html
