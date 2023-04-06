---
title: Errors encountered during a pg_dump migration
section: troubleshooting
products: [self_hosted]
topics: [migration]
errors:
  - language: bash
    message: |-
          pg_dump: warning: there are circular foreign-key constraints on this table:
          pg_dump: hypertable
          pg_dump: You might not be able to restore the dump without using --disable-triggers or temporarily dropping the constraints.
          pg_dump: Consider using a full dump instead of a --data-only dump to avoid this problem.
  - language: bash
    message: |-
          pg_dump: NOTICE:  hypertable data are in the chunks, no data will be copied
          DETAIL:  Data for hypertables are stored in the chunks of a hypertable so COPY TO of a hypertable will not copy any data.
          HINT:  Use "COPY (SELECT * FROM <hypertable>) TO ..." to copy all data in hypertable, or copy each chunk individually.
  - language: bash
    message: |-
          WARNING:  skipping "<TABLE OR INDEX>" --- only superuser can analyze it

keywords: [migration, pg_dump]
tags: [migration, pg_dump]
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

If you see these errors during the migration process, you can safely ignore
them. The migration still occurs successfully.
