## timescaledb_post_restore() 
Perform the proper operations after restoring the database has completed.
Specifically this resets the `timescaledb.restoring` GUC and restarts any
background workers. See [backup/restore docs][backup-restore] for more information.

### Sample usage  

```sql
SELECT timescaledb_post_restore();
```