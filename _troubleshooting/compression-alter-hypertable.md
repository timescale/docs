---
title: Cannot add column to a compressed hypertable
section: troubleshooting
products: [cloud, mst, self_hosted]
topics: [hypertables, compression]
errors:
  - language: text
    message: |-
      ERROR: cannot add column with constraints or defaults to a hypertable that has compression enabled
apis:
  - [compression, compress_chunk(), decompress_chunk(), recompress_chunk(), alter_table_compression]
  - [timescaledb_information.chunks, timescaledb_information.compression_settings]
  - [create_hypertable]
keywords: [hypertables, compression, alter_table]
tags: [hypertables, compression, alter_table, columns]
---

<!---
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem?
   Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same
   action is applied?
* Copy this comment at the top of every troubleshooting page
-->

If you attempt to add a column with constraints or defaults to a hypertable that
has compression enabled, you might get this error. To add the column, you need
to decompress the data in the hypertable, add the column, and then compress
the data.
