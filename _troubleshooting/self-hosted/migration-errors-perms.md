---
title: Errors encountered during a pg_dump migration
section: troubleshooting
products: [self_hosted]
topics: [migration]
errors:
  - language: bash
    message: |-
          pg_restore: creating EXTENSION "timescaledb"
          pg_restore: creating COMMENT "EXTENSION timescaledb"
          pg_restore: while PROCESSING TOC:
          pg_restore: from TOC entry 6239; 0 0 COMMENT EXTENSION timescaledb
          pg_restore: error: could not execute query: ERROR:  must be owner of extension timescaledb

keywords: [migration, pg_dump, permissions]
tags: [migration, pg_dump]
---

<!---
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
-->

The `pg_restore` function tries to apply the TimescaleDB extension when it
copies your schema. This can cause a permissions error. If you already have the
TimescaleDB extension installed, you can safely ignore this.
