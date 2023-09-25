---
api_name: timescaledb_post_restore()
excerpt: Resume normal operations after restoring a database
topics: [administration]
keywords: [admin]
tags: [restore, backup, background workers]
api:
  license: apache
  type: function
---

# timescaledb_post_restore()

Perform the required operations after you have finished restoring the database
using `pg_restore`. Specifically, this resets the `timescaledb.restoring` GUC
and restarts any background workers. For more information, see the
[backup and restore section][backup-restore].

## Sample usage

Prepare the database for normal use after a restore:

```sql
SELECT timescaledb_post_restore();
```

[backup-restore]: /migrate/:currentVersion:/pg-dump-and-restore/
