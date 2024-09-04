---
title: Dropping chunks times out
section: troubleshooting
products: [cloud, mst, self_hosted]
topics: [data retention, hypertables]
apis:
  - [hypertables, drop_chunks()]
keywords: [data retention, chunks]
tags: [drop, delete, locks]
---

{/*
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
*/}

When you drop a chunk, it requires an exclusive lock. If a chunk is being
accessed by another session, you cannot drop the chunk at the same time. If a
drop chunk operation can't get the lock on the chunk, then it times out and the
process fails. To resolve this problem, check what is locking the chunk. In some
cases, this could be caused by a continuous aggregate or other process accessing
the chunk. When the drop chunk operation can get an exclusive lock on the chunk,
it completes as expected.

For more information about locks, see the
[PostgreSQL lock monitoring documentation][pg-lock-monitoring].

[pg-lock-monitoring]: https://wiki.postgresql.org/wiki/Lock_Monitoring
