---
title: Reindex hypertables to fix large indexes
section: troubleshooting
products: [cloud, mst, self_hosted]
topics: [hypertables, distributed hypertables, schema management, data retention, compression]
errors:
  - language: bash
    message: |-
      ERROR:  invalid attribute number -6 for _hyper_2_839_chunk
      CONTEXT:  SQL function "hypertable_local_size" statement 1 PL/pgSQL function hypertable_detailed_size(regclass) line 26 at RETURN QUERY SQL function "hypertable_size" statement 1
      SQL state: XX000
apis:
  - [hypertables, hypertable_size()]
  - [hypertables, hypertable_detailed_size()]
  - [hypertables, hypertable_index_size()]
  - [hypertables, chunks_detailed_size()]
keywords: [jobs, policies, actions]
tags: [hypertables, chunks, index, schema management, data retention, compression]
---

{/*
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
*/}

You might see this error if your hypertable indexes have become very large. To
resolve the problem, reindex your hypertables with this command:

```sql
reindex table _timescaledb_internal._hyper_2_1523284_chunk
```

For more information, see the [hypertable documentation][hypertables].

[hypertables]: /use-timescale/:currentVersion:/hypertables/
