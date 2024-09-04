---
title: Permission denied for table `job_errors` when running `pg_dump`
section: troubleshooting
products: [self_hosted]
topics: [backups]
errors:
  - language: bash
    message: |-
      pg_dump: error: query failed: ERROR: permission denied for table job_errors
      pg_dump: detail: Query was: LOCK TABLE _timescaledb_internal.job_errors IN ACCESS SHARE MODE
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

 When the `pg_dump` tool tries to acquire a lock on the `job_errors`
 table, if the user doesn't have the required SELECT permission, it
 results in this error.

To resolve this issue, use a superuser account to grant the necessary
permissions to the user requiring the `pg_dump` tool.
Use this command to grant permissions to `<TEST_USER>`:
```sql
GRANT SELECT ON TABLE _timescaledb_internal.job_errors TO <TEST_USER>;
```
