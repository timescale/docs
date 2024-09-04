---
title: TimescaleDB upgrade fails with no update path
section: troubleshooting
products: [self_hosted]
topics: [upgrades]
errors:
  - language: sql
    message: |-
      ERROR: extension "timescaledb_toolkit" has no update path from version "1.2" to version "1.3"
keywords: [upgrades]
tags: [upgrade]
---

{/*
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
*/}

In some cases, when you use the `ALTER EXTENSION timescaledb UPDATE` command to
upgrade, it might fail with the above error.

This occurs if the list of available extensions does not include the version you
are trying to upgrade to, and it can occur if the package was not installed
correctly in the first place. To correct the problem, install the upgrade
package, restart PostgreSQL, verify the version, and then attempt the upgrade
again.
