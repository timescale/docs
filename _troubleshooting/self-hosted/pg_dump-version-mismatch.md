---
title: Versions are mismatched when dumping and restoring a database
section: troubleshooting
products: [self_hosted]
topics: [backups]
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

 The PostgreSQL `pg_dump` command does not allow you to specify which version of
 the extension to use when backing up. This can create problems if you have a
 more recent version installed. For example, if you create the backup using an
 older version of TimescaleDB, and when you restore it uses the current version,
 without giving you an opportunity to upgrade first.

 You can work around this problem when you are restoring from backup by making
 sure the new PostgreSQL instance has the same extension version as the original
 database before you perform the restore. After the data is restored, you can
 upgrade the version of TimescaleDB.
