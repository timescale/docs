---
title: Hypershift migration runs slowly
section: troubleshooting
products: [cloud, mst, self_hosted]
topics: [database migration]
keywords: [migration, hypershift]
tags: [hypershift, migration, ingest, postgresql]
---

<!---
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
-->

When you migrate a PostgreSQL database to Timescale using the Hypershift tool,
the migration can run very slowly if you do not have an index on the `time`
column. Hypershift uses the index to determine how to perform the migration. It
uses the index to break the database into parts that it can copy in parallel.
Additionally, if you have compression enabled on the destination table,
Hypershift can compress each part immediately after it is copied, which uses
less storage during the migration. Without an index, Hypershift attempts to copy
the entire table at once instead. To resolve this problem, create a `btree` index
on the `time` column. However, creating an index can take some time, as the
entire table needs to be read from disk. You can create the `btree` index with
this command:

```sql
CREATE INDEX ON "<TABLE_NAME>" USING btree (time);
```

<Highlight type="important">
Hypershift is not able to efficiently copy and compress data when the only
index is a composite index where `time` is not the first indexed column. If you
already have such a composite index, ensure that your source database has a
plain index before you run the Hypershift migration.
</Highlight>
