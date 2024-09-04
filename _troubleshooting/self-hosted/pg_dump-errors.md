---
title: Errors occur when running `pg_dump`
section: troubleshooting
products: [self_hosted]
topics: [backups]
errors:
  - language: bash
    message: |-
      pg_dump: NOTICE:  hypertable data are in the chunks, no data will be copied
      DETAIL:  Data for hypertables are stored in the chunks of a hypertable so COPY TO of a hypertable will not copy any data.
      HINT:  Use "COPY (SELECT * FROM <hypertable>) TO ..." to copy all data in hypertable, or copy each chunk individually.
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
 You might see the errors above when running `pg_dump`. You can safely ignore
 these. Your hypertable data is still accurately copied.
