---
title: Can't access file "timescaledb-VERSION" after update
section: troubleshooting
products: [self_hosted]
topics: [upgrades]
errors:
  - language: text
    message: |-
      ERROR: could not access file "timescaledb-<VERSION>": No such file or directory
keywords: [updates]
---

<!---
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
-->

If the error occurs immediately after updating your version of TimescaleDB and
the file mentioned is from the previous version, it is probably due to an incomplete
update process. Within the greater PostgreSQL server instance, each
database that has TimescaleDB installed needs to be updated with the SQL command
`ALTER EXTENSION timescaledb UPDATE;` while connected to that database. Otherwise,
the database looks for the previous version of the timescaledb files.

See [our update docs][update-db] for more info.

[update-db]: /self-hosted/:currentVersion:/upgrades/
