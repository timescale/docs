---
api_name: timescaledb_pre_restore()
excerpt: Prepare a database for data restoration
topics: [administration]
keywords: [admin]
tags: [restore, backup, background workers]
api:
  license: apache
  type: function
---

# timescaledb_pre_restore()

Perform the required operations so that you can restore the database using
`pg_restore`. Specifically, this sets the `timescaledb.restoring` GUC to `on`
and stops any background workers which could have been performing tasks. The
background workers are stopped until the
[`timescaledb_post_restore`][timescaledb_post_restore]
function is run, after the restore operation is complete.

For more information, see the [backup and restore section][backup-restore].

<Highlight type="important">
After using `timescaledb_pre_restore()`, you need to run
[`timescaledb_post_restore`](/api/latest/administration/timescaledb_post_restore/)
before you can use the database normally.
</Highlight>

## Sample usage

Prepare to restore the database:

```sql
SELECT timescaledb_pre_restore();
```

[backup-restore]: /use-timescale/:currentVersion:/migration/pg-dump-and-restore/
[timescaledb_post_restore]: /api/:currentVersion:/administration/timescaledb_post_restore/
