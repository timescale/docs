---
title: Temporary file size limit exceeded when compressing chunks
section: troubleshooting
products: [cloud, mst, self_hosted]
topics: [hypertables, distributed hypertables, compression]
errors:
  - language: text
    message: |-
      ERROR: temporary file size exceeds temp_file_limit
apis:
  - [compression, compress_chunk(), add_compression_policy()]
  - [hypertables, create_hypertable()]
keywords: [compression, hypertables, distributed hypertables]
tags: [compression, hypertables, chunks]
---

<!---
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
-->

When you try to compress a chunk, especially if the chunk is very large, you
could get this error. Compression operations write files to a new compressed
chunk table, which is written in temporary memory. The maximum amount of
temporary memory available is determined by the `temp_file_limit` parameter. You
can work around this problem by adjusting the `temp_file_limit` and
`maintenance_work_mem` parameters.
