To clean up resources associated with live migration, use the following command:

```sh
docker run --rm -it --name live-migration-clean \
    -e PGCOPYDB_SOURCE_PGURI=$SOURCE \
    -e PGCOPYDB_TARGET_PGURI=$TARGET \
    --pid=host \
    -v ~/live-migration:/opt/timescale/ts_cdc \
    timescale/live-migration:v0.0.9 clean --prune
```

The `--prune` flag is used to delete temporary files in the `~/live-migration` directory
that were needed for the migration process. It's important to note that executing the
`clean` command means you cannot resume the interrupted live migration.
