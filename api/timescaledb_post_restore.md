## timescaledb_post_restore() 
Perform the proper operations after restoring the database has completed.
Specifically this resets the `timescaledb.restoring` GUC and restarts any
background workers. See [backup/restore docs][backup-restore] for more information.

### Sample Usage  

```sql
SELECT timescaledb_post_restore();
```

[backup-restore]: timescaledb/:currentVersion:/how-to-guides/backup-and-restore/pg-dump-and-restore/