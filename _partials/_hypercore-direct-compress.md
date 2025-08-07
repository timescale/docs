<Highlight type="note">

Alternatively, if you have data in an existing database, you can migrate it
directly into your new $SERVICE_LONG using hypershift. For more information
about hypershift, including instructions for how to migrate your data, see the
[Migrate and sync data to $CLOUD_LONG][migrate].

</Highlight>

When you set `timescaledb.enable_direct_compress_copy` your data is compressed when it is ingested into memory
during `COPY` and `INSERT` calls. This means that WAL records are written for the compressed batches rather 
than the individual tuples. Also, the [columnstore policy][add_columnstore_policy] you set is less important, 
`INSERT` already produces compressed chunks. 

```sql
SET timescaledb.enable_direct_compress_copy=on;
```

[add_columnstore_policy]: /api/:currentVersion:/hypercore/add_columnstore_policy/
