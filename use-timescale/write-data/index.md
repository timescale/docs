---
title: Write data
excerpt: Learn to write data in a TimescaleDB database with SQL
products: [cloud, mst, self_hosted]
keywords: [ingest]
tags: [write]
---

# Write data

Writing data in $TIMESCALE_DB works the same way as writing data to regular
$PG. You can add and modify data in both regular tables and hypertables
using `INSERT`, `UPDATE`, and `DELETE` statements.

*   [Learn about writing data in $TIMESCALE_DB][about-writing-data]
*   [Insert data][insert] into hypertables
*   [Update data][update] in hypertables
*   [Upsert data][upsert] into hypertables
*   [Delete data][delete] from hypertables

To find out how to add and sync data to your $SERVICE_SHORT from other sources, see 
[Import and sync][ingest-data].

[about-writing-data]: /use-timescale/:currentVersion:/write-data/about-writing-data/
[delete]: /use-timescale/:currentVersion:/write-data/delete/
[ingest-data]: /migrate/:currentVersion:
[insert]: /use-timescale/:currentVersion:/write-data/insert/
[update]: /use-timescale/:currentVersion:/write-data/update/
[upsert]: /use-timescale/:currentVersion:/write-data/upsert/
