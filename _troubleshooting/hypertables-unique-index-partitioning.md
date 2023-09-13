---
title: Can't create unique index on hypertable, or can't create hypertable with unique index
section: troubleshooting
products: [cloud, mst, self_hosted]
topics: [hypertables, distributed hypertables]
errors:
  - language: text
    message: |-
      ERROR: cannot create a unique index without the column "<COLUMN_NAME>" (used in partitioning)
apis:
  - [hypertables, create_hypertable()]
  - [distributed hypertables, create_distributed_hypertable()]
keywords: [hypertables, distributed hypertables, indexes, partitions]
tags: [hypertables, distributed hypertables, indexes, primary keys, partitions]
---

<!---
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
-->

You might get a unique index and partitioning column error in 2 situations:

*   When creating a primary key or unique index on a hypertable
*   When creating a hypertable from a table that already has a unique index or
    primary key

For more information on how to fix this problem, see the
[section on creating unique indexes on hypertables][unique-indexes].

[unique-indexes]: /use-timescale/:currentVersion:/hypertables/hypertables-and-unique-indexes/
