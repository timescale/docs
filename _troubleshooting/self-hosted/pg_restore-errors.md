---
title: Errors occur after restoring from file dump
section: troubleshooting
products: [self_hosted]
topics: [backups]
errors:
  - language: bash
    message: |-
      org.postgresql.util.PSQLException: ERROR: invalid INSERT on the root table of hypertable "_hyper_1_10_chunk.
keywords: [backups, restore]
---

{/*
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
*/}
 You might see the errors above when running `pg_restore`. When loading from a
 logical dump make sure that you set `timescaledb.restoring` to true before loading
 the dump.
