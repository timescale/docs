---
title: Corrupted unique index has duplicated rows
section: troubleshooting
products: [mst]
topics: [performance]
errors:
  - language: text
    message: |-
       ERROR:  could not create unique index
       DETAIL:  Table contains duplicated values.
keywords: [unique index, corrupt, REINDEX]
tags: [mst, index, performance,]
---

{/*
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
*/}

When you try to rebuild index with `REINDEX` it fails because of conflicting
duplicated rows.

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
