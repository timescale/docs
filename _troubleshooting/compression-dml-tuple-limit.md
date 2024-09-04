---
title: Tuple decompression limit exceeded by operation
section: troubleshooting
products: [cloud, mst, self_hosted]
topics: [hypertables, compression]
errors:
  - language: text
    message: |-
      ERROR: tuple decompression limit exceeded by operation
apis:
  - [compression]
  - [timescaledb_information.chunks, timescaledb_information.compression_settings]
keywords: [hypertables, compression, insert, update, delete]
tags: [hypertables, compression, insert, update, delete]
---

{/*
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem?
   Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same
   action is applied?
* Copy this comment at the top of every troubleshooting page
*/}

When inserting, updating, or deleting tuples from compressed chunks it might be necessary to decompress tuples. This happens either when you are updating existing tuples or have constraints that need to be verified during insert time. If you happen to trigger a lot of decompression with a single command, you may end up running out of storage space. For this reason, a limit has been put in place on the number of tuples you can decompress for a single command.

The limit can be increased or turned off (set to 0) like so:

```sql
-- set limit to a milion tuples
SET timescaledb.max_tuples_decompressed_per_dml_transaction TO 1000000;
-- disable limit by setting to 0
SET timescaledb.max_tuples_decompressed_per_dml_transaction TO 0;
```
