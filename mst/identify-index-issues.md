---
title: Identify and resolve issues with indexes in Managed Service for TimescaleDB
excerpt: Identify and resolve issues with PostgreSQL indexes in Managed Service for TimescaleDB
products: [mst]
keywords: [index, REINDEX]
---

# Identify and repair issues with PostgreSQL indexes with `REINDEX`

PostgreSQL indexes can be corrupted for a variety of reasons, including
software bugs, hardware failures, or unexpected duplicated data. `REINDEX` allows
you to rebuild the index in such situations.

## Rebuild non-unique indexes

You can rebuild corrupted indexes that do not have `UNIQUE` in their definition.
You can run the `REINDEX` command for all indexes of a table (`REINDEX TABLE`),
and for all indexes in the entire database (`REINDEX DATABASE`).
For more information on the `REINDEX` command, see the [PostgreSQL documentation][postgres-docs].

This command creates a new index that replaces the old one:

```sql
REINDEX INDEX <index-name>;
```

<Highlight type="note">
When you use `REINDEX`, the tables are locked and you may not be able to use the
database, until the operation is complete.
</Highlight>

In some cases, you might need to manually build a second index concurrently
with the old index, and then remove the old index:

```sql
CREATE INDEX CONCURRENTLY test_index_new ON table_a (...);
DROP INDEX CONCURRENTLY test_index_old;
ALTER INDEX test_index_new RENAME TO test_index;
```

## Rebuild unique indexes

A `UNIQUE` index works on one or more columns where the combination is unique
in the table. When the index is corrupted or disabled, duplicated
physical rows appear in the table, breaking the uniqueness constraint of the
index. When you try to rebuild an index that is not unique, the `REINDEX` command fails.
To resolve this issue, first remove the duplicate rows from the table and then
rebuild the index.

### Identify conflicting duplicated rows

To identify conflicting duplicate rows, you need to run a query that counts the
number of rows for each combination of columns included in the index definition.

For example, this `route` table has a `unique_route_index` index defining
unique rows based on the combination of the `source` and `destination` columns:

```sql
CREATE TABLE route(
    source TEXT,
    destination TEXT,
    description TEXT
    );

CREATE UNIQUE INDEX unique_route_index
    ON route (source, destination);
```

If the `unique_route_index` is corrupt, you can find duplicated rows in the
`route` table using this query:

```sql
SELECT
    source,
    destination,
    count
FROM
    (SELECT
        source,
        destination,
        COUNT(*) AS count
    FROM route
    GROUP BY
        source,
        destination) AS foo
WHERE count > 1;
```

The query groups the data by the same `source` and `destination` fields defined
in the index, and filters any entries with more than one occurrence.

Resolve the problematic entries in the rows by manually deleting or merging the
entries until no duplicates exist. After all duplicate entries are removed, you
can use the `REINDEX` command to rebuild the index.

[postgres-docs]: https://www.postgresql.org/docs/current/sql-reindex.html
