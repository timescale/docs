---
title: Upgrading fails with an error saying "old version has already been loaded"
section: troubleshooting
topics: [upgrades]
errors:
  - language: sql
    message: |-
      ERROR: extension "timescaledb" cannot be updated after the old version has already been loaded
keywords: [upgrade]
tags: [upgrade]
---

When you use the `ALTER EXTENSION timescaledb UPDATE` command to upgrade, this
error might appear.

This occurs if you don't run `ALTER EXTENSION timescaledb UPDATE` command as the
first command after starting a new session using psql or if you use tab
completion when running the command. Tab completion triggers metadata queries in
the background which prevents the alter extension from being the first command.

To correct the problem, execute the ALTER EXTENSION command like this:

``sql
psql -X -c 'ALTER EXTENSION timescaledb UPDATE;'
```
